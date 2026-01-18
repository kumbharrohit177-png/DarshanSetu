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
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },
    location: {
        type: String, // Could be zone name or coordinates
        required: true,
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['open', 'investigating', 'en_route', 'on_scene', 'resolved'],
        default: 'open',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Police or Medical staff
    },
    assignedResources: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MedicalResource'
    }],
    responseLog: [{
        timestamp: {
            type: Date,
            default: Date.now
        },
        action: {
            type: String,
            enum: ['reported', 'dispatched', 'en_route', 'arrived', 'on_scene', 'resolved']
        },
        resourceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MedicalResource'
        },
        notes: String,
        location: {
            lat: Number,
            lng: Number
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    dispatchedAt: {
        type: Date,
    },
    arrivedAt: {
        type: Date,
    },
    resolvedAt: {
        type: Date,
    },
    totalResponseTime: {
        type: Number, // in seconds
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Incident', incidentSchema);
