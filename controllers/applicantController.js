const Applicant = require('../models/Applicant');
const Job = require('../models/Job');

exports.applyForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).render('errors/404');
        
        // Check if already applied
        const existing = await Applicant.findOne({ job: jobId, candidate: req.user._id });
        if (existing) {
            return res.redirect(`/jobs/${jobId}?error=already_applied`);
        }

        const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : '';
        const { skills, experience } = req.body;
        
        const skillArray = skills ? skills.split(',').map(s => s.trim()) : [];

        await Applicant.create({
            job: jobId,
            candidate: req.user._id,
            resumeUrl,
            skills: skillArray,
            experience: experience || 0
        });

        res.redirect(`/dashboard?success=applied`);
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
};

exports.getPipeline = async (req, res) => {
    try {
        // Find jobs posted by the current recruiter
        const recruiterJobs = await Job.find({ postedBy: req.user._id }).select('_id');
        const jobIds = recruiterJobs.map(j => j._id);

        const applicants = await Applicant.find({ job: { $in: jobIds } })
            .populate('candidate', 'name email')
            .populate('job', 'title');
            
        // Group by stage
        const pipeline = {
            'Applied': [],
            'Screening': [],
            'Technical Interview': [],
            'HR Interview': [],
            'Offer': [],
            'Hired': [],
            'Rejected': []
        };
        
        applicants.forEach(app => {
            // Ensure job and candidate are not null (in case of orphan records)
            if (app.job && app.candidate && pipeline[app.stage]) {
                pipeline[app.stage].push(app);
            }
        });

        res.render('applicants/pipeline', { title: 'Applicant Pipeline', pipeline });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
};

exports.updateStage = async (req, res) => {
    try {
        const { stage } = req.body;
        await Applicant.findByIdAndUpdate(req.params.id, { stage });
        res.redirect('/applicants/pipeline');
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
};
