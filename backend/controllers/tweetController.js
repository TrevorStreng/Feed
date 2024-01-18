const Tweet = require('./../models/tweetModel');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');

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
