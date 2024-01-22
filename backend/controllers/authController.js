const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const validator = require('validator');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const email = require('./../utils/email');

dotenv.config({ path: './../.env' });

// & to do list
// // 1. check for valid email
// // 2. check password length
// 3. add likes and comments to posts
// 4. go live
// 5. notifications

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // const token = jwt.sign({ user._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });

  cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    // domain: 'localhost',
    // sameSite: 'Lax',
    // secure: true,
  };

  // ! set cookie options to secure for production

  res.cookie('jwt', token, cookieOptions);

  // remove password from data
  user.password = undefined;
  // console.log(token);
  console.log('logged in');

  res.status(statusCode).json({
    status: 'User logged in!',
    token,
    data: user,
  });
};

exports.login = async (req, res, next) => {
  // * check if user is already logged in
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    return next(new AppError('User not found.', 404));
  }
  // console.log(user);
  if (!(await user.verifyPassword(password, user.password)))
    return next(new AppError('Incorrect Password!', 401));

  createAndSendToken(user, 200, res);
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

exports.signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!(await checkEmail(email))) {
    return next(new AppError('Email already in use..', 401));
  }
  if (!(await checkUsername(username))) {
    return next(new AppError('Username already in use..', 401));
  }
  if (!validator.isEmail(email)) {
    return next(new AppError('Please use a valid email..', 401));
  }
  if (password.length < 8) {
    return next(
      new AppError('Password length must be at least 8 characters..', 401)
    );
  }

  const newUser = await User.create(
    // req.body //this is unsecure and can allow anyone to be admin
    {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    }
  );
  console.log('New account created');
  createAndSendToken(newUser, 201, res);
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new AppError('You need to be logged in.💥', 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // verify account has been deleted
  const user = User.findById(decoded.id);
  if (!user)
    return next(new AppError('This token belongs to a deleted user.', 401));

  // ! check if user has changed password after token was issued

  req.user = user;
  next();
};

exports.getMe = async (req, res, next) => {
  if (!req.cookies.jwt) return next(new AppError('Need to login', 401));

  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  // & Could get username and stuff here if needed
  res.status(200).json({
    status: 'success',
    userId: decoded.id,
  });
};

exports.checkLogin = async (req, res, next) => {
  // if (!req.cookies.jwt) return next(new AppError('Need to login', 401));
  let decoded;
  if (req.cookies.jwt)
    decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

  console.log(decoded);

  if (!decoded) {
    res.status(404).json({
      status: 'not logged in',
      loggedIn: false,
    });
    return next();
  }

  res.status(200).json({
    status: 'success',
    loggedIn: true,
  });
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user with that email address', 404));
  }

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // used when data may not fit the schema; temporary

  console.log(process.env.FRONTEND_URL);

  const resetURL = `${process.env.FRONTEND_URL}/resetPassword#${resetToken}`;
  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/users/resetPassword/${resetToken}`;

  console.log(resetToken);

  const message = `Use this link to reset your password ${resetURL}`; // unhashed version is sent in url

  try {
    await email({
      email: user.email,
      subject: 'Password Reset',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please try again.',
        500
      )
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, ans there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  user.passwordChangedAt = Date.now();
  await user.save();

  // 4) Log the user in, send token
  createAndSendToken(user, 200, res);
  console.log('password reset!');
};
