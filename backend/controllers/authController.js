const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const dotenv = require("dotenv");

dotenv.config({ path: "./../.env" });

const createAndSendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // ! set cookie options to secure for production

  res.cookie("jwt", token, cookieOptions);

  // remove password from data
  user.password = undefined;

  res.status(statusCode).json({
    status: "User logged in!",
    token,
    data: { user },
  });
};

exports.login = async (req, res, next) => {
  // * check if user is already logged in
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!(await user.verifyPassword(password, user.password)))
    return next(new AppError("Incorrect Password!", 401));
  await User.updateOne({ _id: user._id }, { loggedIn: true });

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
  const { username, email } = req.body;
  if (!(await checkEmail(email))) {
    return next(new AppError("Email already in use..", 401));
  }
  if (!(await checkUsername(username))) {
    return next(new AppError("Username already in use..", 401));
  }
  const newUser = await User.create(
    // req.body //this is unsecure and can allow anyone to be admin
    {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }
  );
  createAndSendToken(newUser, 201, res);

  res.status(201).json({
    status: "User created successfully!",
    data: {
      data: newUser,
    },
  });
};

exports.protect = async (req, res, next) => {
  let token;
  console.log(req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new AppError("You need to be logged in.💥", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  console.log(decoded);

  // verify account has been deleted
  const user = User.findById(decoded.id);
  if (!user)
    return next(new AppError("This token belongs to a deleted user.", 401));

  // ! check if user has changed password after token was issued

  req.user = user;
  next();
};
