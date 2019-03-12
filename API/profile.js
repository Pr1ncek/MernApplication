const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const validateProfileInputs = require('../validation/profile');
const validateExperienceInputs = require('../validation/experience');
const validateEducationInputs = require('../validation/education');

const Profile = require('../models/Profile');

const router = express.Router();

// @route   GET api/profile/all
// @desc    get all profiles
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    if (!profiles) return res.status(404).json({ profiles: 'No profiles have been created yet' });
    return res.json(profiles);
  } catch (error) {
    res.status(404).json({ profiles: 'No profiles have been created yet', ...error });
  }
});

// @route   GET api/profile/handle/:handle
// @desc    get profile by handle
// @access  Public
router.get('/handle/:handle', async (req, res) => {
  try {
    const profile = await Profile.findOne({ handle: req.params.handle.toLowerCase() }).populate(
      'user',
      ['name', 'avatar']
    );
    if (!profile) return res.status(404).json({ profile: 'Profile not found' });
    return res.json(profile);
  } catch (error) {
    res.status(404).json({ profile: 'Profile not found', ...error });
  }
});

// @route   GET api/profile/user/:userId
// @desc    get profile by user id
// @access  Public
router.get('/user/:id', async (req, res) => {
  try {
    // prettier-ignore
    const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['name', 'avatar']);
    if (!profile) return res.status(404).json({ profile: 'There is no profile for this user' });
    return res.json(profile);
  } catch (error) {
    res.status(404).json({ profile: 'There is no profile for this user', ...error });
  }
});

// @route   GET api/profile
// @desc    get current user's profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const currentUser = req.user;
  try {
    // prettier-ignore
    const profile = await Profile.findOne({ user: currentUser.id }).populate('user', ['name', 'avatar']);
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
  const { errors, isValid } = validateProfileInputs(req.body);
  console.log(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { youtube, twitter, instagram, facebook } = req.body;
  const profileFields = {
    ...req.body,
    handle: req.body.handle.toLowerCase(),
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

// @route   POST api/profile/experience
// @desc    add experience to profile
// @access  Private
router.post('/experience', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateExperienceInputs(req.body);
  if (!isValid) return res.status(400).json(errors);
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ profile: 'Profile not found' });
    const newExperience = { ...req.body };
    profile.experience.unshift(newExperience);
    const savedProfile = await profile.save();
    return res.json(savedProfile);
  } catch (error) {
    res.status(400).json({ profile: 'Profile not found', ...error });
  }
});

// @route   POST api/profile/education
// @desc    add education to profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validateEducationInputs(req.body);
  if (!isValid) return res.status(400).json(errors);
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ profile: 'Profile not found' });
    const newEducation = { ...req.body };
    profile.education.unshift(newEducation);
    const savedProfile = await profile.save();
    return res.json(savedProfile);
  } catch (error) {
    res.status(400).json({ profile: 'Profile not found', ...error });
  }
});

// @route   DELETE api/profile/experience/:id
// @desc    delete experience from profile
// @access  Private
router.delete(
  '/experience/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) return res.status(404).json({ profile: 'Profile not found' });
      const filteredExperience = profile.experience.filter(exp => exp.id !== req.params.id);
      profile.experience = filteredExperience;
      const savedProfile = await profile.save();
      res.json(savedProfile);
    } catch (error) {
      res.status(404).json({ profile: 'Profile not found', ...error });
    }
  }
);

// @route   DELETE api/profile/education/:id
// @desc    delete education from profile
// @access  Private
router.delete(
  '/education/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) return res.status(404).json({ profile: 'Profile not found' });
      const filteredEducation = profile.education.filter(edu => edu.id !== req.params.id);
      profile.education = filteredEducation;
      const savedProfile = await profile.save();
      res.json(savedProfile);
    } catch (error) {
      res.status(404).json({ profile: 'Profile not found', ...error });
    }
  }
);

// @route   DELETE api/profile
// @desc    delete profile
// @access  Private
router.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ profile: 'Profile not found' });
    await Profile.findOneAndRemove({ user: req.user.id });
    return res.json({ Msg: 'Success' });
  } catch (error) {
    res.status(404).json({ profile: 'Profile not found', ...error });
  }
});

module.exports = router;
