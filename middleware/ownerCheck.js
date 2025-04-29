import Blog from '../models/blog.js';

const ownerCheck = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export default ownerCheck;
