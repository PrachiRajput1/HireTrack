const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.getLogin = (req, res) => {
    const error = req.query.error || null;
    let errorMsg = null;
    if (error === 'invalid') errorMsg = 'Invalid email or password. Please try again.';
    if (error === 'server') errorMsg = 'A server error occurred. Please try again.';
    res.render('auth/login', { title: 'Login - HireTrack', errorMsg });
};

exports.postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.redirect('/auth/login?error=invalid');

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user || !(await user.comparePassword(password))) {
            return res.redirect('/auth/login?error=invalid');
        }

        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.redirect(user.role === 'recruiter' ? '/dashboard' : '/jobs');
    } catch (error) {
        console.error('Login error:', error);
        return res.redirect('/auth/login?error=server');
    }
};

exports.getRegister = (req, res) => {
    const error = req.query.error || null;
    let errorMsg = null;
    if (error === 'exists') errorMsg = 'An account with that email already exists.';
    if (error === 'server') errorMsg = 'A server error occurred. Please try again.';
    res.render('auth/register', { title: 'Register - HireTrack', errorMsg });
};

exports.postRegister = async (req, res) => {
    try {
        const { name, email, password, role, company } = req.body;
        if (!name || !email || !password) return res.redirect('/auth/register?error=server');

        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) return res.redirect('/auth/register?error=exists');

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role: role === 'recruiter' ? 'recruiter' : 'candidate',
            company: company ? company.trim() : ''
        });

        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.redirect(user.role === 'recruiter' ? '/dashboard' : '/jobs');
    } catch (error) {
        console.error('Register error:', error);
        return res.redirect('/auth/register?error=server');
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};
