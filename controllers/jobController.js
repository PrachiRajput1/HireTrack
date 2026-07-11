const Job = require('../models/Job');
const Applicant = require('../models/Applicant');

exports.getAllJobs = async (req, res) => {
    try {
        const query = req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {};
        if (req.query.department) query.department = req.query.department;
        if (req.query.workModel) query.workModel = req.query.workModel;
        
        let jobs = await Job.find(query).sort({ createdAt: -1 }).lean();

        // If candidate, only show open jobs
        if (req.user && req.user.role === 'candidate') {
            jobs = jobs.filter(job => job.status === 'open');
        }

        // Add analytics for recruiters
        if (req.user && req.user.role === 'recruiter') {
            for (let job of jobs) {
                job.applicantCount = await Applicant.countDocuments({ job: job._id });
                job.hiredCount = await Applicant.countDocuments({ job: job._id, stage: 'Hired' });
            }
        }

        res.render('jobs/list', { title: 'Jobs', jobs, query: req.query });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
};

exports.getCreateJob = (req, res) => {
    res.render('jobs/create', { title: 'Create Job' });
};

exports.postCreateJob = async (req, res) => {
    try {
        const { title, department, location, type, description, requirements, experienceLevel, salaryRange, workModel, skills } = req.body;
        const parsedSkills = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];
        
        await Job.create({
            title, department, location, type, description, requirements,
            experienceLevel, salaryRange, workModel, skills: parsedSkills,
            postedBy: req.user._id
        });
        res.redirect('/jobs');
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
};

exports.getJobDetails = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name company');
        if (!job) return res.status(404).render('errors/404');
        
        let applicantCount = 0;
        if (req.user && req.user.role === 'recruiter') {
            applicantCount = await Applicant.countDocuments({ job: job._id });
        }
        
        res.render('jobs/details', { title: job.title, job, applicantCount });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
};

exports.getEditJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).render('errors/404');
        res.render('jobs/edit', { title: 'Edit Job', job });
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
};

exports.postEditJob = async (req, res) => {
    try {
        const { title, department, location, type, description, requirements, experienceLevel, salaryRange, workModel, skills, status } = req.body;
        const parsedSkills = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];
        
        await Job.findByIdAndUpdate(req.params.id, {
            title, department, location, type, description, requirements,
            experienceLevel, salaryRange, workModel, skills: parsedSkills, status
        });
        res.redirect(`/jobs/${req.params.id}`);
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
};

exports.deleteJob = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.redirect('/jobs');
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500');
    }
};
