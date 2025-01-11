const { APP_CONFIG } = require("../config/app.config");

exports.headerModifier =  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", APP_CONFIG.CLIENT_URL); // Allow only specified origin
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Allow only necessary headers
    res.header("Access-Control-Expose-Headers", "RateLimit-Limit, RateLimit-Remaining"); // Expose only non-sensitive headers
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow only necessary methods
    next();
  };