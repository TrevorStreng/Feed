const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please choose a username"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  //! temporary
  loggedIn: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.methods.verifyPassword = function (givenPassword, actualPassword) {
  return givenPassword === actualPassword;
  // ! Need to use bcrypt to check hashes later
};

const User = mongoose.model("User", userSchema);
// mongoose pluralizes and lowercases model name to determine which collection to get data from
module.exports = User;
