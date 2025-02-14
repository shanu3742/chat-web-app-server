const express = require("express");
const {
  userLogIn,
  userRegister,
  googleLogin,
  resetPassword,
} = require("../controller/authController/login.controller");
const { signinLimiter, resetPasswordLimiter } = require("../rateLimiter");
const {
  googleVerification,
} = require("../middleware/googleTokenVerification.middleware");
const router = express.Router();

router.route("/login").post(signinLimiter, userLogIn);
router
  .route("/googlelogin")
  .get(signinLimiter, googleVerification, googleLogin);
router.route("/signup").post(userRegister);
router.route("/reset-password").post(resetPasswordLimiter, resetPassword);
// resetPassword
module.exports = router;
