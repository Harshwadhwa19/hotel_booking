const nodemailer = require('nodemailer');
require('dotenv').config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('WARNING: EMAIL_USER or EMAIL_PASS not found in environment variables');
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000
});

// Verify connection configuration on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP Connection Verification FAILED:', error.message);
    } else {
        console.log('SMTP Server is ready');
    }
});

const sendEmail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return false;
    }

    try {
        await transporter.sendMail({
            from: `"Grand Hotel" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text
        });
        console.log(`[REAL-MAIL-SUCCESS] Email successfully delivered to ${to}`);
        return true;
    } catch (err) {
        console.error('Nodemailer Error:', err.message);
        return false;
    }
};

module.exports = { sendEmail };
