import sql from "../config/db.js";
import axios from '../config/axios.js';
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Groq from "groq-sdk";
import { PdfReader } from "pdfreader";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const groqGenerate = async (prompt) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2048,
  });
  return completion.choices[0].message.content;
};

// Helper: extract text from PDF buffer
const extractPdfText = (buffer) => {
  return new Promise((resolve, reject) => {
    const lines = [];
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) return reject(err);
      if (!item) return resolve(lines.join(" "));
      if (item.text) lines.push(item.text);
    });
  });
};

// Write Article (free — no auth required)
export const generateArticle = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.json({ success: false, message: "Prompt is required" });
    const text = await groqGenerate(prompt);
    res.json({ success: true, content: text });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Blog Title
export const generateBlogTitle = async (req, res) => {
  try {
    const { prompt } = req.body;
    const { plan, free_usage } = req;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({ success: false, message: "Free limit reached. Upgrade to Premium." });
    }

    const fullPrompt = `Generate 5 catchy, SEO-friendly blog title suggestions for the following topic. Return only the titles as a numbered list.\n\nTopic: ${prompt}`;
    const content = await groqGenerate(fullPrompt);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${req.userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== "premium") {
      await sql`UPDATE users SET free_usage = ${free_usage + 1} WHERE id = ${req.userId}`;
    }

    res.json({ success: true, content });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Generate Image — using Pollinations AI (free, no API key needed)
export const generateImage = async (req, res) => {
  try {
    const { prompt, publish } = req.body;
    const { plan } = req;

    if (plan !== "premium") {
      return res.json({ success: false, message: "Image generation is a Premium feature." });
    }

    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const base64 = `data:image/jpeg;base64,${Buffer.from(response.data, "binary").toString("base64")}`;
    const { secure_url } = await cloudinary.uploader.upload(base64);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${req.userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    res.json({ success: true, content: secure_url });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Remove Background
export const removeImageBackground = async (req, res) => {
  try {
    const { plan } = req;
    const image = req.file;

    if (plan !== "premium") {
      return res.json({ success: false, message: "Background removal is a Premium feature." });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [{ effect: "background_removal" }],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${req.userId}, ${"Remove background"}, ${secure_url}, 'image')
    `;

    res.json({ success: true, content: secure_url });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Remove Object
export const removeImageObject = async (req, res) => {
  try {
    const { object } = req.body;
    const { plan } = req;
    const image = req.file;

    if (plan !== "premium") {
      return res.json({ success: false, message: "Object removal is a Premium feature." });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);
    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${req.userId}, ${`Remove ${object}`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Resume Review
export const resumeReview = async (req, res) => {
  try {
    const { plan } = req;
    const resume = req.file;

    if (plan !== "premium") {
      return res.json({ success: false, message: "Resume review is a Premium feature." });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({ success: false, message: "File too large. Max 5MB." });
    }

    const buffer = fs.readFileSync(resume.path);
    const resumeText = await extractPdfText(buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return res.json({ success: false, message: "Could not extract text from PDF. Make sure it's a text-based PDF, not a scanned image." });
    }

    const prompt = `You are an expert career coach. Review this resume and provide:
1. Overall score out of 10
2. Key strengths (bullet points)
3. Areas for improvement (bullet points)
4. Specific suggestions to strengthen it
5. ATS optimization tips

Resume:
${resumeText}`;

    const content = await groqGenerate(prompt);

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${req.userId}, ${"Resume review"}, ${content}, 'resume-review')
    `;

    res.json({ success: true, content });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};