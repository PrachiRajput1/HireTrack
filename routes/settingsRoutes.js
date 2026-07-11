const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', (req, res) => {
    res.render('settings/index', { title: 'Settings - HireTrack', query: req.query });
});

router.post('/password', async (req, res) => {
    try {
        const User = require('../models/User');
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.redirect('/settings?error=wrong_password');
        }
        user.password = newPassword;
        await user.save();
        res.redirect('/settings?success=password_changed');
    } catch (err) {
        console.error(err);
        res.redirect('/settings?error=server');
    }
});

router.post('/profile', async (req, res) => {
    try {
        const User = require('../models/User');
        const { name, headline, bio, location, skills, githubUrl, linkedinUrl, portfolioUrl, company } = req.body;
        
        const parsedSkills = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];
        
        await User.findByIdAndUpdate(req.user._id, {
            name, headline, bio, location, skills: parsedSkills, githubUrl, linkedinUrl, portfolioUrl, company
        });
        
        // Also update req.user so the session reflects it immediately
        req.user.name = name;
        if (company) req.user.company = company;
        
        res.redirect('/settings?success=profile_updated');
    } catch (err) {
        console.error(err);
        res.redirect('/settings?error=server');
    }
});

module.exports = router;
