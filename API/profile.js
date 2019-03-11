const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');
const Profile = require('../models/Profile');

const router = express.Router();

// @route   GET api/profile
// @desc    get current user's profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const currentUser = req.user;
  try {
    const profile = await Profile.findOne({ user: currentUser.id });
    if (!profile) return res.status(404).json({ profile: 'Profile not found' });
    return res.json(profile);
  } catch (error) {
    res.status(404).json(error);
  }
});

// @route   POST api/profile
// @desc    create/update new profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { youtube, twitter, instagram, facebook } = req.body;
  const profileFields = {
    ...req.body,
    user: req.user.id,
    skills: req.body.skills.split(','),
    social: { youtube, twitter, instagram, facebook }
  };
  try {
    const existingProfile = await Profile.findOne({ user: req.user.id });
    if (existingProfile) {
      profileFields.handle = existingProfile.handle; // handle should not be updated!
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(updatedProfile);
    }
    const handleAlreadyTaken = await Profile.findOne({ handle: profileFields.handle });
    if (handleAlreadyTaken) return res.status(400).json({ handle: 'This handle is already taken' });
    const savedProfile = await new Profile(profileFields).save();
    return res.json(savedProfile);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
