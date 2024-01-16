const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
// router.post("/logout", userController.login);
router.get("/", userController.getAllUsers);

module.exports = router;
