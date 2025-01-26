const admin = require('firebase-admin');
const { fbServiceKey } = require("../serviceAccountKey");
const { asyncHandler } = require('./asyncHandler.middleware');
const MingleError = require('../utils/CustomError');

admin.initializeApp({
  credential: admin.credential.cert(fbServiceKey)
});

exports.googleVerification = asyncHandler( async  (req,res,next) => {
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
          throw new MingleError("Unauthorized",401)
        }
        const googleToken= authHeader.split(' ')[1];

        const decodeToken = await  admin.auth().verifyIdToken(googleToken);
        if(!decodeToken){
          throw new MingleError("Unauthorized",401)
        }

        req.googleData = decodeToken;
        next()
})