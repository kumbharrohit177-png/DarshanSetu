import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Shield, Activity, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import TempleSearch from '../components/TempleSearch';
import NewsSection from '../components/NewsSection';
import UserGuide from '../components/UserGuide';

const TypewriterText = ({ text, delay = 0 }) => {
    // Split text into characters
    const characters = text.split("");

    return (
        <motion.span
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: delay,
                        repeat: Infinity,
                        repeatType: "reverse", // Makes it type backwards (delete from end)
                        repeatDelay: 2
                    }
                }
            }}
        >
            {characters.map((char, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { opacity: 0, display: "none" }, // display: none to collapse space? No, just opacity
                        visible: { opacity: 1, display: "inline" }
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.span>
    );
};

const Landing = () => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    const backgroundImages = [
        "/backgrounds/bg1.png",
        "/backgrounds/bg2.png",
        "/backgrounds/bg3.png"
    ];

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    // Memoize particles to avoid impure render errors
    const particles = React.useMemo(() => {
        return [...Array(30)].map(() => {
            const colorClasses = [
                'bg-amber-400/60',
                'bg-orange-400/60',
                'bg-yellow-400/60',
                'bg-rose-400/60'
            ];
            return {
                randomX: Math.random() * 100,
                randomY: Math.random() * 100,
                randomDelay: Math.random() * 2,
                randomDuration: Math.random() * 3 + 2,
                colorClass: colorClasses[Math.floor(Math.random() * colorClasses.length)],
                size: Math.random() * 6 + 2 // Randomized size
            };
        });
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
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 overflow-hidden selection:bg-amber-200 selection:text-amber-900">
            {/* Spiritual Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Floating particles/sparkles - more vibrant */}
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full ${p.colorClass}`}
                        initial={{
                            x: `${p.randomX}%`,
                            y: `${p.randomY}%`,
                            opacity: 0
                        }}
                        animate={{
                            y: [`${p.randomY}%`, `${(p.randomY + 30) % 100}%`],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1.5, 0],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: p.randomDuration,
                            repeat: Infinity,
                            delay: p.randomDelay
                        }}
                        style={{
                            width: `${p.size}px`,
                            height: `${p.size}px`
                        }}
                    />
                ))}

                {/* Multiple Om symbols decorative pattern */}
                <motion.div
                    className="absolute top-20 right-10 text-amber-300/15 text-[200px] font-serif select-none"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    style={{ fontFamily: 'serif' }}
                >
                    ॐ
                </motion.div>
                <motion.div
                    className="absolute bottom-20 left-10 text-orange-300/15 text-[150px] font-serif select-none"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 12, repeat: Infinity }}
                    style={{ fontFamily: 'serif' }}
                >
                    ॐ
                </motion.div>
                <div className="absolute top-1/2 left-1/4 text-yellow-300/10 text-[100px] font-serif select-none" style={{ fontFamily: 'serif' }}>
                    ॐ
                </div>
                <div className="absolute top-1/3 right-1/4 text-rose-300/10 text-[120px] font-serif select-none" style={{ fontFamily: 'serif' }}>
                    🕉️
                </div>

                {/* Lotus flower patterns */}
                <div className="absolute top-40 left-1/3 text-amber-200/8 text-[80px]">🌸</div>
                <div className="absolute bottom-40 right-1/3 text-orange-200/8 text-[90px]">🌸</div>
                <div className="absolute top-1/2 right-1/5 text-yellow-200/8 text-[70px]">🌸</div>
            </div>

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
                            {/* Spiritual overlay with warm tones */}
                            <div className="absolute inset-0 bg-gradient-to-b from-amber-900/40 via-orange-800/30 to-amber-900/40"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(120,53,15,0.1)_100%)]"></div>
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


                        <motion.div variants={itemVariants} className="mb-6 flex flex-col items-center gap-3">
                            <motion.span
                                className="inline-block py-2 px-4 rounded-full bg-gradient-to-r from-amber-500/40 via-orange-500/40 to-rose-500/40 backdrop-blur-md border-2 border-amber-300/50 text-amber-50 text-sm font-medium tracking-wider shadow-xl"
                                animate={{
                                    boxShadow: [
                                        '0 0 20px rgba(251,191,36,0.4)',
                                        '0 0 30px rgba(249,115,22,0.5)',
                                        '0 0 20px rgba(251,191,36,0.4)'
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                ॐ नमस्ते - Welcome to DarshanSetu ॐ
                            </motion.span>
                            <motion.p
                                className="text-amber-100 text-base font-light italic tracking-wide drop-shadow-lg"
                                animate={{ opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
                            </motion.p>
                            <p className="text-amber-200/90 text-xs font-light">
                                May all beings be happy and free from illness
                            </p>
                            <motion.p
                                className="text-amber-200/80 text-xs font-light italic mt-1"
                                animate={{ opacity: [0.6, 0.9, 0.6] }}
                                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                            >
                                "ॐ शान्ति शान्ति शान्ति" - Om Peace Peace Peace
                            </motion.p>
                        </motion.div>

                        <div className="h-32 sm:h-48 flex items-center justify-center mb-6"> {/* Fixed height container to prevent layout shift */}
                            <motion.h1
                                variants={itemVariants}
                                className="text-5xl font-serif font-medium tracking-tight text-white sm:text-7xl leading-tight drop-shadow-2xl"
                                style={{
                                    textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 0 20px rgba(251,191,36,0.3)',
                                    fontFamily: 'Georgia, serif'
                                }}
                            >
                                <span className="inline-block mr-3 text-amber-300">ॐ</span>
                                <TypewriterText text="Find Peace in" /> <br />
                                <span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 font-bold animate-gradient"
                                    style={{
                                        textShadow: 'none',
                                        filter: 'drop-shadow(0 2px 8px rgba(251,191,36,0.5))',
                                        backgroundSize: '200% auto'
                                    }}
                                >
                                    <TypewriterText text="Every Step." delay={1.5} />
                                </span>
                            </motion.h1>
                        </div>

                        <motion.p
                            variants={itemVariants}
                            className="mt-6 text-xl leading-8 text-amber-50 max-w-2xl mx-auto font-light drop-shadow-lg italic"
                            style={{ fontFamily: 'Georgia, serif' }}
                        >
                            Embark on a sacred journey where devotion meets divine grace.
                            <br className="hidden sm:block" />
                            <span className="text-amber-200">Skip the queues, cherish the moment, and let the divine guide your path.</span>
                        </motion.p>

                        {/* Additional Spiritual Quote */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8 max-w-2xl mx-auto"
                        >
                            <div className="bg-white/10 backdrop-blur-md border border-amber-300/30 rounded-2xl p-6 shadow-xl">
                                <p className="text-amber-100 text-sm italic text-center leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                                    "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।<br />
                                    सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते।"
                                </p>
                                <p className="text-amber-200/80 text-xs text-center mt-3">
                                    "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga."
                                </p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/register" className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-amber-900 transition-all duration-200 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 rounded-full hover:from-amber-300 hover:to-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:shadow-[0_0_35px_rgba(251,191,36,0.7)] hover:-translate-y-1 border border-amber-500/30">
                                <Sparkles className="mr-2 w-5 h-5" />
                                Begin Pilgrimage
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link to="/login" className="px-8 py-3.5 text-base font-semibold text-amber-100 transition-all duration-200 bg-amber-900/30 backdrop-blur-md border border-amber-300/30 rounded-full hover:bg-amber-900/40 focus:outline-none hover:-translate-y-1 shadow-lg">
                                Member Login
                            </Link>
                        </motion.div>

                        {/* Search Section */}
                        <motion.div variants={itemVariants} className="mt-12 w-full">
                            <TempleSearch />
                        </motion.div>
                    </motion.div>
                </div>

                {/* News Section */}
                <NewsSection />

                {/* Decorative Bottom Shape */}
                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] pointer-events-none" aria-hidden="true">
                    <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
                </div>
            </div>

            {/* User Guide Section */}
            <UserGuide />

            {/* Stats Section with Spiritual Glass Effect */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4"
                    >
                        <span className="text-4xl">🕉️</span>
                        <span className="text-3xl mx-2">🌸</span>
                        <span className="text-4xl">🙏</span>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-amber-800/70 text-base font-light italic mb-2"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        "यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः"
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-amber-700/60 text-sm font-medium"
                    >
                        Where there is devotion, there is divine grace
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-amber-700/50 text-xs italic mt-2"
                    >
                        "ॐ तत् सत्" - Om That Is Truth
                    </motion.p>
                </div>
                <div className="grid grid-cols-1 gap-8 text-center lg:grid-cols-3">
                    {[
                        { label: 'Daily Pilgrims', value: '50,000+', icon: '🙏' },
                        { label: 'Average Wait Time', value: '< 15 mins', icon: '⏰' },
                        { label: 'Safety Incidents', value: 'Zero', icon: '🕉️' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="bg-gradient-to-br from-amber-50/90 to-orange-50/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-amber-200/40 ring-1 ring-amber-300/20 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-16 -mt-16"></div>
                            <div className="relative z-10">
                                <div className="text-4xl mb-3">{stat.icon}</div>
                                <dt className="text-sm font-semibold leading-6 text-amber-800 uppercase tracking-wider">{stat.label}</dt>
                                <dd className="order-first text-4xl font-bold tracking-tight text-amber-900 sm:text-5xl mb-2" style={{ fontFamily: 'Georgia, serif' }}>{stat.value}</dd>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Bento Grid Features Section */}
            <div id="about" className="bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 py-24 sm:py-32 relative overflow-hidden">
                {/* Decorative background pattern - spiritual mandala */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute top-20 left-20 w-96 h-96 border-2 border-amber-400 rounded-full"></div>
                    <div className="absolute top-20 left-20 w-80 h-80 border-2 border-amber-400 rounded-full m-8"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-amber-400 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 border-2 border-amber-400 rounded-full m-8"></div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="mx-auto max-w-2xl text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-4"
                        >
                            <span className="text-4xl text-amber-600">🕉️</span>
                        </motion.div>
                        <h2 className="text-base font-bold uppercase tracking-widest text-amber-700 mb-2">Why DarshanSetu?</h2>
                        <p className="mt-2 text-3xl font-serif font-bold tracking-tight text-amber-900 sm:text-4xl" style={{ fontFamily: 'Georgia, serif' }}>
                            Everything you need for a peaceful Darshan
                        </p>
                        <p className="mt-4 text-amber-700/70 italic text-sm">
                            "सत्यं शिवं सुन्दरम्" - Truth, Consciousness, Bliss
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gradient-to-br from-white to-amber-50 rounded-3xl p-8 shadow-xl shadow-amber-200/50 ring-1 ring-amber-300/20 md:col-span-2 relative overflow-hidden group border border-amber-200/30"
                        >
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-64 h-64 bg-amber-100 rounded-full opacity-40 group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
                            <div className="absolute top-4 left-4 text-amber-200/30 text-6xl font-serif">ॐ</div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-amber-900 mb-3 font-serif" style={{ fontFamily: 'Georgia, serif' }}>Smart Scheduling System</h3>
                                <p className="text-amber-800/80 leading-relaxed max-w-md">Our advanced algorithm distributes crowd flow evenly throughout the day. Book your specific time slot and walk in without the wait, allowing you to focus on your spiritual journey.</p>

                                <div className="mt-8 flex gap-4">
                                    <div className="flex items-center gap-2 text-sm text-amber-700 font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-amber-600" /> Instant Confirmation
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-amber-700 font-medium">
                                        <CheckCircle2 className="w-4 h-4 text-amber-600" /> QR Code Entry
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gradient-to-br from-amber-900 via-orange-900 to-amber-800 rounded-3xl p-8 shadow-xl shadow-amber-900/40 ring-1 ring-amber-700/30 md:col-span-1 text-white relative overflow-hidden border border-amber-700/30"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-800/90 to-orange-900/90"></div>
                            <div className="absolute top-4 right-4 text-amber-600/20 text-5xl font-serif">🕉️</div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-amber-400/20 rounded-xl flex items-center justify-center mb-6 text-amber-300 backdrop-blur-sm border border-amber-400/30">
                                    <Activity className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-serif text-amber-100" style={{ fontFamily: 'Georgia, serif' }}>Real-time Analytics</h3>
                                <p className="text-amber-200/90 leading-relaxed text-sm">Monitor crowd density in real-time. Our heatmaps help authorities manage flow effectively, ensuring a peaceful experience for all devotees.</p>
                            </div>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gradient-to-br from-white to-amber-50 rounded-3xl p-8 shadow-xl shadow-amber-200/50 ring-1 ring-amber-300/20 md:col-span-1 relative overflow-hidden border border-amber-200/30"
                        >
                            <div className="absolute bottom-4 right-4 text-amber-200/30 text-5xl font-serif">🙏</div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-amber-900 mb-3 font-serif" style={{ fontFamily: 'Georgia, serif' }}>Emergency Ready</h3>
                                <p className="text-amber-800/80 leading-relaxed text-sm">Instant SOS alerts connect directly to on-ground security and medical teams, ensuring your safety during your spiritual journey.</p>
                            </div>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 shadow-xl shadow-amber-600/40 ring-1 ring-amber-800/30 md:col-span-2 relative overflow-hidden text-white border border-amber-500/30"
                        >
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                            <div className="absolute top-4 left-4 text-amber-300/20 text-7xl font-serif">ॐ</div>
                            <div className="absolute bottom-4 right-4 text-amber-300/20 text-7xl font-serif rotate-180">ॐ</div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 font-serif text-amber-50" style={{ fontFamily: 'Georgia, serif' }}>Join 100+ Temples</h3>
                                    <p className="text-amber-100/90 italic">Trusted by the largest pilgrimage sites in the country. Experience the divine with peace and devotion.</p>
                                </div>
                                <Link to="/register" className="px-6 py-3 bg-white text-amber-700 rounded-full font-bold hover:bg-amber-50 transition shadow-lg hover:shadow-xl border border-amber-200/30">
                                    Begin Your Journey
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>


            {/* Footer */}
            <footer className="bg-gradient-to-b from-amber-100 to-amber-200 border-t border-amber-300/30 py-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 text-amber-600 text-6xl font-serif">ॐ</div>
                    <div className="absolute bottom-0 right-1/4 text-amber-600 text-6xl font-serif">🕉️</div>
                </div>
                <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center justify-center gap-2 text-amber-900 text-sm relative z-10">
                    <p className="text-amber-800/70 italic text-xs mb-1">
                        "सर्वे भवन्तु सुखिनः"
                    </p>
                    <p className="text-amber-700">
                        © 2024 DarshanSetu. All rights reserved. Made for Hackathon.
                    </p>
                </div>
            </footer>
        </div >
    );
};

export default Landing;
