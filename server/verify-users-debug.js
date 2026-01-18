const mongoose = require('mongoose');
const User = require('./models/User');
const fs = require('fs');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const verifyUsers = async () => {
    await connectDB();

    try {
        const users = await User.find({});
        let output = `Found ${users.length} users:\n`;
        users.forEach(user => {
            output += `- Name: ${user.name}, Email: ${user.email}, Role: ${user.role}\n`;
        });
        fs.writeFileSync('users-list.txt', output);
        console.log('User list written to users-list.txt');
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        mongoose.disconnect();
    }
};

verifyUsers();
