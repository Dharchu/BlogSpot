const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const {
  getAllPosts,
  getPostById,
  likePost,
  commentOnPost,
} = require("../controllers/postController");
const { authMiddleware } = require("../middleware/auth");

router.get("/", getAllPosts);
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/comment", authMiddleware, commentOnPost);

module.exports = router;
