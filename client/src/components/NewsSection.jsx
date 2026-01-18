import React from 'react';
import { Calendar, Bell, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NewsSection = () => {
    const newsItems = [
        {
            id: 1,
            title: "Maha Shivratri Preparations Begin",
            date: "Jan 20, 2026",
            category: "Festival",
            description: "Grand preparations are underway for the upcoming Maha Shivratri. Temple will remain open 24 hours on the main day.",
            icon: Star,
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            id: 2,
            title: "New VIP Darshan Slots Added",
            date: "Jan 18, 2026",
            category: "Update",
            description: "To manage the weekend rush, we have opened 500 extra slots for special darshan. Book now to avoid queues.",
            icon: Calendar,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            id: 3,
            title: "Community Kitchen Donation Drive",
            date: "Jan 15, 2026",
            category: "Seva",
            description: "Join us in feeding 10,000 pilgrims this month. Your small contribution can fill many stomachs.",
            icon: Bell,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            id: 4,
            title: "Annual Rath Yatra 2026",
            date: "Feb 10, 2026",
            category: "Festival",
            description: "The Grand Chariot Festival dates have been announced. Creating special viewing galleries for senior citizens.",
            icon: Star,
            color: "text-red-600",
            bg: "bg-red-50"
        },
        {
            id: 5,
            title: "Volunteer for Cleanliness Drive",
            date: "Jan 25, 2026",
            category: "Volunteering",
            description: "Be a part of 'Swachh Temple Abhiyan'. We need 200 youths to help maintain the sanctity of the premises.",
            icon: Calendar,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            id: 6,
            title: "North Wing Renovation Complete",
            date: "Jan 12, 2026",
            category: "Infrastructure",
            description: "The renovation of the North Wing is complete. It now features air-conditioned waiting halls and better amenities.",
            icon: Bell,
            color: "text-amber-600",
            bg: "bg-amber-50"
        }
    ];

    return (
        <section id="news" className="py-20 relative overflow-hidden bg-white">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Temple Announcements</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
                        <p className="mt-4 text-lg text-gray-600">Latest updates from the temple trust and administration</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {newsItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-xl shadow-orange-100 border border-orange-50 overflow-hidden hover:-translate-y-2 transition-transform duration-300 group"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                                        <item.icon size={24} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                                        {item.category}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm font-medium text-gray-400">{item.date}</span>
                                    <button className="text-orange-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read More <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
