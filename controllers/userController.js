import User from "../models/user.js";
import { body, validationResult } from "express-validator";
import mongoose from "mongoose";


// get all user
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "server error" });
  }
};


// get only user by id
const getUser = async (req, res) => {
  const { id } = req.params;
  console.log('Requested user ID:', id);  // Log the ID

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Invalid user ID format' });
  }

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      console.log('User not found:', id);  // Log if user is not found
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


  // Create a new user
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "email already exists" });
    }

    user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ msg: "user created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "server error" });
    
  }
};

const updateUser = [
  body('username').optional().notEmpty(),
  body('email').optional().isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Not authorized' });
      }
      const updates = req.body;
      Object.assign(user, updates);
      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  }
];

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    await user.remove();
    res.json({ msg: 'User deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

export default {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
