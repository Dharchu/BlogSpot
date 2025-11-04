const admin = (req, res, next) => {
  // We will check the role OR a specific admin email as a fallback.
  // This makes the check more robust if the role field isn't set correctly.
  const isAdmin = req.user && (req.user.role === 'admin' || req.user.email === 'admin@example.com');
  if (isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Not an admin.' });
  }
};

module.exports = admin;