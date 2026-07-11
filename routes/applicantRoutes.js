const express = require('express');
const router = express.Router();
const applicantController = require('../controllers/applicantController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/upload');

router.use(protect);

router.post('/apply/:jobId', authorize('candidate'), upload.single('resume'), applicantController.applyForJob);
router.get('/pipeline', authorize('recruiter'), applicantController.getPipeline);
router.post('/:id/stage', authorize('recruiter'), applicantController.updateStage);

module.exports = router;
