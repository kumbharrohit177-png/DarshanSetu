const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');
const Slot = require('./models/Slot');
const User = require('./models/User');

dotenv.config();

const testBooking = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Find a Slot
        const slot = await Slot.findOne({ isLocked: false, capacity: { $gt: 10 } });
        if (!slot) throw new Error("No slot found");
        console.log('Found Slot:', slot._id);

        // 2. Find a User
        let user = await User.findOne({ role: 'pilgrim' });
        if (!user) {
            console.log("Creating temp user");
            user = await User.create({
                name: "Test Pilgrim",
                email: `test${Date.now()}@example.com`,
                password: "password123",
                role: "pilgrim",
                mobile: "9999999999"
            });
        }
        console.log('Found User:', user._id);

        // 3. Attempt Booking with bad data (Empty Age string)
        console.log('Attempting Booking with age="" ...');
        try {
            const booking = await Booking.create({
                user: user._id,
                slot: slot._id,
                members: [
                    { name: "Family Member 1", age: "", gender: "male" } // This should be the culprit
                ],
                specialAssistance: 'none'
            });
            console.log('✅ Booking Success (Unexpected if bug exists):', booking._id);
        } catch (err) {
            console.log('❌ Booking Failed as Expected:', err.message);
        }

        process.exit();
    } catch (error) {
        console.error('Script Error:', error);
        process.exit(1);
    }
};

testBooking();
