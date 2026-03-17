const nodemailer = require('nodemailer');
require('dotenv').config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('WARNING: EMAIL_USER or EMAIL_PASS not found in environment variables');
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS (Port 587)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
});

// Verify connection configuration on startup
transporter.verify(function (error, success) {
    if (error) {
        console.warn('SMTP Warning (Verify):', error.message);
    } else {
        console.log('SMTP Server is ready (Port 587)');
    }
});

const sendEmail = async (to, subject, text) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('[EMAIL ERROR] Credentials missing. Fallback OTP:', text);
        return false;
    }

    try {
        await transporter.sendMail({
            from: `"Grand Hotel" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text
        });
        console.log(`[REAL-MAIL-SUCCESS] Email delivered to ${to}`);
        return true;
    } catch (err) {
        // Safe fallback - log the OTP so the user can see it in Render logs
        console.error('Nodemailer Error (Port 587 Failed):', err.message);
        console.log('--- FALLBACK OTP LOG ---');
        console.log(`To: ${to}`);
        console.log(`Content: ${text}`);
        console.log('------------------------');
        return false;
    }
};

module.exports = { sendEmail };
