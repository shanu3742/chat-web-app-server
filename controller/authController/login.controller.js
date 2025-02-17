const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { asyncHandler } = require("../../middleware/asyncHandler.middleware");
const { USER } = require("../../model/user.model");
const MingleError = require("../../utils/CustomError");
const { authErrorSchema } = require("../../error/auth.error.schema");
const RedisClient = require("../../radish");
const { sendMail } = require("../../event/email.event");
const { sendCookies } = require("../../event/cookies.event");
exports.userRegister = asyncHandler(async (req, res) => {
  let email = req.body.email;
  let userId = req.body.userId;
  let password = req.body.password;
  let clientOtp = req.body.otp;
  if (!email || !userId || !password || !clientOtp) {
    throw new MingleError("Please Provide All Require Field", 400);
  }

  let redisKey = `OTP:${email}`;
  let storedHashedOtp = await RedisClient.get(redisKey);

  if (!storedHashedOtp) {
    return res.status(400).send({
      message: "OTP expired or does not exist",
      verified: false,
    });
  }

  let isValidOtp = await bcrypt.compare(clientOtp, storedHashedOtp);
  if (!isValidOtp) {
    throw new MingleError("Invalid OTP", 400);
  }
  let userData = await USER.create({
    email,
    userId,
    password,
  });

  if (userData) {
    //delete the otp from storage
    await RedisClient.del(redisKey);
    //send mail
    sendMail(email).registerAccount(userData.userId);
    return res.status(201).json({
      message: "User Account Created",
    });
  } else {
    throw new MingleError("Something Went Wrong", 400);
  }
});

exports.userLogIn = asyncHandler(async (req, res) => {
  let userId = req.body?.userId ?? "";
  let email = req.body?.email ?? "";
  let password = req.body.password;

  let { error } = authErrorSchema.validate({
    email: email,
    password: password,
  });

  if (error) {
    throw new MingleError(error.details.map((e) => e.message).join(","), 400);
  }
  //  $options:'i' is used  to avoid case sensitive
  let findQuery = {
    $or: [
      { userId: { $regex: userId, $options: "i" } },
      { email: { $regex: email, $options: "i" } },
    ],
  };

  let userData = await USER.findOne(findQuery);
  if (userData && (await userData.matchPassword(password))) {
    //set cookies
    sendCookies(res).authCookies(userData);
    return res.status(200).json({
      name: userData.name ?? "Guest User",
      userId: userData.userId,
      email: userData.email,
    });
  } else {
    throw new MingleError("Invalid Credetial", 401);
  }
});

exports.googleLogin = asyncHandler(async (req, res) => {
  const { uid: googleId, email, name, picture: image } = req.googleData;

  let findQuery = {
    $or: [
      { googleId: { $regex: googleId, $options: "i" } },
      { email: { $regex: email, $options: "i" } },
    ],
  };
  let userData = await USER.findOne(findQuery);
  //set cookies
  sendCookies(res).authCookies(userData);
  if (userData) {
    return res.status(200).json({
      name: userData.name ?? "Guest User",
      userId: userData.userId ?? userData.googleId,
      email: userData.email,
    });
  }

  let createdUserData = await USER.create({
    googleId,
    name,
    email,
    emailVerified: true,
    image,
    isGoogleLogin: true,
    password: crypto
      .randomBytes(14)
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 14),
  });
  res.status(200).json({
    name: createdUserData.name ?? "Guest User",
    userId: createdUserData.userId ?? createdUserData.googleId,
    email: createdUserData.email,
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let otp = req.body.otp;
  let { error } = authErrorSchema.validate({
    email: email,
    password: password,
  });

  if (error) {
    throw new MingleError(error.details.map((e) => e.message).join(","), 400);
  }

  let redisKey = `OTP:${email}`;
  let storedHashedOtp = await RedisClient.get(redisKey);
  if (!storedHashedOtp) {
    return res.status(400).send({
      message: "OTP expired or does not exist",
    });
  }

  let isValidOtp = await bcrypt.compare(otp, storedHashedOtp);
  if (isValidOtp) {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let userData = await USER.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );

    if (userData) {
      //after reseting the password delete the otp
      await RedisClient.del(redisKey);
      return res.status(200).json({
        message: "User Password  Updated",
      });
    } else {
      throw new MingleError("Something Went Wrong", 400);
    }
  } else {
    throw new MingleError("OTP expired or does not exist", 400);
  }
});
