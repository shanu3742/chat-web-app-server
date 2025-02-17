const EventEmitter = require("events");
const { createAccessToken, createRefreshToken } = require("../utils/jwt");
const { APP_CONFIG } = require("../config/app.config");

let cookiesEvent = new EventEmitter();

cookiesEvent.on("auth-cookies", async (res, userData) => {
  //generate refresh token
  //generate access token
  let accessToken = createAccessToken(userData);
  let refreshToken = createRefreshToken(userData);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: APP_CONFIG.ACCESS_TOKEN_EXPIRY * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: APP_CONFIG.REFRESH_TOKEN_EXPIRY * 24 * 60 * 60 * 1000,
  });
});

exports.sendCookies = (res) => {
  return {
    authCookies: (userData) => cookiesEvent.emit("auth-cookies", res, userData),
  };
};
