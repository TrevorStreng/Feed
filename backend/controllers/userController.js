const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './../.env' });

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      data: users,
    },
  });
};

exports.getAllNotifications = async (req, res, next) => {
  if (!req.cookies.jwt) return next(new AppError('Need to login', 401));

  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  if (!decoded) return next(new AppError('Please sign in..', 401));

  const user = await User.findById(decoded.id);
  if (!decoded) return next(new AppError('No user found..', 404));

  res.status(200).json({
    status: 'success',
    data: user.notifications,
  });
};

const checkEmail = async (email) => {
  const exisitingEmail = await User.findOne({ email });

  if (exisitingEmail === null) return true;
  return false;
};
const checkUsername = async (username) => {
  const exisitingUsername = await User.findOne({ username });

  if (exisitingUsername === null) return true;
  return false;
};
