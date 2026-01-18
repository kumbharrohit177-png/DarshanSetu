const mongoose = require('mongoose');

const templeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
        default: 'https://images.unsplash.com/photo-1561361513-35e679c58071?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' // Default temple image
    },
    openingHours: {
        type: String, // e.g., "06:00 - 22:00"
        default: "06:00 - 22:00"
    },
    deity: {
        type: String, // e.g., "Lord Shiva"
        default: "Main Deity"
    },
    architecture: {
        type: String, // e.g., "Dravidian"
        default: "Ancient"
    },
    festivals: {
        type: [String], // e.g., ["Maha Shivratri", "Kartik Purnima"]
        default: []
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Temple', templeSchema);
