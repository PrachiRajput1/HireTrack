const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', jobController.getAllJobs);
router.get('/create', authorize('recruiter'), jobController.getCreateJob);
router.post('/create', authorize('recruiter'), jobController.postCreateJob);
router.get('/:id', jobController.getJobDetails);
router.get('/:id/edit', authorize('recruiter'), jobController.getEditJob);
router.post('/:id/edit', authorize('recruiter'), jobController.postEditJob);
router.post('/:id/delete', authorize('recruiter'), jobController.deleteJob);

module.exports = router;
