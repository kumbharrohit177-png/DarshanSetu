require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing users
        await User.deleteMany({});
        console.log('Users cleared');

        // Note: No manual hashing here. User model pre-save hook handles it.
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'secret_admin_code', // Plain text, will be hashed by hook
            role: 'admin',
            phone: '9999999999',
            age: 35
        });

        await adminUser.save();
        console.log('Admin user created: admin@example.com / secret_admin_code');

        process.exit();
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
