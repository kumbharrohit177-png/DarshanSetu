const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['medical', 'fire', 'overcrowding', 'security', 'other'],
        required: true,
    },
    location: {
        type: String, // Could be zone name or coordinates
        required: true,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['open', 'investigating', 'resolved'],
        default: 'open',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Police or Medical staff
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resolvedAt: {
        type: Date,
    }
});

module.exports = mongoose.model('Incident', incidentSchema);
