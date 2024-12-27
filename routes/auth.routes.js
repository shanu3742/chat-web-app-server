const express = require('express');
const { userLogIn, userRegister } = require('../controller/authController/login.controller');
const router = express.Router();

router.route('/login').post(userLogIn);
router.route('/signup').post(userRegister);
module.exports=router;