const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ Message: 'Post success!' });
});

module.exports = router;
