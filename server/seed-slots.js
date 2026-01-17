const mongoose = require('mongoose');
const Slot = require('./models/Slot');
require('dotenv').config();

const slotsData = [];

// Helper to create slots for a specific date
const createSlotsForDate = (date) => {
    const times = [
        { start: '06:00', end: '08:00' },
        { start: '08:00', end: '10:00' },
        { start: '10:00', end: '12:00' },
        { start: '14:00', end: '16:00' },
        { start: '16:00', end: '18:00' },
        { start: '18:00', end: '20:00' }
    ];

    times.forEach(time => {
        slotsData.push({
            date: date,
            startTime: time.start,
            endTime: time.end,
            capacity: 50,
            bookedCount: 0,
            isLocked: false,
            zone: 'Main Temple'
        });
    });
};

// Generate slots for Today and Tomorrow
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

createSlotsForDate(today);
createSlotsForDate(tomorrow);

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB...');

        try {
            // clear existing slots to avoid duplicates during dev
            await Slot.deleteMany({});
            console.log('Cleared existing slots.');

            await Slot.insertMany(slotsData);
            console.log(`✅ Successfully seeded ${slotsData.length} slots.`);
            process.exit(0);
        } catch (error) {
            console.error('❌ Error seeding slots:', error);
            process.exit(1);
        }
    })
    .catch(err => {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    });
