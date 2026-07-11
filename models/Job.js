const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    type: {
        type: String, // Full-time, Part-time, Contract
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        default: 'Mid Level'
    },
    salaryRange: {
        type: String,
        default: 'Not specified'
    },
    workModel: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid'],
        default: 'On-site'
    },
    skills: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
