const Tweet = require("./../models/tweetModel");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");

exports.getAllTweets = async (req, res, next) => {
  const tweets = await Tweet.find({});

  res.status(200).json({
    status: "success",
    results: tweets.length,
    data: {
      data: tweets,
    },
  });
};

exports.createTweet = async (req, res, next) => {
  const { message, userId } = req.body;
  console.log(message);
  if (!message) return next(new AppError("Please write a tweet.", 400));
  if (!userId) return next(new AppError("Please sign in.", 409));

  // const { username } = await User.findById(userId).exec();

  const newTweet = await Tweet.create(
    req.body
    // {
    //   userId: userId,
    //   message: message,
    // }
  );
  res.status(201).json({
    status: "You wrote a tweet!",
    data: {
      data: newTweet,
    },
  });
};
