const express = require('express');
const cors = require('cors');
const tweetController = require('./../controllers/tweetController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', tweetController.getAllTweets);

// ^ Everything after the .protect requires you to be logged in
router.use(authController.protect);

router.post('/createTweet', cors(), tweetController.createTweet);
router.delete('/deleteTweet', tweetController.deleteTweet);
router.patch('/:tweetId/like', tweetController.likeTweet);

module.exports = router;
