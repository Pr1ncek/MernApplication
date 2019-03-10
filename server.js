const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// APIs
const auth = require('./API/auth');
const profile = require('./API/profile');
const posts = require('./API/posts');

// Database Configuration
const MONGO_URI = require('./config/keys').MONGO_URI;
mongoose.connect(MONGO_URI, { useNewUrlParser: true }, err => {
  if (err) console.error(err);
  else console.log('MongoDB Connected!');
});

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// Passport Configuration
const configurePassport = require('./config/passport');
configurePassport(passport);

// Routes
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is live!');
});
