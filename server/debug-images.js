const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Temple = require('./models/Temple');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple-crowd-management')
    .then(async () => {
        console.log('Connected to MongoDB');
        const temples = await Temple.find({}, 'name imageUrl');
        console.log('Temples found:', temples.length);
        temples.forEach(t => {
            console.log(`${t.name}: ${t.imageUrl}`);
        });
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
