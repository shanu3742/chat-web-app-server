const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new  mongoose.Schema({
    userId:{
        type:String,
        unique:[true,'please provide unique userId'],
        require:[true,'please provide userId'],
        minLength:[6,'user id must be more then 6 words'],
        maxLength:[15,'user id must be less then 15 words']
    },
    email:{
        type:String,
        unique:[true,'please provide unique email'],
        require:[true,'please provide email'],
        validate: {
        validator: function (v) {
          // Regular expression for validating email
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }

    },
    name:{
        type:String
    },
    image:{
        type:String
    },
    password:{
        type:String,
        require:[true,'please provide password'],
        minLength:[8,'password must be more then 6 words'],
        maxLength:[15,'password must be less then 15 words']
    }

},
{ timestamps: true }
)
userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
userSchema.pre('save',async function (next){
    if(!this.isModified){
        next()
    }
    const salt =  await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})
exports.USER= mongoose.model('User',userSchema);