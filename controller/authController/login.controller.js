const { USER } = require("../../model/user.model");
exports.userRegister = async (req,res) => {
    try{
      let email = req.body.email;
      let userId =req.body.userId;
      let password=req.body.password;
      if(!email || !userId || !password){
        return res.status(400).send({
            message:'Please Provide All Require Field'
        })
      }
      
      let userData = await USER.create({
        email,
        userId,
        password
      })
     
      if(userData){
        return res.status(201).send({
            message:'User Account Created'
        })
      }else{
        return res.status(400).send({
            message:'Something Went Wrong'
        })
      }
    }catch(e){
        res.status(500).send({
            message:'Internal Server Error',
            db_error:e

        })
    }
}
exports.userLogIn = async  (req,res) => {
    try{
     let userId = req.body?.userId??'';
     let email = req.body?.email??'';
     let password = req.body.password;

     if(!userId  && !email){
        return res.status(400).send({
            message:'Please Provide require field'
        })
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
        return  res.status(401).send({
            message:'Invalid Credetial'
        })
     }

    }catch(e){
        res.status(500).send({
            message:'Network Error'
        })
    }
}
exports.googleLogin = async (req,res) => {
  try{
    let googleId = req.body.googleId;
    let userData = await USER.findOne({googleId:googleId});
    if(!userData){
      //create a user in data base
      let userId = req.body.googleId;
      let name = req.body.name;
      let email = req.body.email;
      let emailVerified= req.body.emailVerified;
      let image = req.body.photoURL;
      let isGoogleLogin=true;
      
      let createdUserData = await USER.create({googleId,userId,name,email,emailVerified,image,isGoogleLogin})
      return res.status(200).json({
        name:createdUserData.name??'Guest User',
        userId:createdUserData.userId,
        email:createdUserData.email
      })
    }else{
      return res.status(200).json({
        name:userData.name??'Guest User',
        userId:userData.userId,
        email:userData.email
      })

    }
  }catch(e){
    console.log(e)
    res.status(500).send({
      message:'Network Error'
  })
  }
}