import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Heart, CreditCard, Wallet, Building2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const DonationModal = ({ isOpen, onClose, preSelectedTemple = null }) => {
    const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Success
    const [amount, setAmount] = useState('');
    const [selectedTemple, setSelectedTemple] = useState(preSelectedTemple);
    const [temples, setTemples] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [customAmount, setCustomAmount] = useState('');

    const PRESET_AMOUNTS = [101, 251, 501, 1001, 2100];

    useEffect(() => {
        if (isOpen) {
            fetchTemples();
            setStep(1);
            setAmount('');
            setCustomAmount('');
            if (preSelectedTemple) setSelectedTemple(preSelectedTemple);
        }
    }, [isOpen, preSelectedTemple]);

    const fetchTemples = async () => {
        try {
            const { data } = await api.get('/temples');
            setTemples(data);
        } catch (error) {
            console.error("Failed to fetch temples", error);
        }
    };

    const handleDonate = async () => {
        setIsLoading(true);
        try {
            // 1. Create Order on Backend
            const { data: orderData } = await api.post('/payment/order', {
                amount: amount,
                receipt: `receipt_${Date.now()}`
            });

            if (!orderData.success) {
                console.error("Order creation failed", orderData);
                alert("Could not initiate payment. Please try again.");
                setIsLoading(false);
                return;
            }

            // CHECK FOR DEMO MODE
            if (orderData.demoMode) {
                console.log("Demo Mode: Simulating Payment Success");
                setTimeout(async () => {
                    // Simulate backend verification for demo
                    try {
                        const { data: verification } = await api.post('/payment/verify', {
                            razorpay_order_id: orderData.order_id,
                            razorpay_payment_id: "pay_demo_" + Date.now(),
                            razorpay_signature: "demo_signature"
                        });

                        if (verification.success) {
                            setStep(3);
                        } else {
                            alert("Demo verification failed");
                        }
                    } catch (err) {
                        console.error("Demo verify error", err);
                    }
                    setIsLoading(false);
                }, 2000); // 2 second delay to simulate user payment time
                return;
            }

            // 2. Options for Razorpay Checkout
            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "DarshanSetu",
                description: `Donation to ${selectedTemple.name}`,
                image: "/logo.png", // Ensure you have a logo or remove this
                order_id: orderData.id,
                handler: async function (response) {
                    // 3. Verify Payment on Backend
                    const verifyData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    };

                    try {
                        const { data: verification } = await api.post('/payment/verify', verifyData);
                        if (verification.success) {
                            setStep(3); // Success Step
                        } else {
                            alert("Payment verification failed!");
                        }
                    } catch (error) {
                        console.error("Verification Error", error);
                        alert("Payment verification failed on server.");
                    }
                    setIsLoading(false);
                },
                prefill: {
                    name: "Devotee", // Can fetch from Auth Context
                    email: "devotee@example.com",
                    contact: "9999999999"
                },
                notes: {
                    address: "Temple Office"
                },
                theme: {
                    color: "#F97316" // Orange/Saffron theme
                }
            };

            // 4. Open Checkout
            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                alert(response.error.description);
                setIsLoading(false);
            });
            rzp1.open();

        } catch (error) {
            console.error("Payment Error", error);
            // Fallback for "Demo Mode" if API fails totally (e.g. no internet) 
            // - optional, but maybe strictly show error now as user wanted "real" system.
            alert("Payment system error. Please try again.");
            setIsLoading(false);
        }
    };

    // Use Portal to render outside of the parent container which might have pointer-events: none
    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Decorative Header */}
                        <div className="h-32 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 relative overflow-hidden flex items-center justify-center text-white">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-20"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center z-10 relative">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <Heart className="w-12 h-12 mx-auto mb-2 fill-white text-white drop-shadow-lg" />
                                    <h2 className="text-2xl font-bold font-serif">Make a Divine Offering</h2>
                                    <p className="text-amber-100 text-sm">Support the sacred traditions</p>
                                </motion.div>
                            </div>
                        </div>

                        <div className="p-8">
                            {step === 1 && (
                                <div className="space-y-6">
                                    {/* Temple Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Temple</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                                            <select
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-gray-50 transition-all appearance-none cursor-pointer relative z-0"
                                                value={selectedTemple?._id || ''}
                                                onChange={(e) => {
                                                    const t = temples.find(t => t._id === e.target.value);
                                                    if (t) {
                                                        setSelectedTemple(t);
                                                        console.log("Selected:", t);
                                                    }
                                                }}
                                                disabled={temples.length === 0}
                                            >
                                                <option value="">
                                                    {temples.length === 0 ? "Loading Temples..." : "-- Choose a Temple --"}
                                                </option>

                                                {temples.length > 0 ? (
                                                    temples.map(t => (
                                                        <option key={t._id} value={t._id}>{t.name}</option>
                                                    ))
                                                ) : (
                                                    <option disabled>No temples found</option>
                                                )}
                                            </select>

                                            {/* Dropdown arrow fix for some browsers if appearance-none removes it */}
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Choose Donation Amount (₹)</label>
                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            {PRESET_AMOUNTS.map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => { setAmount(val); setCustomAmount(''); }}
                                                    className={`py-2 px-4 rounded-lg border font-medium transition-all ${amount === val
                                                        ? 'bg-orange-600 text-white border-orange-600 shadow-md transform scale-105'
                                                        : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50'
                                                        }`}
                                                >
                                                    ₹{val}
                                                </button>
                                            ))}
                                            <input
                                                type="number"
                                                placeholder="Other"
                                                value={customAmount}
                                                onChange={(e) => {
                                                    setCustomAmount(e.target.value);
                                                    setAmount(Number(e.target.value));
                                                }}
                                                className={`py-2 px-4 rounded-lg border font-medium outline-none text-center transition-all ${customAmount
                                                    ? 'border-orange-500 ring-2 ring-orange-200'
                                                    : 'border-gray-200 hover:border-orange-300'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={!selectedTemple || !amount}
                                        onClick={() => setStep(2)}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                                    >
                                        Proceed to Payment <Wallet size={20} />
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 text-center">
                                    <div className="text-left bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Summary</h3>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-gray-700">Temple</span>
                                            <span className="font-bold text-gray-900 text-right">{selectedTemple?.name}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-700">Amount</span>
                                            <span className="font-bold text-orange-600 text-xl">₹{amount}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={handleDonate}
                                            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
                                        >
                                            <span className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                    <span className="font-bold text-xs">UPI</span>
                                                </div>
                                                <span className="font-medium text-gray-700 group-hover:text-orange-800">UPI / QR Code</span>
                                            </span>
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-orange-500"></div>
                                        </button>

                                        <button
                                            onClick={handleDonate}
                                            className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
                                        >
                                            <span className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                                    <CreditCard size={20} />
                                                </div>
                                                <span className="font-medium text-gray-700 group-hover:text-orange-800">Card / NetBanking</span>
                                            </span>
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 group-hover:border-orange-500"></div>
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => setStep(1)}
                                        className="text-sm text-gray-400 hover:text-gray-600 mt-4"
                                    >
                                        Back to Amount
                                    </button>

                                    {isLoading && (
                                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-3xl">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-3"></div>
                                            <p className="text-orange-800 font-medium animate-pulse">Processing secure offering...</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 3 && (
                                <div className="text-center py-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6"
                                    >
                                        <CheckCircle2 size={40} strokeWidth={3} />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Offering Successful!</h3>
                                    <p className="text-gray-600 mb-8">
                                        Thank you for your generous donation of
                                        <span className="font-bold text-gray-900 mx-1">₹{amount}</span>
                                        to
                                        <span className="font-bold text-orange-700 mx-1">{selectedTemple?.name}</span>.
                                        May you be blessed!
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors shadow-lg"
                                    >
                                        Close Receipt
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default DonationModal;
