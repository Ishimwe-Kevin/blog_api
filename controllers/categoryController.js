import Category from '../models/Category.js';
import { body, validationResult } from 'express-validator';

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

const createCategory = [
  body('name').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const category = new Category(req.body);
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      console.error(
        'Error creating category:',
        err.message
      )
      res.status(500).json({ msg: 'Server error' });
    }
  }
];

const updateCategory = [
  body('name').optional().notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ msg: 'Category not found' });
      }
      Object.assign(category, req.body);
      await category.save();
      res.json(category);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
];

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }
    await Category.deleteOne({ _id: id }); // <-- fix here
    res.json({ msg: 'Category deleted' });
  } catch (err) {
    console.error(err);  // optional: log real error
    res.status(500).json({ msg: 'Server error' });
  }
};


export default {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
