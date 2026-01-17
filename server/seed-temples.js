const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Temple = require('./models/Temple');
const Slot = require('./models/Slot');

dotenv.config();

const temples = [
    // North India
    { name: "Kashi Vishwanath", location: "Varanasi, UP", description: "One of the most famous Hindu temples dedicated to Lord Shiva.", imageUrl: "https://images.unsplash.com/photo-1561361513-35bd307d5c56?q=80&w=2070" },
    { name: "Vaishno Devi", location: "Katra, J&K", description: "A holy cave shrine dedicated to Mata Vaishno Devi.", imageUrl: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2080" },
    { name: "Golden Temple", location: "Amritsar, Punjab", description: "The holiest Gurdwara of Sikhism, also known as Harmandir Sahib.", imageUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=1974" },
    { name: "Amarnath Cave", location: "Anantnag, J&K", description: "Famous for the natural ice Lingam of Lord Shiva.", imageUrl: "https://images.unsplash.com/photo-1598890777032-bde66e6db0b2?q=80&w=2021" },
    { name: "Kedarnath Temple", location: "Kedarnath, Uttarakhand", description: "One of the Char Dhams, located in the Himalayas dedicated to Lord Shiva.", imageUrl: "https://images.unsplash.com/photo-1605649486169-342f47161f36?q=80&w=2071" },
    { name: "Badrinath Temple", location: "Badrinath, Uttarakhand", description: "Dedicated to Lord Vishnu, part of the Char Dham pilgrimage.", imageUrl: "https://images.unsplash.com/photo-1626090708682-1dd9d747b06b?q=80&w=2070" },
    { name: "Akshardham", location: "New Delhi", description: "A modern architectural marvel showcasing Indian culture and spirituality.", imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076" },

    // South India
    { name: "Tirumala Tirupati", location: "Tirumala, AP", description: "A landmark Vaishnavite temple dedicated to Lord Venkateswara.", imageUrl: "https://images.unsplash.com/photo-1621692120466-993d0d85ee63?q=80&w=2070" },
    { name: "Meenakshi Temple", location: "Madurai, TN", description: "Historic Hindu temple located on the southern bank of the Vaigai River.", imageUrl: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=2070" },
    { name: "Ramanathaswamy", location: "Rameswaram, TN", description: "One of the twelve Jyotirlinga temples dedicated to Shiva.", imageUrl: "https://images.unsplash.com/photo-1605627083439-d345f8e56279?q=80&w=2070" },
    { name: "Padmanabhaswamy", location: "Thiruvananthapuram, Kerala", description: "Richest temple in the world, dedicated to Lord Vishnu.", imageUrl: "https://images.unsplash.com/photo-1588970054363-233633d71249?q=80&w=2070" },
    { name: "Sabarimala", location: "Pathanamthitta, Kerala", description: "Hill shrine of Lord Ayyappa, famous for its strict pilgrimage austerities.", imageUrl: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=2070" },
    { name: "Brihadeeswarar", location: "Thanjavur, TN", description: "A UNESCO World Heritage Site dedicated to Lord Shiva, known for its massive dome.", imageUrl: "https://images.unsplash.com/photo-1625407001404-58586af06f0f?q=80&w=2071" },

    // East India
    { name: "Jagannath Temple", location: "Puri, Odisha", description: "Famous for its annual Ratha Yatra and dedicated to Lord Jagannath.", imageUrl: "https://images.unsplash.com/photo-1628186103606-d248bced2464?q=80&w=2070" },
    { name: "Konark Sun Temple", location: "Konark, Odisha", description: "13th-century Sun Temple, a UNESCO World Heritage Site.", imageUrl: "https://images.unsplash.com/photo-1632514102914-1e031e40620f?q=80&w=2070" },
    { name: "Kamakhya Temple", location: "Guwahati, Assam", description: "One of the oldest Shakti Peethas, dedicated to the mother goddess Kamakhya.", imageUrl: "https://images.unsplash.com/photo-1623945417855-32115167ca9f?q=80&w=2070" },
    { name: "Dakshineswar Kali", location: "Kolkata, WB", description: "Famous Hindu temple of Goddess Kali located on the bank of Hooghly River.", imageUrl: "https://images.unsplash.com/photo-1563297123-286821d3f65e?q=80&w=2070" },

    // West India
    { name: "Somnath Temple", location: "Veraval, Gujarat", description: "First among the twelve Jyotirlinga shrines of Shiva.", imageUrl: "https://images.unsplash.com/photo-1596301328905-2b04c864d4c8?q=80&w=2070" },
    { name: "Dwarkadhish Temple", location: "Dwarka, Gujarat", description: "Dedicated to Lord Krishna, who is worshipped here by the name Dwarkadhish.", imageUrl: "https://images.unsplash.com/photo-1598535198463-22872322a36d?q=80&w=2069" },
    { name: "Siddhivinayak", location: "Mumbai, Maharashtra", description: "One of the richest and most famous Ganapati temples in India.", imageUrl: "https://images.unsplash.com/photo-1605218427354-9549324ca9c2?q=80&w=2070" },
    { name: "Shirdi Sai Baba", location: "Shirdi, Maharashtra", description: "Home of the great saint Sai Baba.", imageUrl: "https://images.unsplash.com/photo-1606293926075-69a00fb03189?q=80&w=2070" },
    { name: "Mahakaleshwar", location: "Ujjain, MP", description: "One of the twelve Jyotirlingas, famous for the Bhasma Aarti.", imageUrl: "https://images.unsplash.com/photo-1574950578143-858c6fc58922?q=80&w=2070" }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple-crowd-management')
    .then(async () => {
        console.log('MongoDB Connected');

        // Clear existing data (using drop to ensure indexes are rebuilt if needed, or deleteMany)
        try {
            await mongoose.connection.db.dropCollection('temples');
            console.log('Dropped temples collection');
        } catch (e) { console.log('Temples collection not found, skipping drop'); }

        try {
            await mongoose.connection.db.dropCollection('slots');
            console.log('Dropped slots collection');
        } catch (e) { console.log('Slots collection not found, skipping drop'); }

        // Create Temples
        const createdTemples = await Temple.insertMany(temples);
        console.log(`Seeded ${createdTemples.length} temples`);

        // Create Slots for each temple for next 7 days
        const slots = [];
        const times = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
        const today = new Date();

        for (const temple of createdTemples) {
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);

                for (const time of times) {
                    // Calculate end time (1 hour duration)
                    const [hours, minutes] = time.split(':').map(Number);
                    const endHours = hours + 1;
                    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                    slots.push({
                        date: date,
                        startTime: time,
                        endTime: endTime,
                        capacity: 100, // Default capacity
                        temple: temple._id,
                        zone: 'Main Temple'
                    });
                }
            }
        }

        await Slot.insertMany(slots);
        console.log(`Seeded ${slots.length} slots`);

        process.exit();
    })
    .catch(err => {
        console.error("Seeding Failed:", err);
        if (err.writeErrors) {
            console.error("Write Errors:", err.writeErrors);
        }
        process.exit(1);
    });
