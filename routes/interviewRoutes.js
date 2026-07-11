const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Interview = require('../models/Interview');
const Applicant = require('../models/Applicant');

router.use(protect);

router.get('/', authorize('recruiter'), async (req, res) => {
    try {
        const interviews = await Interview.find({ interviewer: req.user._id })
            .populate({ path: 'applicant', populate: { path: 'candidate', select: 'name email' } })
            .populate({ path: 'applicant', populate: { path: 'job', select: 'title' } })
            .sort({ date: 1 });
        res.render('interviews/list', { title: 'Interviews', interviews });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
});

router.post('/schedule', authorize('recruiter'), async (req, res) => {
    try {
        const { applicantId, date, time, meetingLink, notes } = req.body;
        await Interview.create({
            applicant: applicantId,
            interviewer: req.user._id,
            date, time, meetingLink, notes
        });
        res.redirect('/interviews');
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
});

module.exports = router;
