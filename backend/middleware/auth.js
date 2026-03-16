const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded.user;
        console.log('Auth middleware: Token valid for user', req.user.id);
        next();
    } catch (err) {
        console.error('Auth middleware: Token invalid');
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
