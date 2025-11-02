const express = require("express");
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/adminController");

router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

router.get("/posts", getPosts);
router.get("/posts/:id", getPostById);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

module.exports = router;
