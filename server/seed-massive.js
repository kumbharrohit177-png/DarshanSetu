const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MedicalResource = require('./models/MedicalResource');

dotenv.config();

const seedMassive = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Massive Seeding...');

        // 1. Reset ALL existing resources to available
        console.log('Resetting existing resources to AVAILABLE...');
        await MedicalResource.updateMany(
            {},
            {
                status: 'available',
                assignedIncident: null,
                currentRoute: null
            }
        );

        // 2. Generate 50 New Resources
        const baseLat = 18.12;
        const baseLng = 73.12;
        const zones = ["North Gate", "South Parking", "VIP Entry", "Main Hall", "River Bank", "Market Street", "Bus Stand"];

        const newResources = [];

        for (let i = 1; i <= 50; i++) {
            const type = i % 5 === 0 ? 'medical_booth' : (i % 3 === 0 ? 'first_aid_team' : 'ambulance');
            const zone = zones[Math.floor(Math.random() * zones.length)];

            // Random offset within ~2km
            const latOffset = (Math.random() - 0.5) * 0.02;
            const lngOffset = (Math.random() - 0.5) * 0.02;

            newResources.push({
                name: `Reinforcement Unit ${i}`,
                type: type,
                status: 'available',
                location: {
                    lat: baseLat + latOffset,
                    lng: baseLng + lngOffset,
                    zone: zone
                },
                contactNumber: `RESERVE-${100 + i}`
            });
        }

        console.log(`Injecting ${newResources.length} reinforcement units...`);
        await MedicalResource.insertMany(newResources);

        console.log('✅ MASSIVE SEED COMPLETE: 50+ New Units Added.');
        console.log('All previous units reset to AVAILABLE.');

        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedMassive();
