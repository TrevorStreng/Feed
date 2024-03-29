const express = require('express');
const cors = require('cors');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
// router.post("/logout", userController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/isLoggedIn', authController.checkLogin);

// ^ Everything after the .protect requires you to be logged in
router.use(authController.protect);

router.get('/me', authController.getMe);
router.post('/logout', authController.logout);

router.get('/notifications', userController.getAllNotifications);

// router.get('/', userController.getAllUsers); // ! this should be admin only
module.exports = router;
