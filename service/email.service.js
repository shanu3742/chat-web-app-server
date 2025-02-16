const nodeMailer = require("nodemailer");
const {
  emailOtpTemplate,
  accountCreatedTemplate,
} = require("../template/otp.email.template");
const transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_EMAIL_PASSWORD,
  },
  secure: true,
});

const sendOtpEmail = async (email, otp) => {
  let mailOptions = {
    from: process.env.APP_EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: emailOtpTemplate(otp),
  };

  return transporter.sendMail(mailOptions);
};
const sendRegistrationEmail = async (email, userId) => {
  let mailOptions = {
    from: process.env.APP_EMAIL,
    to: email,
    subject: "Account Register",
    html: accountCreatedTemplate(userId),
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail, sendRegistrationEmail };
