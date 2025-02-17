const jwt = require("jsonwebtoken");
const { APP_CONFIG } = require("../config/app.config");

exports.createAccessToken = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: APP_CONFIG.ACCESS_TOKEN_EXPIRY + "m",
    }
  );
  return accessToken;
};

exports.createRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: APP_CONFIG.REFRESH_TOKEN_EXPIRY + "d",
    }
  );
  return refreshToken;
};
