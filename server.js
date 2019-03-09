const express = require('express');
const mongoose = require('mongoose');
const app = express();

// APIs
const auth = require('./API/auth');
const profile = require('./API/profile');
const posts = require('./API/posts');

// Database Configuration
const mongoURI = require('./config/keys').mongoURI;
mongoose.connect(mongoURI, { useNewUrlParser: true }, err => {
  if (err) console.error(err);
  else console.log('MongoDB Connected!');
});

app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server is live!');
});
