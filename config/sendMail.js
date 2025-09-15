import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" })


// FOR RESET PASSWORD STEPS IN THIS PROJECT
// since we are creating 3 pages and each page will deal wth sensitive info, for resetting password
// step1- enter email, we send otp n put same otp on db of user and also its expiration time
// step2- a new request comes in with otp and mail address to reset otp, we verify with db otp and expire time, if yes we put otpverified and send a success to client, 
// step3 - now a new request comes in with emailaddress, new password, we check if otpVerified is true or not, if yes(optional but if expires for this is not yet there or not)- then we reset password

const sendMail = async (to, otp, subject = null, message = null) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: to,
        subject: subject ? subject : "Reset your Password",
        html: message ? message : `<b>Your OTP for password reset is: ${otp}</b>`, // HTML body
    });
    console.log("Message sent:", info.messageId);
};

export default sendMail;