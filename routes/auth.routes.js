const express = require('express');
const { userLogIn, userRegister, googleLogin } = require('../controller/authController/login.controller');
const { signinLimiter } = require('../rateLimiter');
const router = express.Router();

router.route('/login').post(signinLimiter,userLogIn);
router.route('/googlelogin').post(signinLimiter,googleLogin);
router.route('/signup').post(userRegister);
module.exports=router;