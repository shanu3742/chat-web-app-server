const crypto=require('crypto')
const { asyncHandler } = require("../../middleware/asyncHandler.middleware");
const { USER } = require("../../model/user.model");
const MingleError = require("../../utils/CustomError");
exports.userRegister = asyncHandler ( async (req,res) => {
      let email = req.body.email;
      let userId =req.body.userId;
      let password=req.body.password;
      if(!email || !userId || !password){
        throw new MingleError("Please Provide All Require Field",400)
      }     
      let userData = await USER.create({
        email,
        userId,
        password
      })
     
      if(userData){
        throw new MingleError("User Account Created",400)
      }else{
        throw new MingleError("Something Went Wrong",400)
      }
   
})

exports.userLogIn = asyncHandler(async (req,res) => {
     let userId = req.body?.userId??'';
     let email = req.body?.email??'';
     let password = req.body.password;

     if(!userId  && !email){
       throw new MingleError("Please Provide require field",400)
     }
    //  $options:'i' is used  to avoid case sensitive
    let findQuery = {
        $or: [
          { userId: { $regex: userId, $options: 'i' } },
          { email: { $regex: email, $options: 'i' } },
          
        ]
      };
  
     let userData =  await USER.findOne(findQuery);
     if(userData && await userData.matchPassword(password)){
      return res.status(200).json({
            name:userData.name??'Guest User',
            userId:userData.userId,
            email:userData.email
        })
     }else{
      throw new MingleError("Invalid Credetial",401)
     }

})

exports.googleLogin = asyncHandler(async (req,res) => { 
  const {uid:googleId,email,name,picture:image} = req.googleData;

  let findQuery = {
    $or: [
      { googleId: { $regex: googleId, $options: 'i' } },
      { email: { $regex: email, $options: 'i' } },
      
    ]
  };
  let userData =  await USER.findOne(findQuery);
  if(userData){
    return res.status(200).json({
      name:userData.name??'Guest User',
      userId:userData.userId??userData.googleId,
      email:userData.email
    })

  }

  let createdUserData = await USER.create({googleId,name,email,emailVerified:true,image,isGoogleLogin:true,password:crypto.randomBytes(14)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 14)})
  res.status(200).json({
    name:createdUserData.name??'Guest User',
    userId:createdUserData.userId??createdUserData.googleId,
    email:createdUserData.email
  })
})