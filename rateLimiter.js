const rateLimit = require('express-rate-limit');
const  WINDOW_MS = 30*60*1000;
const  MAX_REQUESTS_PER_WINDOW =100; //assume 100ms alloted for 1 request
const MAX_REQUEST_COUNT =WINDOW_MS/MAX_REQUESTS_PER_WINDOW;

let limiter = rateLimit({
    max:MAX_REQUEST_COUNT,
    windowMs:WINDOW_MS,
    message:'Too many request. Please try  again later.'
  })
  //for signin only 5 times a user can try to do login with in 10 minutes
  let signinLimiter = rateLimit({
    max:5,
    windowMs:10*60*1000,
    message:'Too many login attempts.Please try again after 10 minutes.'
  })


module.exports= {limiter,signinLimiter}