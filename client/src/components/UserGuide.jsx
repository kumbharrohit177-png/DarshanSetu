import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Calendar, QrCode, CheckCircle2 } from 'lucide-react';

const UserGuide = () => {
    const [language, setLanguage] = useState('en'); // 'en', 'hi', 'mr'

    const languages = [
        { id: 'en', label: 'English' },
        { id: 'hi', label: 'हिंदी' },
        { id: 'mr', label: 'मराठी' }
    ];

    const content = {
        en: {
            title: "How to Use DarshanSetu",
            subtitle: "Follow these simple steps for a hassle-free darshan experience",
            steps: [
                {
                    title: "Create Account",
                    description: "Sign up with your mobile number and details to get started.",
                    icon: UserPlus
                },
                {
                    title: "Book Slot",
                    description: "Select your preferred date and time slot for temple visit.",
                    icon: Calendar
                },
                {
                    title: "Get QR Code",
                    description: "Receive a unique digital ticket with QR code instantly.",
                    icon: QrCode
                },
                {
                    title: "Easy Entry",
                    description: "Show your QR code at the temple entrance for quick scanning.",
                    icon: CheckCircle2
                }
            ]
        },
        hi: {
            title: "दर्शनसेतु का उपयोग कैसे करें",
            subtitle: "परेशानी मुक्त दर्शन अनुभव के लिए इन सरल चरणों का पालन करें",
            steps: [
                {
                    title: "खाता बनाएं",
                    description: "शुरू करने के लिए अपने मोबाइल नंबर और विवरण के साथ साइन अप करें।",
                    icon: UserPlus
                },
                {
                    title: "स्लॉट बुक करें",
                    description: "मंदिर दर्शन के लिए अपनी पसंदीदा तारीख और समय चुनें।",
                    icon: Calendar
                },
                {
                    title: "QR कोड प्राप्त करें",
                    description: "तुरंत QR कोड के साथ एक अद्वितीय डिजिटल टिकट प्राप्त करें।",
                    icon: QrCode
                },
                {
                    title: "आसान प्रवेश",
                    description: "त्वरित स्कैनिंग के लिए मंदिर के प्रवेश द्वार पर अपना QR कोड दिखाएं।",
                    icon: CheckCircle2
                }
            ]
        },
        mr: {
            title: "दर्शनसेतु कसे वापरावे",
            subtitle: "त्रासमुक्त दर्शन अनुभवासाठी या सोप्या चरणांचे अनुसरण करा",
            steps: [
                {
                    title: "खाते तयार करा",
                    description: "सुरुवात करण्यासाठी आपल्या मोबाइल नंबर आणि माहितीसह साइन अप करा.",
                    icon: UserPlus
                },
                {
                    title: "स्लॉट बुक करा",
                    description: "मंदिर दर्शनासाठी तुमची पसंतीची तारीख आणि वेळ निवडा.",
                    icon: Calendar
                },
                {
                    title: "QR कोड मिळवा",
                    description: "QR कोडसह युनिक डिजिटल तिकीट त्वरित प्राप्त करा.",
                    icon: QrCode
                },
                {
                    title: "सुलभ प्रवेश",
                    description: "त्वरित स्कॅनिंगसाठी मंदिर प्रवेशद्वारावर तुमचा QR कोड दाखवा.",
                    icon: CheckCircle2
                }
            ]
        }
    };

    const currentContent = content[language];

    return (
        <section className="py-20 relative overflow-hidden bg-orange-50/50">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center mb-16">
                    {/* Language Toggle */}
                    <div className="flex bg-white p-1 rounded-full shadow-md border border-orange-100 mb-8 relative z-50">
                        {languages.map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => {
                                    console.log(`Switched to ${lang.label}`);
                                    setLanguage(lang.id);
                                }}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${language === lang.id
                                    ? 'bg-orange-500 text-white shadow-lg ring-2 ring-orange-300 ring-offset-1'
                                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                    }`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={language}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-center"
                    >
                        <h2
                            className="text-4xl font-bold text-gray-900 mb-4"
                            style={{ fontFamily: language === 'en' ? 'Georgia, serif' : 'system-ui, -apple-system, sans-serif' }}
                        >
                            {currentContent.title}
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full mb-4"></div>
                        <p
                            className="text-lg text-gray-600"
                            style={{ fontFamily: language === 'en' ? 'Georgia, serif' : 'system-ui, -apple-system, sans-serif' }}
                        >
                            {currentContent.subtitle}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {currentContent.steps.map((step, index) => (
                        <motion.div
                            key={index + language} // Re-animate on language change
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {index < currentContent.steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-orange-200 -z-10"></div>
                            )}

                            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-orange-100/50 border border-orange-100 hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mb-6 text-orange-600 shadow-inner">
                                    <step.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {step.description}
                                </p>
                                <div className="mt-auto pt-4">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-800 font-bold text-sm border border-orange-200">
                                        {index + 1}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UserGuide;
