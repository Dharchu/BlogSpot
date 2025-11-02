const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, imageBase64, category, tags } = req.body;
    let image = '';

    if (imageBase64) {
      const upload = await cloudinary.uploader.upload(imageBase64, { folder: 'blogspot' });
      image = upload.secure_url;
    }

    const post = new Post({
      title,
      content,
      image,
      category,
      tags,
      author: req.user._id
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating post' });
  }
});

// Get all posts (with optional search & filter)
router.get('/', async (req, res) => {
  try {
    const { q, category, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { title: new RegExp(q, 'i') },
        { content: new RegExp(q, 'i') },
        { tags: new RegExp(q, 'i') }
      ];
    }

    if (category) filter.category = category;

    const posts = await Post.find(filter)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

// Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar').populate('comments.user', 'name avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching post' });
  }
});

// Update a post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only the author or admin can update
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this post' });
    }

    const { title, content, imageBase64, category, tags } = req.body;

    if (imageBase64) {
      const upload = await cloudinary.uploader.upload(imageBase64, { folder: 'blogspot' });
      post.image = upload.secure_url;
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (tags) post.tags = tags;

    post.updatedAt = new Date();

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating post' });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only the author or admin can delete
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting post' });
  }
});

// Like or unlike a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id.toString();
    const index = post.likes.findIndex(id => id.toString() === userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while liking/unliking post' });
  }
});

// Add a comment
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date()
    });

    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('comments.user', 'name avatar');
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
});

module.exports = router;
