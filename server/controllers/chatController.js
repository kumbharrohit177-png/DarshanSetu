const knowledgeBase = {
    greetings: {
        keywords: ['hi', 'hello', 'namaste', 'hey', 'start', 'greet'],
        responses: [
            "Namaste! I am Nandi, your spiritual guide. How can I assist you with your pilgrimage today? 🙏",
            "Hari Om! I am Nandi. Ask me about temples, darshan bookings, or emergency services.",
            "Namaste devotee. I am here to guide you through DarshanSetu. What would you like to know?"
        ]
    },
    temples: {
        kashi: {
            keywords: ['kashi', 'vishwanath', 'varanasi', 'banaras'],
            response: "The Kashi Vishwanath Temple in Varanasi is dedicated to Lord Shiva. It is one of the 12 Jyotirlingas. \n\n📍 Location: Varanasi, Uttar Pradesh\n🕉️ Deity: Lord Shiva\n🕒 Open: 3:00 AM - 11:00 PM\n\nTip: Book a slot early for the Mangala Aarti!"
        },
        tirupati: {
            keywords: ['tirupati', 'balaji', 'venkateswara', 'tirumala'],
            response: "Tirupati Balaji (Tirumala) is one of the richest and most visited temples in the world.\n\n📍 Location: Tirumala, Andhra Pradesh\n🕉️ Deity: Lord Venkateswara\n🕒 Open: 2:30 AM - 1:30 AM (Next Day)\n\nTip: Use our 'Book Tickets' feature to skip the long queue."
        },
        siddhivinayak: {
            keywords: ['siddhivinayak', 'ganpati', 'mumbai', 'vinayak'],
            response: "Shree Siddhivinayak Ganapati Temple is a prominent Ganesh temple in Mumbai.\n\n📍 Location: Prabhadevi, Mumbai\n🕉️ Deity: Lord Ganesha\n🕒 Open: 5:30 AM - 10:00 PM\n\nFact: The idol is 'Swayambhu' (self-manifested)."
        },
        somnath: {
            keywords: ['somnath', 'gujarat', 'first jyotirlinga'],
            response: "Somnath Temple is traditionally the first among the 12 Jyotirlinga shrines of Shiva.\n\n📍 Location: Veraval, Gujarat\n🕉️ Deity: Lord Shiva\n🕒 Open: 6:00 AM - 10:00 PM\n\nDon't miss the Light and Sound show at 8 PM!"
        },
        jagannath: {
            keywords: ['jagannath', 'puri', 'rath yatra', 'odisha'],
            response: "Jagannath Temple is famous for its annual Rath Yatra.\n\n📍 Location: Puri, Odisha\n🕉️ Deity: Lord Jagannath, Balabhadra, Subhadra\n🕒 Open: 5:00 AM - 10:00 PM\n\nPrasad: The Mahaprasad here is cooked in earthen pots."
        }
    },
    website: {
        booking: {
            keywords: ['book', 'ticket', 'slot', 'darshan', 'reserve'],
            response: "To book a Darshan slot:\n1. Login as a Pilgrim.\n2. Go to your Dashboard.\n3. Click 'Book Darshan' on your desired temple.\n4. Select a date and time slot.\n\nNeed help logging in?"
        },
        police: {
            keywords: ['police', 'security', 'safety', 'theft', 'crime'],
            response: "For security concerns:\n- Use the SOS button on your dashboard for immediate help.\n- Police officers monitor the crowd real-time via the Police Panel.\n- Report lost items at the nearest assistance booth."
        },
        medical: {
            keywords: ['medical', 'health', 'doctor', 'ambulance', 'emergency', 'hurt'],
            response: "For medical emergencies:\n- Press the SOS button -> Select 'Medical Emergency'.\n- An ambulance or bike medic will be dispatched to your geolocation immediately.\n- We have 50+ active medical units on standby."
        },
        login: {
            keywords: ['login', 'register', 'signup', 'account'],
            response: "You can login or register from the home page. \n- Pilgrims need a mobile number.\n- Officials (Police/Medical) need a secure code to register.\n\nAre you a devotee or an official?"
        }
    },
    fallback: [
        "I am learning more every day. Could you please rephrase that?",
        "I didn't quite catch that. Ask me about 'Temples', 'Bookings', or 'Safety'.",
        "My knowledge is limited to Indian Temples and this website. Can I help you with those?",
        "Apologies, I didn't understand. Try asking: 'Tell me about Kashi' or 'How to book?'"
    ]
};

exports.processMessage = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ reply: "Please say something!" });
        }

        const lowerMsg = message.toLowerCase();
        let reply = null;

        // 1. Check Greetings
        if (knowledgeBase.greetings.keywords.some(k => lowerMsg.includes(k))) {
            reply = knowledgeBase.greetings.responses[Math.floor(Math.random() * knowledgeBase.greetings.responses.length)];
        }

        // 2. Check Temples
        if (!reply) {
            for (const key in knowledgeBase.temples) {
                if (knowledgeBase.temples[key].keywords.some(k => lowerMsg.includes(k))) {
                    reply = knowledgeBase.temples[key].response;
                    break;
                }
            }
        }

        // 3. Check Website Help
        if (!reply) {
            for (const key in knowledgeBase.website) {
                if (knowledgeBase.website[key].keywords.some(k => lowerMsg.includes(k))) {
                    reply = knowledgeBase.website[key].response;
                    break;
                }
            }
        }

        // 4. Fallback
        if (!reply) {
            reply = knowledgeBase.fallback[Math.floor(Math.random() * knowledgeBase.fallback.length)];
        }

        // Simulate "typing" delay for realism (optional, but nice)
        // setTimeout(() => res.json({ reply }), 500); 
        // For production speed, we just return.

        res.json({ reply });

    } catch (error) {
        console.error("ChatBot Error:", error);
        res.status(500).json({ reply: "I am meditating. Please try again later. 🧘" });
    }
};
