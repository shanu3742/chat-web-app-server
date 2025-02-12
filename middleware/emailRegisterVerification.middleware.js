const { USER } = require("../model/user.model");
const MingleError = require("../utils/CustomError");
const { asyncHandler } = require("./asyncHandler.middleware");

exports.emailVerification = asyncHandler(async(req,res,next) => {
    let email = req.body.email;
    let userData =  await USER.findOne({email:email});
    if(userData){
        next()
    }else{
        throw new MingleError("Email Is Not Register",400)
    }
   
})