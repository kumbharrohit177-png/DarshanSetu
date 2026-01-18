const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MedicalResource = require('./models/MedicalResource');

dotenv.config();

const verifyResources = async () => {
    try {
        console.log('Connecting to MongoDB Endpoint:', process.env.MONGO_URI.substring(0, 20) + '...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected.');

        const resources = await MedicalResource.find({});
        console.log(`\nFound ${resources.length} Total Resources.`);

        const available = resources.filter(r => r.status === 'available');
        console.log(`Found ${available.length} AVAILABLE Resources:`);

        available.forEach(r => {
            console.log(`- [${r.type}] ${r.name} | Status: ${r.status} | Zone: ${r.location?.zone}`);
        });

        if (available.length === 0) {
            console.log("❌ CRITICAL: No available resources found! The API will return empty list.");
        }

        process.exit();
    } catch (error) {
        console.error('Verification Error:', error);
        process.exit(1);
    }
};

verifyResources();
