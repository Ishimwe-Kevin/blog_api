import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, role: user.role } },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};
