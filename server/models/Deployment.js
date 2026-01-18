const mongoose = require('mongoose');

const deploymentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['police', 'barricade', 'medical', 'volunteer'],
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active',
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Deployment', deploymentSchema);
