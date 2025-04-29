import express from 'express';
const router = express.Router();
import categoryController from '../controllers/categoryController.js';
import auth from '../middleware/auth.js';
import roleCheck from '../middleware/roleCheck.js';

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', auth, roleCheck(['admin']), categoryController.createCategory);
router.put('/:id', auth, roleCheck(['admin']), categoryController.updateCategory);
router.delete('/:id', auth, roleCheck(['admin']), categoryController.deleteCategory);

export default router;