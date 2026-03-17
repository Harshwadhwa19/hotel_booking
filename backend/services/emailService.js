const nodemailer = require('nodemailer');
require('dotenv').config();

// ✅ Check env variables
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ WARNING: EMAIL_USER or EMAIL_PASS not set');
}

// ✅ Create transporter (Render-safe config)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // MUST be false for port 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// ✅ Verify connection (non-blocking)
transporter.verify()
    .then(() => console.log('✅ SMTP Ready (Gmail Port 587)'))
    .catch(err => console.warn('⚠️ SMTP Verify Failed:', err.message));

// ✅ Send Email function
const sendEmail = async (to, subject, text) => {
    try {
        // ❌ If credentials missing → fallback
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Missing email credentials');
        }

        await transporter.sendMail({
            from: `"Grand Hotel" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        });

        console.log(`✅ EMAIL SENT to ${to}`);
        return true;

    } catch (err) {
        // Keep ONLY the error message, NOT the OTP
        console.error('❌ EMAIL DELIVERY FAILED:', err.message);
        return false;
    }
};

module.exports = { sendEmail };