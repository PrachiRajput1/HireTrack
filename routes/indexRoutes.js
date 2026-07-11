const express = require('express');
const router = express.Router();
const { checkAuth } = require('../middleware/auth');

router.use(checkAuth);

router.get('/', (req, res) => {
  // If already logged in, redirect to dashboard
  if (res.locals.currentUser) {
    return res.redirect(res.locals.currentUser.role === 'recruiter' ? '/dashboard' : '/jobs');
  }
  res.render('landing/index', { title: 'HireTrack – Hire the Best Talent, Faster' });
});

module.exports = router;
