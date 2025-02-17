const APP_CONFIG = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL,
  LOGIN_WINDOW_DURATION: 10 * 60 * 1000,
  LOGIN_MAX_ATTEMPTS: 5,
  LOGIN_RATE_LIMIT_MESSAGE:
    "Too many login attempts. Please try again after 10 minutes.",
  OTP_EXPIRATION: 300, //5 minute (60*5)
  RESET_PASSWORD_MAX_ATTEMPTS: 5,
  RESET_PASSWORD_WINDOW_DURATION: 10 * 60 * 1000,
  RESET_RATE_LIMIT_MESSAGE:
    "Too many login attempts. Please try again after 10 minutes.",
  ACCESS_TOKEN_EXPIRY: 30, //30m (in minute)
  REFRESH_TOKEN_EXPIRY: 15, //15d (in day)
};
module.exports = { APP_CONFIG };
