const nodeMailer = require("nodemailer");
const { emailOtpTemplate } = require("../template/otp.email.template");

const sendOtpEmail = async(email, otp)  => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_EMAIL_PASSWORD,
        },
        secure: true,
      });

    let mailOptions = {
        from: process.env.APP_EMAIL,
        to: email,
        subject: "Your OTP Code",
        html: emailOtpTemplate(otp),
    };

    return transporter.sendMail(mailOptions);
}

module.exports = { sendOtpEmail };
