import Blog from '../models/blog.js';
import User from '../models/user.js';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username')
      .populate('category', 'name');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(id)
      .populate('author', 'username')
      .populate('category', 'name');

    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


const createBlog = [
  body('title').notEmpty(),
  body('content').notEmpty(),
  body('category').isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const blog = new Blog({
        ...req.body,
        author: req.user.id
      });
      await blog.save();
      res.status(201).json(blog);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
];

const updateBlog = [
  body('title').optional().notEmpty(),
  body('content').optional().notEmpty(),
  body('category').optional().isMongoId(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ msg: 'Blog not found' });
      }
      Object.assign(blog, req.body);
      blog.updatedAt = Date.now();
      await blog.save();
      res.json(blog);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
];

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }
    res.json({ msg: 'Blog deleted' });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ msg: 'Server error' });
  }
};


const getBlogsByCategory = async (req, res) => {
  try {
    const blogs = await Blog.find({ category: req.params.id })
      .populate('author', 'username')
      .populate('category', 'name');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export default {
  getAllBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory
};
