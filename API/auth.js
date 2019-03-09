const express = require('express');
const router = express.Router();

// @route   GET api/auth/login
// @desc    User Login
// @access  Public
router.get('/login', (req, res) => {
  res.json({ Message: 'Login success!' });
});

module.exports = router;
