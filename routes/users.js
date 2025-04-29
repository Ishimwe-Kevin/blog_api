// routes/users.js
import express from 'express';
import userController from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/', auth, roleCheck(['admin']), userController.getAllUsers);
router.get('/:id', auth, userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, roleCheck(['admin']), userController.deleteUser);

export default router;
