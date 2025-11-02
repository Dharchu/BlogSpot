const User = require("../models/User");
const Post = require("../models/Post");

// ✅ Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all posts with author info and comment count
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email") // Ensure it shows author name
      .populate("comments"); // optional if comments are stored as ObjectIds
    res.json(posts);
  } catch (err) {
    console.error("Admin getPosts error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single post
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update post
exports.updatePost = async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete post
exports.deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
