const User = require("./../models/userModel");
const AppError = require("./../utils/appError");

exports.getAllUsers = async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      data: users,
    },
  });
};

// exports.login = async (req, res, next) => {
//   // * check if user is already logged in
//   const { email, password } = req.body;
//   const user = await User.findOne({ email: email });
//   if (!(await user.verifyPassword(password, user.password)))
//     return next(new AppError(401, "Incorrect Password!"));
//   await User.updateOne({ _id: user._id }, { loggedIn: true });
//   console.log(`login successful!!😀`);
//   res.status(200).json({
//     status: "User logged in!",
//     data: user,
//   });
// };
// exports.logout = async (req, res, next) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email: email });
//   if (!(await user.verifyPassword(password, user.password)))
//     return next(new AppError(401, "Incorrect Password!"));
//   await User.updateOne({ _id: user._id }, { loggedIn: false });
//   console.log(`logged out.`);
//   res.status(200).json({
//     status: "User logged in!",
//     data: user,
//   });
// };

exports.signUp = async (req, res, next) => {
  const { username, email } = req.body;
  if (!(await checkEmail(email))) {
    return next(new AppError("Email already in use..", 409));
  }
  if (!(await checkUsername(username))) {
    return next(new AppError("Username already in use..", 409));
  }
  const newUser = await User.create(
    // req.body //this is unsecure and can allow anyone to be admin
    {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    }
  );

  res.status(201).json({
    status: "User created successfully!",
    data: {
      data: newUser,
    },
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
