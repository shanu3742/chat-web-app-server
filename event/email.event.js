const EventEmitter = require("events");
const {
  sendOtpEmail,
  sendRegistrationEmail,
} = require("../service/email.service");

let emailNotificationEvent = new EventEmitter();

emailNotificationEvent.on("sendOtp", async (email, otp) => {
  sendOtpEmail(email, otp);
});

emailNotificationEvent.on("register-account", async (email, userId) => {
  sendRegistrationEmail(email, userId);
});

exports.sendMail = (email) => {
  return {
    sendOtp: (otp) => emailNotificationEvent.emit("sendOtp", email, otp),
    registerAccount: (userId) => {
      emailNotificationEvent.emit("register-account", email, userId);
    },
  };
};
