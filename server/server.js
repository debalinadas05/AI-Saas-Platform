import express from 'express';
import cors from 'cors';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import 'dotenv/config';

const app = express();

await connectCloudinary();

app.use(cors({
  origin: [
    'https://ai-saas-platform-6pb4.vercel.app',
    'https://ai-saas-platform-coral.vercel.app',
    'http://localhost:5173'
  ]
}));
app.use(express.json());

app.get('/', (req, res) => res.send('Server is Live!'));

app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});