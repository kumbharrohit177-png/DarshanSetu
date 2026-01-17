const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Temple = require('./models/Temple');
const Slot = require('./models/Slot');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple-crowd-management')
    .then(async () => {
        console.log('MongoDB Connected');

        const templeCount = await Temple.countDocuments();
        console.log(`Temples count: ${templeCount}`);

        const slotCount = await Slot.countDocuments();
        console.log(`Slots count: ${slotCount}`);

        if (templeCount > 0 && slotCount > 0) {
            console.log('Seeding seems successful.');
            const slots = await Slot.find().populate('temple').limit(1);
            console.log('Sample slot:', slots[0]);
        } else {
            console.log('Seeding might have failed.');
        }

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
