exports.emailOtpTemplate = (otp) => {
     return   `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
        <div style="text-align: center;">
            <h2 style="color: #4CAF50;">Mingle App</h2>
            <p style="font-size: 16px; color: #555;">Hello,</p>
            <p style="font-size: 16px; color: #555;">Your OTP for verification is:</p>

            <!-- Copyable OTP inside an input field -->
            <input type="text" value="${otp}" readonly style="text-align: center; font-size: 20px; border: 1px solid #ddd; padding: 10px; border-radius: 5px; width: 200px;">

            <p style="font-size: 14px; color: #777;">This OTP is valid for 5 minutes.</p>
            <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <footer style="text-align: center; font-size: 12px; color: #aaa;">
            © ${new Date().getFullYear()} Mingle App. All rights reserved.
        </footer>
    </div>`;
}