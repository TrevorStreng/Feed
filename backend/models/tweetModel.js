const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const tweetSchema = new Schema({
  message: {
    type: String,
    required: [true, "What's on your mind?"],
  },
  userId: {
    type: String,
    required: [true, "Must be a user to tweet"],
  },
});

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
