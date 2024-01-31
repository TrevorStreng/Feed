const Tweet = require('./../models/tweetModel');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const WebSocketService = require('../services/webSocketServices');
const { ObjectId } = require('mongodb');

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
  // WebSocketService.emitNewPost(newTweet);

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

  if (!userId) return next(new AppError('Must be signed in', 409));
  if (!tweetId) return next(new AppError('No post id', 404));

  const tweet = await Tweet.findById(tweetId);
  const tweetUser = await User.findOne({ username: tweet.username });
  if (!tweetUser)
    return next(new AppError(`Can't find user who posted this..`, 401));
  if (!tweet) return next(new AppError('Post not found', 404));

  // WebSocketService.emitNewPost(tweet);

  // check if user has already liked and increment like and add userid to array
  if (!tweet.likes.users.includes(userId)) {
    tweet.likes.users.push(userId);
    tweet.likes.count++;
    await tweet.save();

    // add notification to user
    const user = await User.findById(userId);
    if (!user) return next(new AppError(`Can't find user..`, 401));

    console.log(tweetUser.notifications);
    // tweetUser.notifications.push('like');
    tweetUser.notifications.push({
      type: 'like',
      message: `${user.username} has liked your post!`,
    });
    await tweetUser.save();
  } else {
    return next(new AppError('You have already liked this post..', 401));
  }

  res.status(200).json({
    status: 'success',
    likes: tweet.likes,
  });
};
exports.unlikeTweet = async (req, res, next) => {
  let { userId } = req.body;
  const tweetId = req.params.tweetId;
  console.log(tweetId);

  if (!userId) return next(new AppError('Must be signed in', 409));
  if (!tweetId) return next(new AppError('No post id', 404));

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) return next(new AppError('Post not found', 404));

  // WebSocketService.emitNewPost(tweet);

  if (tweet.likes.users.includes(userId)) {
    for (let i = 0; i < tweet.likes.users.length; i++) {
      if (tweet.likes.users[i].equals(userId)) tweet.likes.users.splice(i, 1);
    }
    tweet.likes.count--;
    await tweet.save();
  } else {
    return next(new AppError('You have already unliked this post..', 401));
  }

  res.status(200).json({
    status: 'success',
    likes: tweet.likes,
  });
};
