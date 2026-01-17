const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    startTime: {
        type: String, // e.g., "09:00"
        required: true,
    },
    endTime: {
        type: String, // e.g., "10:00"
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
        default: 100,
    },
    bookedCount: {
        type: Number,
        default: 0,
    },
    isLocked: {
        type: Boolean,
        default: false, // Locked if crowd density is too high
    },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple',
        required: true,
    },
    zone: {
        type: String,
        default: 'Main Temple', // For future multi-zone support
    }
});

// Compound index to ensure uniqueness of slots per temple/zone/time
slotSchema.index({ date: 1, startTime: 1, zone: 1, temple: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);
