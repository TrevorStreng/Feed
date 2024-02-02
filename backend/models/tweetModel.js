const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const tweetSchema = new Schema({
  message: {
    type: String,
    required: [true, "What's on your mind?"],
  },
  username: {
    type: String,
    required: [true, 'Must be a user to tweet'],
  },
  // tags: {
  //   type: [String],
  // },
  likes: {
    count: { type: Number, default: 0 },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  dislikes: {
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  // comments: {
  //   type: [String],
  // },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;
