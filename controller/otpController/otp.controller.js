const { asyncHandler } = require("../../middleware/asyncHandler.middleware");
const RedisClient = require("../../radish");
const { generateOTP } = require("../../utils/cryptoOtp");

exports.requestOtp = asyncHandler(async (req,res) => {
    let email = req.body.email;
    if(!email){
        throw new MingleError("Please Provide email",400)
      }
    let otp = generateOTP();
    let redishKey = `${email}:${otp}`;
    console.log(redishKey)
    await RedisClient.set(redishKey,otp);
     //send otp on mail

     
    res.status(200).send({
        message:'OTP sent successfully'
    })
})

exports.verifyOtp = asyncHandler(async (req,res) => {
    let email = req.body.email;
    let clientOtp = req.body.otp;
    let redishKey = `${email}:${clientOtp}`;
    let otp =await RedisClient.get(redishKey);
    if(clientOtp===otp){
     return   res.status(200).send({
            message:'OTP verified successfully',
            verified:true
        })
    }else{
      return  res.status(200).send({
            message:'OTP is not verified ',
            verified:false
        })
    }
     
   
})