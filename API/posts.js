const express = require('express');
const router = express.Router();
const passport = require('passport');

const Post = require('../models/Post');
const validatePostInputs = require('../validation/post');

// @route   GET api/posts
// @desc    get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ created: 'desc' });
    if (!posts) return res.status(404).json({ posts: 'No posts have been created yet' });
    return res.json(posts);
  } catch (error) {
    res.status(404).json({ ...error, posts: 'No posts have been created yet' });
  }
});

// @route   GET api/posts/:id
// @desc    get post by id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ post: 'No post found' });
    return res.json(post);
  } catch (error) {
    res.status(404).json({ ...error, post: 'No post found' });
  }
});

// @route   POST api/posts
// @desc    create new post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { errors, isValid } = validatePostInputs(req.body);
  if (!isValid) return res.status(400).json(errors);
  try {
    const newPost = new Post({
      text: req.body.text,
      user: req.user.id,
      author: req.user.name,
      avatar: req.user.avatar
    });
    const savedPost = await newPost.save();
    return res.json(savedPost);
  } catch (error) {
    res.status(400).json(error);
  }
});

// @route   POST api/posts/like/:id
// @desc    like/unlike a post
// @access  Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ post: 'No post found' });

    const alreadyLiked = post.likes.includes(req.user.id);
    if (alreadyLiked) post.likes = post.likes.filter(like => like !== req.user.id.toString());
    else post.likes.push(req.user.id);

    const savedPost = await post.save();
    return res.json({ savedPost });
  } catch (error) {
    res.status(400).json(error);
  }
});

// @route   DELETE api/posts/:id
// @desc    delte post with given id
// @access  Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ post: 'No post found' });
    if (post.user.toString() !== req.user.id) return res.status(401).json({ Msg: 'Unauthorized' });
    await post.remove();
    return res.json({ Msg: 'Success' });
  } catch (error) {
    res.status(404).json({ ...error, post: 'No post found', Msg: 'Unauthorized' });
  }
});

module.exports = router;
