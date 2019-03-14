const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  author: {
    type: String
  },
  avatar: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: [String]
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        required: true
      },
      author: {
        type: String
      },
      avatar: {
        type: String
      },
      created: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const Post = mongoose.model('Post', postSchema);
Post.findOne({ author: 'pricne' });
module.exports = Post;
