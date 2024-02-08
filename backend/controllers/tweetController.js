const Tweet = require("./../models/tweetModel");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const WebSocketService = require("../services/webSocketServices");
const { ObjectId } = require("mongodb");

exports.getAllTweets = async (req, res, next) => {
  const tweets = await Tweet.find({});

  res.status(200).json({
    status: "success",
    results: tweets.length,
    tweets: tweets,
  });
};

/*Protected*/
exports.createTweet = async (req, res, next) => {
  const { message, userId } = req.body;

  if (!message) return next(new AppError("Please write a tweet.", 400));
  if (!userId) return next(new AppError("Please sign in.", 409));

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
    status: "You wrote a tweet!",
    data: {
      data: newTweet,
    },
  });
};

/*Protected*/
exports.deleteTweet = async (req, res, next) => {
  const { id } = req.body;

  if (!id) return next(new AppError("Please select a tweet to delete.", 401));
  // if (!userId)
  //   return next(new AppError("Please sign in to delete your tweet.", 401));

  const deleteTweet = await Tweet.findByIdAndDelete(id);

  res.status(200).json({
    status: "Tweet deleted.",
    data: {
      data: req.body,
    },
  });
};

exports.likeTweet = async (req, res, next) => {
  const { userId } = req.body;
  const tweetId = req.params.tweetId;

  if (!userId) return next(new AppError("Must be signed in", 409));
  if (!tweetId) return next(new AppError("No post id", 404));

  const tweet = await Tweet.findById(tweetId);
  const tweetUser = await User.findOne({ username: tweet.username });
  if (!tweetUser)
    return next(new AppError(`Can't find user who posted this..`, 401));
  if (!tweet) return next(new AppError("Post not found", 404));

  // WebSocketService.emitNewPost(tweet);

  // check if user has already liked and increment like and add userid to array
  if (
    !tweet.likes.users.includes(userId) &&
    !tweet.dislikes.users.includes(userId)
  ) {
    tweet.likes.users.push(userId);
    tweet.likes.count++;
    await tweet.save();

    // add notification to user
    const user = await User.findById(userId);
    if (!user) return next(new AppError(`Can't find user..`, 401));

    console.log(tweetUser.notifications);
    // tweetUser.notifications.push('like');
    tweetUser.notifications.push({
      type: "like",
      message: `${user.username} has liked your post!`,
    });
    await tweetUser.save();
  } else if (
    !tweet.likes.users.includes(userId) &&
    tweet.dislikes.users.includes(userId)
  ) {
    // remove dislike
    for (let i = 0; i < tweet.dislikes.users.length; i++) {
      if (tweet.dislikes.users[i].equals(userId))
        tweet.dislikes.users.splice(i, 1);
    }
    tweet.likes.users.push(userId);
    tweet.likes.count += 2;
    await tweet.save();
  } else if (
    tweet.likes.users.includes(userId) &&
    !tweet.dislikes.users.includes(userId)
  ) {
    // unlike if they have already liked
    for (let i = 0; i < tweet.likes.users.length; i++) {
      if (tweet.likes.users[i].equals(userId)) tweet.likes.users.splice(i, 1);
    }
    tweet.likes.count--;
    await tweet.save();
  }

  res.status(200).json({
    status: "success",
    likes: tweet.likes,
  });
};
exports.dislikeTweet = async (req, res, next) => {
  let { userId } = req.body;
  const tweetId = req.params.tweetId;
  console.log(tweetId);

  if (!userId) return next(new AppError("Must be signed in", 409));
  if (!tweetId) return next(new AppError("No post id", 404));

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) return next(new AppError("Post not found", 404));

  // WebSocketService.emitNewPost(tweet);

  // ^ click like button again to unlike, same with dislike button
  //  ^ like to dislike = -2
  // dislike tweet
  if (
    !tweet.dislikes.users.includes(userId) &&
    !tweet.likes.users.includes(userId)
  ) {
    tweet.dislikes.users.push(userId);
    tweet.likes.count--;
    await tweet.save();
  } else if (
    tweet.likes.users.includes(userId) &&
    !tweet.dislikes.users.includes(userId)
  ) {
    // remove dislike
    for (let i = 0; i < tweet.likes.users.length; i++) {
      if (tweet.likes.users[i].equals(userId)) tweet.likes.users.splice(i, 1);
    }
    tweet.dislikes.users.push(userId);
    tweet.likes.count -= 2;
    await tweet.save();
  } else if (
    !tweet.likes.users.includes(userId) &&
    tweet.dislikes.users.includes(userId)
  ) {
    // if have disliked remove dislike
    for (let i = 0; i < tweet.dislikes.users.length; i++) {
      if (tweet.dislikes.users[i].equals(userId))
        tweet.dislikes.users.splice(i, 1);
    }
    tweet.likes.count++;
    await tweet.save();
  }

  res.status(200).json({
    status: "success",
    likes: tweet.likes,
  });
};
