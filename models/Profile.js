const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  handle: {
    type: String,
    required: true,
    max: 25
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  company: {
    type: String
  },
  location: {
    type: String
  },
  portfolio: {
    type: String
  },
  github: {
    type: String
  },
  linkedin: {
    type: String
  },
  bio: {
    type: String
  },
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String, required: true },
      description: { type: String },
      from: { type: Date, required: true },
      to: { type: Date },
      current: { type: Boolean, default: false }
    }
  ],
  education: [
    {
      school: { type: String, required: true },
      degree: { type: String, required: true },
      major: { type: String, required: true },
      location: { type: String, required: true },
      description: { type: String },
      from: { type: Date, required: true },
      to: { type: Date },
      current: { type: Boolean, default: false }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    instagram: {
      type: String
    },
    facebook: {
      type: String
    }
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
