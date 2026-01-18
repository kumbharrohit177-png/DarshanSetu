const mongoose = require('mongoose');
const User = require('./models/User');
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

const resetAdminPassword = async () => {
    await connectDB();

    try {
        const email = 'admin@example.com';
        const newPassword = 'admin123';

        let user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}`);
            // Mongoose pre-save hook will hash this
            user.password = newPassword;
            await user.save();
            console.log(`Password for ${email} has been reset to: ${newPassword}`);
        } else {
            console.log(`User ${email} not found!`);
        }

        // Clean up test users
        const deleteResult = await User.deleteMany({ email: { $regex: 'test.*@test.com' } });
        console.log(`Cleaned up ${deleteResult.deletedCount} test users.`);

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        mongoose.disconnect();
    }
};

resetAdminPassword();
