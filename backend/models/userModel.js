const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");

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
  confirmPassword: {
    type: String,
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", function (next) {
  const { password, confirmPassword } = this;

  if (this.isModified("password") && password !== confirmPassword) {
    return next(new AppError("Passwords do not match.", 401));
  }
  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.pre("save", function (next) {
  if (this.isModified("password") || !this.isNew) {
    this.passwordChangedAt = Date.now();
  }
  next();
});

userSchema.methods.verifyPassword = async function (
  givenPassword,
  storedPassword
) {
  return await bcrypt.compare(givenPassword, storedPassword);
};

// mongoose pluralizes and lowercases model name to determine which collection to get data from
const User = mongoose.model("User", userSchema);

module.exports = User;
