require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Job = require('./models/Job');
const Applicant = require('./models/Applicant');
const Scorecard = require('./models/Scorecard');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hiretrack';

async function seedDatabase() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected. Clearing existing data...');
        
        await User.deleteMany({});
        await Job.deleteMany({});
        await Applicant.deleteMany({});
        await Scorecard.deleteMany({});
        
        console.log('Creating users...');
        const passwordHash = await bcrypt.hash('password123', 10);
        
        // Ensure we bypass the User model pre-save hook that hashes passwords since we manually hashed it here,
        // Actually, User.insertMany skips `save` middleware, which is perfect for this!
        
        const usersData = [
            { name: 'Alice Recruiter', email: 'admin@test.com', password: passwordHash, role: 'recruiter', company: 'TechNova Solutions' },
            { name: 'Bob HR', email: 'hr@test.com', password: passwordHash, role: 'recruiter', company: 'Global Innovations' },
            { name: 'John Doe', email: 'candidate@test.com', password: passwordHash, role: 'candidate', company: '' },
            { name: 'Emma Smith', email: 'emma@test.com', password: passwordHash, role: 'candidate', company: '' },
            { name: 'Michael Chen', email: 'michael@test.com', password: passwordHash, role: 'candidate', company: '' },
            { name: 'Sarah Jones', email: 'sarah@test.com', password: passwordHash, role: 'candidate', company: '' },
            { name: 'David Kim', email: 'david@test.com', password: passwordHash, role: 'candidate', company: '' },
            { name: 'Jessica Taylor', email: 'jessica@test.com', password: passwordHash, role: 'candidate', company: '' },
            { name: 'Robert Wilson', email: 'robert@test.com', password: passwordHash, role: 'candidate', company: '' },
        ];
        
        const createdUsers = await User.insertMany(usersData);
        
        const mainRecruiter = createdUsers.find(u => u.email === 'admin@test.com');
        const hrRecruiter = createdUsers.find(u => u.email === 'hr@test.com');
        const candidates = createdUsers.filter(u => u.role === 'candidate');
        
        console.log('Creating jobs...');
        const jobsData = [
            {
                title: 'Senior Frontend Engineer',
                department: 'Engineering',
                location: 'San Francisco, CA',
                type: 'Full-time',
                description: 'We are looking for an experienced Frontend Engineer to lead our core product team. You will be building high-performance, modern web applications.',
                requirements: '- 5+ years of experience with React\n- Deep understanding of modern JavaScript\n- Experience with performance profiling\n- Mentorship skills',
                experienceLevel: 'Senior Level',
                salaryRange: '$140k - $180k',
                workModel: 'Hybrid',
                skills: ['React', 'TypeScript', 'Redux', 'CSS Architecture'],
                status: 'open',
                postedBy: mainRecruiter._id
            },
            {
                title: 'Product Designer (UI/UX)',
                department: 'Design',
                location: 'Remote',
                type: 'Full-time',
                description: 'Join our creative team to shape the future of our digital products. We value pixel-perfect design and deep user empathy.',
                requirements: '- 3+ years in Product Design\n- Strong portfolio demonstrating complex problem solving\n- Mastery of Figma\n- Basic understanding of HTML/CSS',
                experienceLevel: 'Mid Level',
                salaryRange: '$100k - $130k',
                workModel: 'Remote',
                skills: ['Figma', 'Prototyping', 'User Research', 'Wireframing'],
                status: 'open',
                postedBy: mainRecruiter._id
            },
            {
                title: 'Backend Developer (Node.js)',
                department: 'Engineering',
                location: 'New York, NY',
                type: 'Full-time',
                description: 'Build robust, scalable APIs to power our mobile and web clients. You will work closely with frontend engineers and data scientists.',
                requirements: '- Strong experience with Node.js and Express\n- Solid understanding of MongoDB and Redis\n- Familiarity with AWS/GCP\n- Microservices architecture experience is a plus',
                experienceLevel: 'Mid Level',
                salaryRange: '$120k - $150k',
                workModel: 'On-site',
                skills: ['Node.js', 'Express', 'MongoDB', 'AWS', 'Docker'],
                status: 'open',
                postedBy: mainRecruiter._id
            },
            {
                title: 'Growth Marketing Manager',
                department: 'Marketing',
                location: 'Austin, TX',
                type: 'Full-time',
                description: 'Drive user acquisition and retention campaigns across multiple digital channels.',
                requirements: '- Data-driven mindset\n- Experience managing significant ad budgets\n- SEO/SEM expertise\n- Excellent copywriting skills',
                experienceLevel: 'Mid Level',
                salaryRange: '$90k - $120k',
                workModel: 'Hybrid',
                skills: ['SEO', 'Google Ads', 'Analytics', 'Copywriting'],
                status: 'open',
                postedBy: hrRecruiter._id
            },
            {
                title: 'Junior QA Analyst',
                department: 'Engineering',
                location: 'Remote',
                type: 'Contract',
                description: 'Help us ensure the highest quality of our software releases by performing manual and automated testing.',
                requirements: '- Attention to detail\n- Basic knowledge of JavaScript\n- Familiarity with Cypress or Selenium',
                experienceLevel: 'Entry Level',
                salaryRange: '$60k - $80k',
                workModel: 'Remote',
                skills: ['QA', 'Manual Testing', 'Cypress', 'JavaScript'],
                status: 'closed',
                postedBy: mainRecruiter._id
            }
        ];
        
        const createdJobs = await Job.insertMany(jobsData);
        
        console.log('Creating applicants...');
        const frontendJob = createdJobs.find(j => j.title.includes('Frontend'));
        const designerJob = createdJobs.find(j => j.title.includes('Designer'));
        const backendJob = createdJobs.find(j => j.title.includes('Backend'));
        
        const stages = ['Applied', 'Screening', 'Technical Interview', 'HR Interview', 'Offer', 'Hired', 'Rejected'];
        
        const applicantsData = [
            // Frontend Engineer Applicants
            {
                job: frontendJob._id,
                candidate: candidates[0]._id, // John Doe
                resumeUrl: '/uploads/dummy_resume.pdf',
                skills: ['React', 'JavaScript', 'HTML/CSS'],
                experience: 6,
                stage: 'Technical Interview',
                notes: 'Strong JS fundamentals. Needs to brush up on architectural patterns.'
            },
            {
                job: frontendJob._id,
                candidate: candidates[1]._id, // Emma Smith
                resumeUrl: '/uploads/dummy_resume.pdf',
                skills: ['Vue.js', 'React', 'TypeScript'],
                experience: 4,
                stage: 'Offer',
                notes: 'Excellent candidate, great culture fit. Extended offer on Friday.'
            },
            {
                job: frontendJob._id,
                candidate: candidates[2]._id, // Michael
                resumeUrl: '/uploads/dummy_resume.pdf',
                skills: ['React', 'Redux', 'Webpack'],
                experience: 8,
                stage: 'Screening',
                notes: 'Overqualified but salary expectations align.'
            },
            
            // Product Designer Applicants
            {
                job: designerJob._id,
                candidate: candidates[3]._id, // Sarah
                resumeUrl: '/uploads/dummy_resume.pdf',
                skills: ['Figma', 'Sketch', 'Adobe XD'],
                experience: 3,
                stage: 'HR Interview',
                notes: 'Great portfolio. Scheduled for HR screening.'
            },
            {
                job: designerJob._id,
                candidate: candidates[4]._id, // David
                resumeUrl: '/uploads/dummy_resume.pdf',
                skills: ['UI Design', 'Figma'],
                experience: 2,
                stage: 'Applied',
                notes: ''
            },
            
            // Backend Developer Applicants
            {
                job: backendJob._id,
                candidate: candidates[5]._id, // Jessica
                resumeUrl: '/uploads/dummy_resume.pdf',
                skills: ['Node.js', 'MongoDB', 'AWS'],
                experience: 5,
                stage: 'Hired',
                notes: 'Accepted offer. Starting next month.'
            },
            {
                job: backendJob._id,
                candidate: candidates[6]._id, // Robert
                resumeUrl: '/uploads/dummy_resume.pdf',
                skills: ['Python', 'Node.js'],
                experience: 1,
                stage: 'Rejected',
                notes: 'Not enough Node experience.'
            }
        ];
        
        await Applicant.insertMany(applicantsData);
        
        console.log('Database seeded successfully!');
        
        console.log('--------------------------------------------------');
        console.log('DUMMY ACCOUNTS TO TEST WITH:');
        console.log('RECRUITER 1: admin@test.com / password123');
        console.log('RECRUITER 2: hr@test.com / password123');
        console.log('CANDIDATE: candidate@test.com / password123');
        console.log('--------------------------------------------------');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
