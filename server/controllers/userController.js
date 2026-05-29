import sql from "../config/db.js";

// Get user creations
export const getUserCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations 
      WHERE user_id = ${req.userId} 
      ORDER BY created_at DESC
    `;
    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get published creations
export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations 
      WHERE publish = true 
      ORDER BY created_at DESC
    `;
    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Toggle like creation
export const toggleLikeCreation = async (req, res) => {
  try {
    const { id } = req.body;
    const userId = req.userId.toString();

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    let updatedLikes;
    let message;

    if (currentLikes.includes(userId)) {
      updatedLikes = currentLikes.filter((u) => u !== userId);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userId];
      message = "Creation Liked";
    }

    const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`
      UPDATE creations 
      SET likes = ${formattedArray}::text[] 
      WHERE id = ${id}
    `;

    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};