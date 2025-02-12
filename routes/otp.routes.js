const express = require('express');
const { emailVerification } = require("../middleware/emailRegisterVerification.middleware");
const { requestOtp, verifyOtp } = require('../controller/otpController/otp.controller');


const router = express.Router();
router.route('/request-otp').post(emailVerification,requestOtp);
router.route('/verify-otp').post(emailVerification,verifyOtp);
module.exports=router;