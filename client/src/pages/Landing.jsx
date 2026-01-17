import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Shield, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';
import TempleSearch from '../components/TempleSearch';

const Landing = () => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    const backgroundImages = [
        "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop", // Taj/Architecture style
        "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?q=80&w=1974&auto=format&fit=crop", // Golden Temple
        "https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=2070&auto=format&fit=crop", // South Indian Temple
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2080&auto=format&fit=crop", // Kedarnath/Mountain style
        "https://images.unsplash.com/photo-1621692120466-993d0d85ee63?q=80&w=2070&auto=format&fit=crop"  // Another temple
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-white overflow-hidden selection:bg-primary-100 selection:text-primary-700">
            {/* Hero Section */}
            <div className="relative z-20 pt-14 lg:pt-20">
                {/* Background Carousel */}
                <div className="absolute inset-0 -z-20 overflow-hidden">
                    {backgroundImages.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
                            transition={{ duration: 1.5 }}
                            className="absolute inset-0"
                        >
                            <img
                                src={img}
                                alt="Temple Background"
                                className="w-full h-full object-cover"
                            />
                            {/* Light Overlay for text readability (reduced opacity) */}
                            <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
                        </motion.div>
                    ))}
                </div>

                {/* Decorative Blobs (Optional - keeping low opacity for style) */}
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
                            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 bg-white/50 backdrop-blur-sm">
                                Announcing our new mobile app coming soon <a href="#" className="font-semibold text-primary-600"><span className="absolute inset-0" aria-hidden="true" />Read more <span aria-hidden="true">&rarr;</span></a>
                            </div>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="text-4xl font-black tracking-tight text-gray-900 sm:text-7xl mb-6 leading-tight">
                            Spiritual Journeys, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">Reimagined.</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto font-medium">
                            Experience the divine without the chaos. Our AI-powered crowd management system ensures your pilgrimage is safe, seamless, and spiritually fulfilling.
                        </motion.p>

                        <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/register" className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-primary-600 rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 hover:shadow-lg hover:-translate-y-1">
                                Start Your Journey
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors">
                                Member Login <span aria-hidden="true">→</span>
                            </Link>
                        </motion.div>

                        {/* Search Section */}
                        <motion.div variants={itemVariants} className="mt-12 w-full">
                            <TempleSearch />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Decorative Bottom Shape */}
                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
                </div>
            </div>

            {/* Stats Section with Glass Effect */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 relative z-10"
            >
                <div className="grid grid-cols-1 gap-8 text-center lg:grid-cols-3">
                    {[
                        { label: 'Daily Pilgrims', value: '50,000+' },
                        { label: 'Average Wait Time', value: '< 15 mins' },
                        { label: 'Safety Incidents', value: 'Zero' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 ring-1 ring-gray-900/5"
                        >
                            <dt className="text-sm font-semibold leading-6 text-gray-500 uppercase tracking-wider">{stat.label}</dt>
                            <dd className="order-first text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-2">{stat.value}</dd>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Bento Grid Features Section */}
            <div id="about" className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <h2 className="text-base font-semibold leading-7 text-primary-600">Why TempleFlow?</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need for a peaceful Darshan</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-3xl p-8 shadow-lg ring-1 ring-gray-900/5 md:col-span-2 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-64 h-64 bg-primary-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6 text-primary-600">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Scheduling System</h3>
                                <p className="text-gray-600 leading-relaxed max-w-md">Our advanced algorithm distributes crowd flow evenly throughout the day. Book your specific time slot and walk in without the wait. No more standing in lines for hours.</p>

                                <div className="mt-8 flex gap-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Instant Confirmation
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> QR Code Entry
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gray-900 rounded-3xl p-8 shadow-lg ring-1 ring-gray-900/5 md:col-span-1 text-white relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-gray-900"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-white backdrop-blur-sm">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
                                <p className="text-gray-300 leading-relaxed text-sm">Monitor crowd density in real-time. Our heatmaps help authorities manage flow effectively.</p>
                            </div>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-3xl p-8 shadow-lg ring-1 ring-gray-900/5 md:col-span-1 relative overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6 text-red-600">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Emergency Ready</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">Instant SOS alerts connect directly to on-ground security and medical teams.</p>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gradient-to-br from-primary-600 to-indigo-600 rounded-3xl p-8 shadow-lg ring-1 ring-gray-900/5 md:col-span-2 relative overflow-hidden text-white"
                        >
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Join 100+ Temples</h3>
                                    <p className="text-primary-100">Trusted by the largest pilgrimage sites in the country.</p>
                                </div>
                                <Link to="/register" className="px-6 py-3 bg-white text-primary-600 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
                                    Get Started Now
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 flex justify-center text-gray-500 text-sm">
                    © 2024 TempleFlow. All rights reserved. Made for Hackathon.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
