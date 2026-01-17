const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['booked', 'checked-in', 'cancelled', 'completed'],
        default: 'booked',
    },
    qrCode: {
        type: String,
        // Store QR code data or URL
    },
    members: [{
        name: String,
        age: Number,
        gender: String,
    }]
});

module.exports = mongoose.model('Booking', bookingSchema);
