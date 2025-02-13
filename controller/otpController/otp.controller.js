const bcrypt = require('bcryptjs');
const { asyncHandler } = require("../../middleware/asyncHandler.middleware");
const RedisClient = require("../../radish");
const { generateOTP } = require("../../utils/cryptoOtp");
const { APP_CONFIG } = require('../../config/app.config');
const { sendMail } = require('../../event/email.event');
const MingleError = require('../../utils/CustomError');

exports.requestOtp = asyncHandler(async (req, res) => {
    let email = req.body.email;
    if (!email) {
        throw new MingleError("Please provide an email", 400);
    }

    let otp = generateOTP();
    console.log("Generated OTP:", otp);

    const salt = await bcrypt.genSalt(10);
    let hashedOtp = await bcrypt.hash(otp, salt);
    let redisKey = `OTP:${email}`; 
    await RedisClient.set(redisKey, hashedOtp, "EX", APP_CONFIG.OTP_EXPIRATION);
    // TODO: Send OTP via email (Implement email service)
    sendMail(email,otp)
    res.status(200).send({
        message: "OTP sent successfully",
    });
});

exports.verifyOtp = asyncHandler(async (req, res) => {
    let email = req.body.email;
    let clientOtp = req.body.otp;

    if (!email || !clientOtp) {
        throw new MingleError("Please provide email and OTP", 400);
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
    if (isValidOtp) {
        await RedisClient.del(redisKey);
        return res.status(200).send({
            message: "OTP verified successfully",
            verified: true,
        });
    } else {
        return res.status(400).send({
            message: "Invalid OTP",
            verified: false,
        });
    }
});
