// backend/routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// get my profile
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// update profile (avatar via base64)
router.put('/me', auth, async (req, res) => {
  try {
    const { name, bio, imageBase64 } = req.body;
    const user = await User.findById(req.user._id);

    if (imageBase64) {
      const upload = await cloudinary.uploader.upload(imageBase64, {
        folder: 'blogspot_avatars',
      });
      user.avatar = upload.secure_url;
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
