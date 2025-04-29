import express from 'express'
const router = express.Router();
import blogController from '../controllers/blogController.js';
import auth from '../middleware/auth.js';
import ownerCheck from '../middleware/ownerCheck.js';

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlog);
router.post('/', auth, blogController.createBlog);
router.put('/:id', auth, ownerCheck, blogController.updateBlog);
router.delete('/:id', auth, ownerCheck, blogController.deleteBlog);
router.get('/category/:id', blogController.getBlogsByCategory);

export default router;