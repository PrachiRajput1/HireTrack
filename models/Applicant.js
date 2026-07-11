const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumeUrl: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    experience: {
        type: Number, // Years of experience
        default: 0
    },
    stage: {
        type: String,
        enum: ['Applied', 'Screening', 'Technical Interview', 'HR Interview', 'Offer', 'Hired', 'Rejected'],
        default: 'Applied'
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Applicant', applicantSchema);
