const mongoose = require('mongoose');

const scorecardSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true
    },
    evaluator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    technicalSkills: { type: Number, min: 1, max: 5, required: true },
    communication: { type: Number, min: 1, max: 5, required: true },
    problemSolving: { type: Number, min: 1, max: 5, required: true },
    leadership: { type: Number, min: 1, max: 5, required: true },
    teamwork: { type: Number, min: 1, max: 5, required: true },
    cultureFit: { type: Number, min: 1, max: 5, required: true },
    overallScore: { type: Number, required: true },
    comments: { type: String, default: '' }
}, { timestamps: true });

// Pre-save hook to calculate overall score (Mongoose 7+ style)
scorecardSchema.pre('validate', function() {
    if (this.technicalSkills && this.communication && this.problemSolving && this.leadership && this.teamwork && this.cultureFit) {
        this.overallScore = parseFloat(((this.technicalSkills + this.communication + this.problemSolving + this.leadership + this.teamwork + this.cultureFit) / 6).toFixed(1));
    }
});

module.exports = mongoose.model('Scorecard', scorecardSchema);
