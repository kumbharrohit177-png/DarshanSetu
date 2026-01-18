const mongoose = require('mongoose');

const medicalResourceSchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "Ambulance 01", "Team Alpha"
        required: true,
    },
    type: {
        type: String,
        enum: ['ambulance', 'medical_booth', 'first_aid_team'],
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'busy', 'maintenance', 'en_route'],
        default: 'available',
    },
    location: {
        lat: Number,
        lng: Number,
        zone: String, // e.g. "North Gate", "Sanctum"
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    contactNumber: {
        type: String,
        required: true,
    },
    assignedIncident: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Incident',
        default: null
    },
    currentRoute: {
        destination: {
            lat: Number,
            lng: Number
        },
        estimatedArrival: Date,
        routePoints: [{
            lat: Number,
            lng: Number
        }]
    },
    responseHistory: [{
        incidentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Incident'
        },
        dispatchedAt: Date,
        arrivedAt: Date,
        completedAt: Date,
        responseTime: Number, // in seconds
        distance: Number // in meters
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MedicalResource', medicalResourceSchema);
