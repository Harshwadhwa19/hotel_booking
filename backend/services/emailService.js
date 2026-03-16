const nodemailer = require('nodemailer');
require('dotenv').config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('WARNING: EMAIL_USER or EMAIL_PASS not found in environment variables');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"Grand Hotel" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text
        });
        console.log(`[EMAIL SENT to ${to}]`);
        return true;
    } catch (err) {
        console.error('Nodemailer Error:', err.message);
        return false;
    }
};

module.exports = { sendEmail };
