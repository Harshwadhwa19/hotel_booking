const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../services/emailService');

// Helper to generate 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

exports.register = async (req, res) => {
    const { name, email, password, phone } = req.body;
    console.log('Registration request received for:', email);
    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            console.log('User already exists:', email);
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await prisma.user.create({
            data: { 
                name, 
                email, 
                password: hashedPassword, 
                phone,
                isVerified: true
            }
        });

        res.json({ msg: 'Account created successfully. Please login.', email });
    } catch (err) {
        console.error('Registration Controller Error:', err);
        res.status(500).json({ msg: 'Internal server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    // ... rest of the file ...
    const { email, password } = req.body;
    try {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // OTP check removed as per user request

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
    res.json({ msg: 'OTP system disabled' });
};

exports.verifyOtp = async (req, res) => {
    res.json({ msg: 'OTP system disabled' });
};
    } catch (err) {
        console.error('[OTP VERIFY] Controller Error:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
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
