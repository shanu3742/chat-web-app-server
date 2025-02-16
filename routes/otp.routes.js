const express = require("express");
const {
  emailVerification,
} = require("../middleware/emailRegisterVerification.middleware");
const {
  requestOtp,
  verifyOtp,
} = require("../controller/otpController/otp.controller");

const router = express.Router();
router
  .route("/forget-password/request-otp")
  .post(emailVerification, requestOtp);
router.route("/forget-password/verify-otp").post(emailVerification, verifyOtp);
router.route("/signup/request-otp").post(requestOtp);
router.route("/signup/verify-otp").post(verifyOtp);
module.exports = router;
