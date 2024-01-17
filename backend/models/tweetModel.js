const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const tweetSchema = new Schema({
  message: {
    type: String,
    required: [true, "What's on your mind?"],
  },
  username: {
    type: String,
    required: [true, "Must be a user to tweet"],
  },
  // userId: {
  //   type: String,
  //   required: [true, "Must be a user to tweet"],
  // },
  tags: {
    type: [String],
  },
});

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
