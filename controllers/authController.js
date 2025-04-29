import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
// controllers/authController.js
import { generateToken } from '../utils/jwtHelper.js';


const authController = {
  register: [
    body('username').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username, email, password, role } = req.body;
      try {
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({
          username,
          email,
          password: await bcrypt.hash(password, 10),
          role: role || 'author',
        });
        await user.save();
        res.json({ success: true, message: "User registered successfully", data: user});
      } catch (err) {
        console.error("Internal server error",err.message);
        res.status(500).json({ msg: 'Server error' });
      }
    },
  ],

  login: [
    body('email').isEmail(),
    body('password').exists(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ msg: 'user already exit' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
          return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = generateToken(user);
        res.json({ token });
      } catch(err){
        res.status(500).json({ msg: 'Server error' });
      }
    },
  ],
};

export default authController;``