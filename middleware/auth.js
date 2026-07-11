const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        if (!token) {
            return res.redirect('/auth/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.redirect('/auth/login');
        }
        
        res.locals.currentUser = req.user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.clearCookie('token');
        return res.redirect('/auth/login');
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).render('errors/403', { title: '403 - Forbidden' });
        }
        next();
    };
};

// Optional check for non-protected routes (like landing page)
const checkAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            res.locals.currentUser = req.user;
        } else {
            res.locals.currentUser = null;
        }
    } catch (error) {
        res.locals.currentUser = null;
    }
    next();
};

module.exports = { protect, authorize, checkAuth };
