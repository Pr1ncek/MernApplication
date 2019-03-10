const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../config/keys');

const User = require('../models/User');

const router = express.Router();

// @route   GET api/auth/login
// @desc    user login / generate JWT
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ email: 'Email does not exist' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ password: 'Password does not match' });
    const payload = {
      userId: user.id,
      name: user.name,
      avatar: user.avatar
    };
    const token = await jwt.sign(payload, keys.JWT_SECRET, { expiresIn: '24h' });
    return res.json({ Msg: 'Success', token: `Bearer ${token}` });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// @route   GET api/auth/register
// @desc    user registration
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ email: 'Email already exists' });
    const newUser = new User({ name, email, password });
    const hash = await bcrypt.hash(password, (saltRounds = 10));
    newUser.password = hash;
    const savedUser = await newUser.save();
    return res.json({ Msg: 'Success', savedUser });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// @route   GET api/auth/current
// @desc    return currently authenticated user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.json({ Msg: 'Success', user: req.user });
});

module.exports = router;
