const admin = require('firebase-admin');
const { fbServiceKey } = require("../serviceAccountKey");

admin.initializeApp({
  credential: admin.credential.cert(fbServiceKey)
});

exports.googleVerification = async  (req,res,next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).send({
            message:"Unauthorized"
            })
        }
        const googleToken= authHeader.split(' ')[1];

        const decodeToken = await  admin.auth().verifyIdToken(googleToken);
        if(!decodeToken){
          return res.status(401).send({
            message:"Unauthorized"
          })
        }

        req.googleData = decodeToken;
        next()

    }catch(e){
        res.status(500).send({
            message:e.message??'Network Error'
        })
    }

}