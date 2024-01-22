const Tweet = require('./../models/tweetModel');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const WebSocketService = require('../services/webSocketServices');

exports.getAllTweets = async (req, res, next) => {
  const tweets = await Tweet.find({});

  res.status(200).json({
    status: 'success',
    results: tweets.length,
    tweets: tweets,
  });
};

/*Protected*/
exports.createTweet = async (req, res, next) => {
  const { message, userId } = req.body;

  if (!message) return next(new AppError('Please write a tweet.', 400));
  if (!userId) return next(new AppError('Please sign in.', 409));

  const { username } = await User.findById(userId).exec();

  const newTweet = await Tweet.create({
    // userId: userId,
    username: username,
    message: message,
    // tags: req.body.tags.split(' '),
  });
  // Emit listeners of new message
  WebSocketService.emitNewPost(newTweet);

  res.status(201).json({
    status: 'You wrote a tweet!',
    data: {
      data: newTweet,
    },
  });
};

/*Protected*/
exports.deleteTweet = async (req, res, next) => {
  const { id } = req.body;

  if (!id) return next(new AppError('Please select a tweet to delete.', 401));
  // if (!userId)
  //   return next(new AppError("Please sign in to delete your tweet.", 401));

  const deleteTweet = await Tweet.findByIdAndDelete(id);

  res.status(200).json({
    status: 'Tweet deleted.',
    data: {
      data: req.body,
    },
  });
};

exports.likeTweet = async (req, res, next) => {
  const { userId } = req.body;
  const tweetId = req.params.tweetId;
  console.log(tweetId);

  if (!userId) return next(new AppError('Must be signed in', 409));
  if (!tweetId) return next(new AppError('No post id', 404));

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) return next(new AppError('Post not found', 404));

  WebSocketService.emitNewPost(tweet);

  if (!tweet.likes.users.includes(userId)) {
    tweet.likes.users.push(userId);
    tweet.likes.count++;
    await tweet.save();
  } else {
    return next(new AppError('You have already liked this post..', 401));
  }

  res.status(200).json({
    status: 'success',
    likes: tweet.likes,
  });
};
