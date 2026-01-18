const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Temple = require('./models/Temple');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple-crowd-management')
    .then(async () => {
        console.log('Connected to DB');
        const temples = await Temple.find({});
        console.log(`Found ${temples.length} temples.`);
        temples.forEach(t => {
            console.log(`- ${t.name}: ${t.openingHours} | ${t.deity} | ${t.festivals ? t.festivals.length : 0} festivals`);
        });
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
