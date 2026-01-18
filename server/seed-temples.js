const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Temple = require('./models/Temple');
const Slot = require('./models/Slot');

dotenv.config();

const temples = [
    // North India
    {
        name: "Kashi Vishwanath",
        location: "Varanasi, UP",
        description: "Stand on the western bank of the holy river Ganga, this is one of the twelve Jyotirlingas, the holiest of Shiva temples. The main deity is known by the name Vishwanath or Vishveshvara meaning Ruler of the Universe. Varanasi is also called Kashi, and hence the temple is popularly called Kashi Vishwanath Temple. A visit here is believed to liberate the soul from the cycle of life and death.",
        imageUrl: "/temples/kashi.jpeg",
        deity: "Lord Shiva",
        architecture: "Nagara Style",
        festivals: ["Maha Shivratri", "Dev Deepawali", "Shravan Maas"],
        openingHours: "03:00 - 23:00"
    },
    {
        name: "Vaishno Devi",
        location: "Katra, J&K",
        description: "The holy cave shrine of Mata Vaishno Devi is nestled in the Trikuta Mountains. It is a manifestation of the Hindu Mother Goddess, Adi Shakti. Pilgrims trek about 12 km from the base camp at Katra to reach the Bhavan. The journey is a test of faith and endurance, rewarded with the divine darshan of the three Pindis in the cave.",
        imageUrl: "/temples/vaishno.jpeg",
        deity: "Mata Vaishno Devi",
        architecture: "Cave Shrine",
        festivals: ["Navratri", "Deepawali"],
        openingHours: "05:00 - 22:00"
    },
    {
        name: "Golden Temple",
        location: "Amritsar, Punjab",
        description: "Also known as Sri Harmandir Sahib, the Golden Temple is the holiest Gurdwara of Sikhism. It stands as a symbol of human brotherhood and equality. The temple is built around a man-made pool (sarovar) that was completed by the fourth Sikh Guru, Guru Ram Das in 1577. The stunning gold-plated structure and the community kitchen (Langar) serving thousands daily are its hallmarks.",
        imageUrl: "/temples/golden.jpeg",
        deity: "Guru Granth Sahib",
        architecture: "Sikh Architecture",
        festivals: ["Guru Nanak Jayanti", "Baisakhi", "Diwali"],
        openingHours: "00:00 - 24:00"
    },
    {
        name: "Amarnath Cave",
        location: "Anantnag, J&K",
        description: "Situated at an altitude of 3,888 m, Amarnath is considered one of the holiest shrines in Hinduism. The main attraction is the natural ice Lingam of Lord Shiva that forms annually. The pilgrimage (Yatra) takes place during the summer months when the cave is accessible. It is believed that Lord Shiva explained the secret of life and eternity to Goddess Parvati here.",
        imageUrl: "/temples/amarnath.jpeg",
        deity: "Lord Shiva (Ice Lingam)",
        architecture: "Natural Cave",
        festivals: ["Amarnath Yatra", "Shravan Purnima"],
        openingHours: "06:00 - 18:00"
    },
    {
        name: "Kedarnath Temple",
        location: "Kedarnath, Uttarakhand",
        description: "Located near the Mandakini river in the Himalayas, Kedarnath is one of the Char Dhams and the twelve Jyotirlingas. Due to extreme weather conditions, the temple is open only between April (Akshaya Tritiya) and November (Kartik Purnima). The temple structure is believed to have been constructed by Adi Shankaracharya in the 8th century.",
        imageUrl: "/temples/kedarnath.jpeg",
        deity: "Lord Shiva",
        architecture: "North Indian Temple",
        festivals: ["Maha Shivratri", "Annakoot"],
        openingHours: "04:00 - 21:00"
    },
    {
        name: "Badrinath Temple",
        location: "Badrinath, Uttarakhand",
        description: "Dedicated to Lord Vishnu, Badrinath is one of the crucial stops in the Char Dham pilgrimage. The temple is situated in the Garhwal hill tracks in Chamoli district along the banks of the Alaknanda River. The image of the presiding deity worshipped in the temple is a 1 m tall, black stone statue of Vishnu in the form of Badrinarayan.",
        imageUrl: "/temples/badrinath.jpeg",
        deity: "Lord Vishnu (Badri Vishal)",
        architecture: "Garhwali Style",
        festivals: ["Mata Murti Ka Mela", "Badri-Kedar Festival"],
        openingHours: "04:30 - 21:00"
    },
    {
        name: "Akshardham",
        location: "New Delhi",
        description: "Swaminarayan Akshardham reflects the essence of India's ancient architecture, traditions, and timeless spiritual messages. The complex features an Abhishekh Mandap, Sahaj Anand water show, and a thematic garden. It is a modern marvel that pays tribute to Bhagwan Swaminarayan and the avatars, devas, and sages of Indian history.",
        imageUrl: "/temples/akshardham.jpeg",
        deity: "Swaminarayan",
        architecture: "Modern Hindu",
        festivals: ["Diwali", "Annakut"],
        openingHours: "09:30 - 20:00"
    },

    // South India
    {
        name: "Tirumala Tirupati",
        location: "Tirumala, AP",
        description: "The Tirumala Venkateswara Temple is a landmark Vaishnavite temple situated in the hill town of Tirumala. It is dedicated to Lord Venkateswara, an incarnation of Vishnu, who is liable to have appeared here to save mankind from trials and troubles of Kali Yuga. It is the richest temple in the world in terms of donations received and wealth.",
        imageUrl: "/temples/tirupati.jpeg",
        deity: "Lord Venkateswara",
        architecture: "Dravidian Style",
        festivals: ["Brahmotsavam", "Vaikunta Ekadasi"],
        openingHours: "02:30 - 01:30"
    },
    {
        name: "Meenakshi Temple",
        location: "Madurai, TN",
        description: "A historic Hindu temple located on the southern bank of the Vaigai River in the temple city of Madurai. It is dedicated to Thirukamakottam Udaya AALUDAYA NACHIYAR (Meenakshi), a form of Parvati, and her consort, Sundareshwar, a form of Shiva. The temple is renowned for its towering gopurams (gateways) filled with thousands of colorful sculptures.",
        imageUrl: "/temples/meenakshi.jpeg",
        deity: "Goddess Meenakshi & Lord Sundareshwar",
        architecture: "Dravidian Style",
        festivals: ["Chithirai Festival", "Navratri"],
        openingHours: "05:00 - 22:00"
    },
    {
        name: "Ramanathaswamy",
        location: "Rameswaram, TN",
        description: "Located on Rameswaram island, this temple is dedicated to the god Shiva. It is one of the twelve Jyotirlinga temples. According to the Ramayana, Rama prayed to Shiva here to absolve any sins committed during his war against the demon-king Ravana. The temple has the longest corridor among all Hindu temples in India.",
        imageUrl: "/temples/rameshwaram.jpeg",
        deity: "Lord Shiva",
        architecture: "Dravidian Style",
        festivals: ["Maha Shivratri", "Thirukalyanam"],
        openingHours: "04:30 - 21:00"
    },
    {
        name: "Padmanabhaswamy",
        location: "Thiruvananthapuram, Kerala",
        description: "The Sree Padmanabhaswamy Temple is dedicated to Lord Vishnu. The principal deity Vishnu is enshrined in the 'Anantha Shayanam' posture, the eternal yogic sleep on the serpent Adisheshan. Use of the temple is restricted to those who practice Hinduism. It is widely considered as the wealthiest place of worship in the world.",
        imageUrl: "/temples/padmanabhaswamy.jpeg",
        deity: "Lord Vishnu (Padmanabhaswamy)",
        architecture: "Kerala & Dravidian",
        festivals: ["Alpashy Festival", "Painkuni Festival"],
        openingHours: "03:30 - 19:30"
    },
    {
        name: "Sabarimala",
        location: "Pathanamthitta, Kerala",
        description: "Sabarimala is a temple complex located at Sabarimala inside the Periyar Tiger Reserve. It is the site of one of the largest annual pilgrimages in the world. The temple is dedicated to the Hindu celibate deity Ayyappan, also known as Dharma Sastha. The pilgrimage is noted for its arduous nature and the strict 41-day vow of abstinence (Vratam).",
        imageUrl: "/temples/sabarimala.jpeg",
        deity: "Lord Ayyappa",
        architecture: "Kerala Style",
        festivals: ["Mandalapooja", "Makaravilakku"],
        openingHours: "04:00 - 22:00"
    },
    {
        name: "Brihadeeswarar",
        location: "Thanjavur, TN",
        description: "Built by Raja Raja Chola I between 1003 and 1010 AD, the temple is a part of the UNESCO World Heritage Site known as the 'Great Living Chola Temples'. It is one of the largest South Indian temples and an exemplary example of fully realized Dravidian architecture. The main vimana (tower) is a massive, pyramidal structure.",
        imageUrl: "/temples/brihadeeswarar.jpeg",
        deity: "Lord Shiva",
        architecture: "Chola / Dravidian",
        festivals: ["Maha Shivratri", "Aipassi Pournami"],
        openingHours: "06:00 - 20:30"
    },

    // East India
    {
        name: "Jagannath Temple",
        location: "Puri, Odisha",
        description: "The Jagannath Temple is an important Hindu temple dedicated to Jagannath, a form of Sri Krishna. The temple is famous for its annual Ratha Yatra, or chariot festival, in which the three principal deities are pulled on huge and elaborately decorated temple cars. The temple is one of the Char Dham pilgrimage sites.",
        imageUrl: "/temples/jagannath.jpeg",
        deity: "Lord Jagannath",
        architecture: "Kalinga Architecture",
        festivals: ["Ratha Yatra", "Snana Yatra"],
        openingHours: "05:00 - 23:00"
    },
    {
        name: "Konark Sun Temple",
        location: "Konark, Odisha",
        description: "A 13th-century CE Sun Temple at Konark on the coastline of Odisha. The temple is attributed to king Narasimhadeva I of the Eastern Ganga dynasty about 1250 CE. Dedicated to the Hindu Sun God Surya, what remains of the temple complex has the appearance of a 100-foot high chariot with immense wheels and horses, all carved from stone.",
        imageUrl: "/temples/konark.jpeg",
        deity: "Sun God (Surya)",
        architecture: "Kalinga Architecture",
        festivals: ["Konark Dance Festival", "Magha Saptami"],
        openingHours: "06:00 - 20:00"
    },
    {
        name: "Kamakhya Temple",
        location: "Guwahati, Assam",
        description: "The Kamakhya Temple is a Sakta temple dedicated to the mother goddess Kamakhya. It is one of the oldest of the 51 Shakti Pithas. Situated on the Nilachal Hill in western part of Guwahati city, it is the main temple in a complex of individual temples dedicated to the ten Mahavidyas of Saktism.",
        imageUrl: "/temples/kamakhya.jpeg",
        deity: "Goddess Kamakhya",
        architecture: "Nilachal Type",
        festivals: ["Ambubachi Mela", "Durga Puja"],
        openingHours: "05:30 - 21:30"
    },
    {
        name: "Dakshineswar Kali",
        location: "Kolkata, WB",
        description: "Dakshineswar Kali Temple is a Hindu navaratna temple located at Dakshineswar. Presiding deity of the temple is Bhavatarini, an aspect of Kali, meaning, 'She who liberates her devotees from the ocean of existence'. The temple was built in 1855 by Rani Rashmoni, a philanthropist and a devotee of Kali.",
        imageUrl: "/temples/dakshineswar.jpeg",
        deity: "Goddess Kali",
        architecture: "Navaratna Style",
        festivals: ["Kali Puja", "Snana Yatra"],
        openingHours: "06:00 - 21:00"
    },

    // West India
    {
        name: "Somnath Temple",
        location: "Veraval, Gujarat",
        description: "The Somnath temple located in Prabhas Patan near Veraval in Saurashtra on the western coast of Gujarat, is believed to be the first among the twelve Jyotirlinga shrines of Shiva. It is an important pilgrimage and tourist spot. The temple is known as 'The Shrine Eternal' having been destroyed 17 times and rebuilt each time.",
        imageUrl: "/temples/somnath.jpeg",
        deity: "Lord Shiva",
        architecture: "Chaulukya Style",
        festivals: ["Maha Shivratri", "Kartik Purnima"],
        openingHours: "06:00 - 21:30"
    },
    {
        name: "Dwarkadhish Temple",
        location: "Dwarka, Gujarat",
        description: "The Dwarkadhish temple, also known as the Jagat Mandir and occasionally spelled Dwarakadheesh, is a Hindu temple dedicated to the god Krishna, who is worshipped here by the name Dwarkadhish, or 'King of Dwarka'. The main shrine of the five-storied building, supported by 72 pillars, is known as Jagat Mandir or Nija Mandir.",
        imageUrl: "/temples/dwarka.jpeg",
        deity: "Lord Krishna",
        architecture: "Chaulukya Style",
        festivals: ["Janmashtami", "Holi"],
        openingHours: "06:30 - 21:30"
    },
    {
        name: "Siddhivinayak",
        location: "Mumbai, Maharashtra",
        description: "The Shree Siddhivinayak Ganapati Mandir is a Hindu temple dedicated to Lord Shri Ganesh. It is located in Prabhadevi, Mumbai. It was originally built by Laxman Vithu and Deubai Patil in 1801. It is one of the richest temples in India. The inner roof of the sanctum is plated with gold, and the wooden doors are carved with images of the Ashtavinayak.",
        imageUrl: "/temples/siddhivinayak.jpeg",
        deity: "Lord Ganesha",
        architecture: "Modern Hindu",
        festivals: ["Ganesh Chaturthi", "Sankashti Chaturthi"],
        openingHours: "05:30 - 22:00"
    },
    {
        name: "Shirdi Sai Baba",
        location: "Shirdi, Maharashtra",
        description: "Shirdi is famous as the home of the late 19th century saint Sri Sai Baba. The Sri Saibaba Sansthan Trust located in Shirdi is one of the richest temple organisations. Sai Baba taught a moral code of love, forgiveness, helping others, charity, contentment, inner peace, and devotion to God and guru. His teachings combined elements of Hinduism and Islam.",
        imageUrl: "/temples/shirdi.jpeg",
        deity: "Sai Baba",
        architecture: "Modern",
        festivals: ["Ram Navami", "Guru Purnima", "Vijayadashami"],
        openingHours: "04:00 - 22:30"
    },
    {
        name: "Mahakaleshwar",
        location: "Ujjain, MP",
        description: "Mahakaleshwar Jyotirlinga is a Hindu temple dedicated to Lord Shiva and is one of the twelve Jyotirlingams, shrines which are said to be the most sacred abodes of Lord Shiva. It is located in the ancient city of Ujjain. The idol of Mahakaleshwar is known to be dakshinamukhi, which means that it is facing the south.",
        imageUrl: "/temples/mahakaleshwar.jpeg",
        deity: "Lord Shiva",
        architecture: "Maratha / Chalukya",
        festivals: ["Maha Shivratri", "Kumbh Mela"],
        openingHours: "03:00 - 23:00"
    }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/temple-crowd-management')
    .then(async () => {
        console.log('MongoDB Connected');

        // Clear existing data
        try {
            await mongoose.connection.db.dropCollection('temples');
            console.log('Dropped temples collection');
        } catch (e) { console.log('Temples collection not found, skipping drop'); }

        try {
            await mongoose.connection.db.dropCollection('slots');
            console.log('Dropped slots collection');
        } catch (e) { console.log('Slots collection not found, skipping drop'); }

        // Create Temples - now using the loop to ensure Mongoose validation if needed, or just insertMany
        const createdTemples = await Temple.insertMany(temples);
        console.log(`Seeded ${createdTemples.length} temples`);

        // Create Slots for each temple for next 7 days
        const slots = [];
        const times = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
        const today = new Date();

        for (const temple of createdTemples) {
            // Parse opening hours (e.g., "06:00 - 20:00")
            let [startStr, endStr] = temple.openingHours.split(' - ');
            let [startH, startM] = startStr.split(':').map(Number);
            let [endH, endM] = endStr.split(':').map(Number);

            // Adjust for minutes (conservative approach)
            if (startM > 0) startH++; // Start next hour if not exactly on hour
            // If endM > 0, we can keep endH as is (e.g. 20:30 closes, so 19:00-20:00 is last full slot)
            // If endM == 0, endH is the boundary.

            // Handle midnight crossing (e.g. 02:30 - 01:30)
            let effectiveEndH = endH;
            if (effectiveEndH <= startH) {
                effectiveEndH += 24;
            }

            // Correction for 24:00 (Golden Temple)
            if (endStr === "24:00") effectiveEndH = 24;

            const templeTimes = [];
            for (let h = startH; h < effectiveEndH; h++) {
                const slotStartH = h % 24;
                const timeString = `${slotStartH.toString().padStart(2, '0')}:00`;
                templeTimes.push(timeString);
            }

            // Generate slots for next 7 days
            for (let i = 0; i < 7; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);

                for (const time of templeTimes) {
                    // Calculate end time (1 hour duration)
                    const [hours, minutes] = time.split(':').map(Number);
                    const endHours = (hours + 1) % 24;
                    const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

                    slots.push({
                        date: date,
                        startTime: time,
                        endTime: endTime,
                        capacity: Math.floor(Math.random() * (150 - 60 + 1)) + 60, // Random capacity between 60 and 150
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
        process.exit(1);
    });
