const { USER } = require("../../model/user.model");
const admin = require('firebase-admin');
const { fbServiceKey } = require("../../serviceAccountKey");


admin.initializeApp({
  credential: admin.credential.cert(fbServiceKey)
});

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
     if(userData.isGoogleLogin){
      return  res.status(403).send({
        message:'This email is registered with Google login. Please log in using Google.'
      })
     }
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
            message:e.message??'Network Error'
        })
    }
}
exports.googleLogin = async (req,res) => {
  try{
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).send({
      message:"Unauthorized"
    })
  }
  const googleToken= authHeader.split(' ')[1];
  console.log(googleToken)
  const decodeToken = await  admin.auth().verifyIdToken(googleToken);
  if(!decodeToken){
    return res.status(401).send({
      message:"Unauthorized"
    })
  }

  const {uid:googleId,email,name,picture:image} = decodeToken;

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

  let createdUserData = await USER.create({googleId,name,email,emailVerified:true,image,isGoogleLogin:true})
  res.status(200).json({
    name:createdUserData.name??'Guest User',
    userId:createdUserData.userId??createdUserData.googleId,
    email:createdUserData.email
  })
   
  }catch(e){
    res.status(500).send({
      message:e.message??'Network Error'
  })
  }
}