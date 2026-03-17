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
    tls: {
        rejectUnauthorized: false // Helps with some cloud hosting certificate issues
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('SMTP Connection Error:', error.message);
    } else {
        console.log('SMTP Server is ready to take our messages');
    }
});

const sendEmail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('[EMAIL ERROR] EMAIL_USER or EMAIL_PASS environment variables are MISSING!');
        return false;
    }

    try {
        console.log(`[EMAIL ATTEMPT] Sending to ${to} using ${process.env.EMAIL_USER}...`);
        const info = await transporter.sendMail({
            from: `"Grand Hotel" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text
        });
        console.log(`[EMAIL SUCCESS] Message sent: ${info.messageId}`);
        return true;
    } catch (err) {
        console.error('Nodemailer Error:', err.message);
        if (err.message.includes('Invalid login')) {
            console.error('CRITICAL: Gmail App Password might be incorrect or revoked.');
        }
        return false;
    }
};

module.exports = { sendEmail };
