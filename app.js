import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import blogRoutes from './routes/blogs.js';

dotenv.config();

const app = express();
connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blogs', blogRoutes);

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ msg: 'Something went wrong!' });
});

export default app;
