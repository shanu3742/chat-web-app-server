const rateLimit = require('express-rate-limit');
const { APP_CONFIG } = require('./config/app.config');
const  WINDOW_MS = 30*60*1000;
const  MAX_REQUESTS_PER_WINDOW =100; //assume 100ms alloted for 1 request
const MAX_REQUEST_COUNT =WINDOW_MS/MAX_REQUESTS_PER_WINDOW;

let limiter = rateLimit({
    max:MAX_REQUEST_COUNT,
    windowMs:WINDOW_MS,
    message:{
      message:'Too many request. Please try  again later.'
    },
    standardHeaders: true, // Send rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  })
  //for signin only 5 times a user can try to do login with in 10 minutes
  let signinLimiter = rateLimit({
    max:APP_CONFIG.LOGIN_MAX_ATTEMPTS,
    windowMs:APP_CONFIG.LOGIN_WINDOW_DURATION,
    message:{
      message:APP_CONFIG.LOGIN_RATE_LIMIT_MESSAGE
    },
    standardHeaders: true, // Send rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  })


module.exports= {limiter,signinLimiter}