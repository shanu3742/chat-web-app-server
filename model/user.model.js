const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: [true, "please provide unique userId"],
      require: [true, "please provide userId"],
      minLength: [6, "user id must be more then 6 words"],
      maxLength: [35, "user id must be less then 35 words"],
    },
    email: {
      type: String,
      unique: [true, "please provide unique email"],
      require: [true, "please provide email"],
      validate: {
        validator: function (v) {
          // Regular expression for validating email
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minLength: [8, "password must be more then 6 words"],
      maxLength: [15, "password must be less then 15 words"],
    },
    googleId: {
      type: String, // To store the Google OAuth ID
      unique: true,
      sparse: true, // Allows multiple users to have null Google IDs
    },
    isGoogleLogin: {
      type: Boolean,
      default: false, // Set true for Google login users
    },
    emailVerified: {
      type: Boolean,
      default: false, // Set true for Google login users
    },
  },
  { timestamps: true }
);
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.pre("save", async function (next) {
  //if password is not updated then go to next step
  if (!this.isModified("password")) {
    next();
  }
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
exports.USER = mongoose.model("User", userSchema);
