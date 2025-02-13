const EventEmitter = require("events");
const { sendOtpEmail } = require("../service/email.service");

let emailNotificationEvent = new EventEmitter();

emailNotificationEvent.on("sendOtp",async (email,otp) => {
    console.log('send otp on email',email,otp)
    sendOtpEmail(email,otp)
})

exports.sendMail = (email,otp) => {
     emailNotificationEvent.emit('sendOtp',email,otp)
}


