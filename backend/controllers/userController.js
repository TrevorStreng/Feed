const User = require("./../models/userModel");
const AppError = require("./../utils/appError");

// exports.createUser = async () => {
//   const doc = await User.create(req.body);
// };

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      data: users,
    },
  });
};
