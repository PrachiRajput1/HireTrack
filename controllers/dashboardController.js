const Job = require('../models/Job');
const Applicant = require('../models/Applicant');
const Interview = require('../models/Interview');

exports.getDashboard = async (req, res) => {
    try {
        if (req.user.role === 'recruiter') {
            const recruiterJobs = await Job.find({ postedBy: req.user._id }).select('_id');
            const jobIds = recruiterJobs.map(j => j._id);

            const totalJobs = await Job.countDocuments({ postedBy: req.user._id });
            const activeJobs = await Job.countDocuments({ postedBy: req.user._id, status: 'open' });
            
            // Filter applicants by the recruiter's jobs
            const totalApplicants = await Applicant.countDocuments({ job: { $in: jobIds } });
            
            const pipeline = await Applicant.aggregate([
                { $match: { job: { $in: jobIds } } },
                { $group: { _id: '$stage', count: { $sum: 1 } } }
            ]);
            
            let pipelineData = {
                Applied: 0, Screening: 0, 'Technical Interview': 0, 'HR Interview': 0, Offer: 0, Hired: 0, Rejected: 0
            };
            
            pipeline.forEach(item => {
                if (pipelineData[item._id] !== undefined) {
                    pipelineData[item._id] = item.count;
                }
            });

            const recentApplicantsRaw = await Applicant.find({ job: { $in: jobIds } })
                .sort({ createdAt: -1 })
                .limit(15) // fetch more to account for orphans
                .populate('candidate', 'name email')
                .populate('job', 'title');

            // Filter out orphans
            const recentApplicants = recentApplicantsRaw.filter(app => app.job != null && app.candidate != null).slice(0, 5);

            const upcomingInterviewsRaw = await Interview.find({ interviewer: req.user._id, status: 'Scheduled' })
                .sort({ date: 1 })
                .limit(10)
                .populate({
                    path: 'applicant',
                    populate: { path: 'candidate', select: 'name' }
                });
                
            const upcomingInterviews = upcomingInterviewsRaw.filter(i => i.applicant != null && i.applicant.candidate != null).slice(0, 5);

            res.render('dashboard/recruiter', {
                title: 'Recruiter Dashboard',
                stats: { totalJobs, totalApplicants, activeJobs, hired: pipelineData.Hired },
                pipelineData,
                recentApplicants,
                upcomingInterviews
            });
        } else {
            // Candidate dashboard
            const appliedJobs = await Applicant.find({ candidate: req.user._id }).populate('job');
            const interviews = await Interview.find()
                .populate({
                    path: 'applicant',
                    match: { candidate: req.user._id }
                })
                .sort({ date: 1 });

            // Filter out null applicants due to match
            const candidateInterviews = interviews.filter(i => i.applicant !== null);

            res.render('dashboard/candidate', {
                title: 'Candidate Dashboard',
                applications: appliedJobs,
                interviews: candidateInterviews
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('errors/500', { title: 'Server Error' });
    }
};
