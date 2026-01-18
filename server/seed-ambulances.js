const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MedicalResource = require('./models/MedicalResource');

dotenv.config();

const seedResources = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Base location for "Temple" (approx center from LiveMedicalMap)
        const baseLat = 18.12;
        const baseLng = 73.12;

        const newResources = [
            {
                name: "Ambulance Rapid-1",
                type: "ambulance",
                status: "available",
                location: { lat: baseLat + 0.001, lng: baseLng + 0.001, zone: "North Gate" },
                contactNumber: "108-001"
            },
            {
                name: "Ambulance Rapid-2",
                type: "ambulance",
                status: "available",
                location: { lat: baseLat - 0.001, lng: baseLng - 0.001, zone: "South Parking" },
                contactNumber: "108-002"
            },
            {
                name: "Ambulance ICU-Alpha",
                type: "ambulance",
                status: "available",
                location: { lat: baseLat + 0.002, lng: baseLng - 0.001, zone: "VIP Entry" },
                contactNumber: "108-003"
            },
            {
                name: "Bike Medic Unit 1",
                type: "first_aid_team",
                status: "available",
                location: { lat: baseLat + 0.0005, lng: baseLng + 0.002, zone: "Queue Complex A" },
                contactNumber: "Internal-101"
            },
            {
                name: "Bike Medic Unit 2",
                type: "first_aid_team",
                status: "available",
                location: { lat: baseLat - 0.0005, lng: baseLng - 0.002, zone: "Queue Complex B" },
                contactNumber: "Internal-102"
            },
            {
                name: "Ambulance Reserve-1",
                type: "ambulance",
                status: "available",
                location: { lat: baseLat + 0.003, lng: baseLng + 0.003, zone: "Main Road Junction" },
                contactNumber: "108-004"
            },
            {
                name: "Volunteer Med Team",
                type: "first_aid_team",
                status: "available",
                location: { lat: baseLat, lng: baseLng, zone: "Sanctum Outer Ring" },
                contactNumber: "Internal-VOL"
            }
        ];

        console.log(`Adding ${newResources.length} new medical resources...`);

        await MedicalResource.insertMany(newResources);

        console.log('✅ Successfully seeded medical resources!');
        console.log('You can now dispatch these units from the dashboard.');

        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedResources();
