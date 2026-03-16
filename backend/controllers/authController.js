const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../services/emailService');

// Helper to generate 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

exports.register = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user = await prisma.user.create({
            data: { 
                name, 
                email, 
                password: hashedPassword, 
                phone,
                otp,
                otpExpires,
                isVerified: false
            }
        });

        // Send OTP via Email
        const subject = 'Your Grand Hotel Verification Code';
        const message = `Your Grand Hotel verification code is: ${otp}`;
        await sendEmail(email, subject, message);

        // Still log for safety
        console.log(`[OTP LOGGED for ${email}]: ${otp}`);

        res.json({ msg: 'OTP sent to your email. Please verify your account.', email });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    // ... rest of the file ...
    const { email, password } = req.body;
    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        if (!user.isVerified) {
            return res.status(401).json({ msg: 'Account not verified. Please verify your email.', unverified: true });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
            where: { email },
            data: { otp, otpExpires }
        });

        // Send OTP via Email
        const subject = 'Your Grand Hotel Verification Code';
        const message = `Your Grand Hotel verification code is: ${otp}`;
        await sendEmail(email, subject, message);

        console.log(`[OTP LOGGED for ${email}]: ${otp}`);
        res.json({ msg: 'OTP sent to your email' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Invalid request' });

        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ msg: 'Invalid or expired OTP' });
        }

        await prisma.user.update({
            where: { email },
            data: { 
                isVerified: true,
                otp: null,
                otpExpires: null
            }
        });

        res.json({ msg: 'Account verified successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isVerified) return res.status(400).json({ msg: 'Invalid request' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        res.json({ msg: 'Password reset successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
