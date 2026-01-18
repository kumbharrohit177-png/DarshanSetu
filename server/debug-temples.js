const mongoose = require('mongoose');
const Temple = require('./models/Temple');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const checkTemples = async () => {
    await connectDB();
    const temples = await Temple.find({});
    console.log('--- Temples Data ---');
    temples.forEach(t => {
        console.log(`Name: ${t.name}`);
        console.log(`Image URL: ${t.imageUrl}`);
        console.log('---');
    });
    process.exit();
};

checkTemples();
