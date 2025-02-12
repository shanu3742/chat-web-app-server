const crypto = require("crypto");

// Generate a 6-digit numeric OTP
exports.generateOTP = () => {
    return crypto.randomInt(1000, 9999).toString();
};

