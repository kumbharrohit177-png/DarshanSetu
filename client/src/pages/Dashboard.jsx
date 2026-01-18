import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import BookingForm from '../components/BookingForm';
import SOSButton from '../components/SOSButton';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';

import socket from '../utils/socket';
import NotificationToast from '../components/NotificationToast';

const Dashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [temples, setTemples] = useState([]);
    const [selectedTemple, setSelectedTemple] = useState(null);
    const [error, setError] = useState('');
    const [loadingTemples, setLoadingTemples] = useState(true);
    const [sharingLocation, setSharingLocation] = useState(false);
    const [showBookingSuccess, setShowBookingSuccess] = useState(false);

    const [activeFilter, setActiveFilter] = useState("All");

    const filters = ["All", "Maharashtra", "Gujarat", "Odisha", "South India", "North India"];

    const filteredTemples = temples.filter(temple => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Maharashtra") return temple.location.includes("Maharashtra") || temple.location.includes("Mumbai");
        if (activeFilter === "Gujarat") return temple.location.includes("Gujarat");
        if (activeFilter === "Odisha") return temple.location.includes("Odisha");
        // South India: TN (Tamil Nadu), Kerala, AP (Andhra Pradesh), Telangana, Karnataka
        if (activeFilter === "South India") return ["TN", "Kerala", "AP", "Tamil Nadu", "Andhra", "Telangana", "Karnataka"].some(loc => temple.location.includes(loc));
        // North India: UP, J&K, Punjab, Uttarakhand, Delhi, MP, Rajasthan, HP
        if (activeFilter === "North India") return ["UP", "J&K", "Punjab", "Uttarakhand", "Delhi", "MP", "Himachal", "Uttar Pradesh"].some(loc => temple.location.includes(loc));
        return true;
    });

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        }
    };

    const fetchTemples = async () => {
        try {
            setLoadingTemples(true);
            const { data } = await api.get('/temples');
            console.log("Fetched temples:", data);
            setTemples(data);
            setLoadingTemples(false);
        } catch (error) {
            console.error("Failed to fetch temples", error);
            setError("Failed to load temples. Please ensure server is running.");
            setLoadingTemples(false);
        }
    };

    useEffect(() => {
        let watchId;
        if (user) {
            fetchBookings();
            fetchTemples();

            // Start sharing live location
            if (navigator.geolocation) {
                setSharingLocation(true);
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        socket.emit('update-location', {
                            userId: user._id,
                            name: user.name,
                            role: 'pilgrim',
                            lat: latitude,
                            lng: longitude,
                            timestamp: new Date()
                        });
                    },
                    (err) => console.error("Location Error:", err),
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            }
        }
        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [user]);

    if (!user) {
        console.log("Dashboard: Waiting for user...");
        return <div>Loading user profile...</div>;
    }

    console.log("Dashboard Rendering. User:", user);
    console.log("Temples:", temples);
    console.log("Bookings:", bookings);

    return (
        <div className="min-h-screen bg-pattern-mandala pb-12">
            <NotificationToast />
            {/* Header / Hero Section */}
            <div className="relative bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white pb-24 pt-12 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-xl">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
                <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold font-serif tracking-tight drop-shadow-md">
                            Namaste, {user?.name || 'Devotee'}
                        </h1>
                        <p className="mt-2 text-lg text-orange-100 font-medium">
                            Book your Darshan and seek digital blessings.
                        </p>
                        {sharingLocation && (
                            <span className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm border border-white/30 text-white animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)]"></span>
                                Live Location Active
                            </span>
                        )}
                    </div>
                    <Link to="/my-bookings" className="group relative px-8 py-3 bg-white text-orange-700 font-bold rounded-full shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            View My Bookings <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                        <div className="absolute inset-0 bg-orange-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 space-y-8 relative z-10">

                {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

                {/* Temple Selection Area */}
                <div className="space-y-6">
                    {!selectedTemple ? (
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Select a Temple</h2>
                                {/* Location Filters */}
                                <div className="flex flex-wrap justify-center gap-2">
                                    {filters.map(filter => (
                                        <button
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${activeFilter === filter
                                                ? 'bg-orange-600 text-white border-orange-600 shadow-md'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600'
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {loadingTemples ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                                </div>
                            ) : filteredTemples.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-xl">
                                    <p className="text-gray-500 text-lg">No temples found in {activeFilter}.</p>
                                    <button onClick={() => setActiveFilter('All')} className="mt-4 text-orange-600 font-medium hover:underline">
                                        View All Temples
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {filteredTemples.map(temple => (
                                        <div
                                            key={temple._id}
                                            onClick={() => setSelectedTemple(temple)}
                                            className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group flex flex-col sm:flex-row h-auto"
                                        >
                                            <div className="sm:w-72 h-56 sm:h-auto bg-gray-200 relative shrink-0">
                                                {temple.imageUrl ? (
                                                    <img
                                                        src={temple.imageUrl}
                                                        alt={temple.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = '/temples/default.jpg'; }}
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                                                        No Image Available
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6 flex flex-col justify-between flex-grow">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-2xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{temple.name}</h3>
                                                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Open</span>
                                                    </div>
                                                    <p className="text-gray-600 flex items-center gap-2 mb-3">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-gray-400"></span>
                                                        {temple.location}
                                                    </p>
                                                    <p className="text-gray-500 text-sm line-clamp-4">{temple.description || "Experience the divine atmosphere and seek blessings."}</p>
                                                </div>
                                                <div className="mt-4 flex items-center text-primary-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                                                    Book Darshan <span className="ml-1">→</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fadeIn">
                            <button
                                onClick={() => setSelectedTemple(null)}
                                className="mb-6 text-sm text-gray-500 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back to Temples
                            </button>

                            <div className="mb-6">
                                <div className="w-full h-64 rounded-xl bg-gray-100 overflow-hidden mb-6 shadow-md relative">
                                    {selectedTemple.imageUrl && (
                                        <img src={selectedTemple.imageUrl} alt={selectedTemple.name} className="w-full h-full object-cover" />
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                                        <h1 className="text-3xl font-bold text-white mb-1">{selectedTemple.name}</h1>
                                        <p className="text-gray-200 flex items-center gap-2 text-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                            {selectedTemple.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                        <div className="flex items-center gap-2 text-orange-700 font-semibold mb-1">
                                            <Clock className="w-4 h-4" /> Opening Hours
                                        </div>
                                        <p className="text-gray-700 font-medium">{selectedTemple.openingHours || "06:00 - 22:00"}</p>
                                    </div>

                                    {selectedTemple.deity && (
                                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                                            <div className="flex items-center gap-2 text-purple-700 font-semibold mb-1">
                                                <span>🕉️</span> Main Deity
                                            </div>
                                            <p className="text-gray-700 font-medium">{selectedTemple.deity}</p>
                                        </div>
                                    )}

                                    {selectedTemple.architecture && (
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 text-blue-700 font-semibold mb-1">
                                                <span>🏛️</span> Architecture
                                            </div>
                                            <p className="text-gray-700 font-medium">{selectedTemple.architecture}</p>
                                        </div>
                                    )}
                                </div>

                                {selectedTemple.festivals && selectedTemple.festivals.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Major Festivals</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTemple.festivals.map((festival, index) => (
                                                <span key={index} className="text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg">
                                                    {festival}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="prose max-w-none text-gray-700 leading-relaxed mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About the Temple</h3>
                                    <p>{selectedTemple.description}</p>
                                </div>

                                <BookingForm
                                    onBookingSuccess={() => {
                                        fetchBookings();
                                        setSelectedTemple(null);
                                        setShowBookingSuccess(true);
                                        setTimeout(() => setShowBookingSuccess(false), 5000);
                                    }}
                                    templeId={selectedTemple._id}
                                />
                            </div>
                        </div>
                    )}

                    {/* Floating SOS Button */}
                    <SOSButton />

                    {/* Success Toast */}
                    {showBookingSuccess && (
                        <div className="fixed bottom-24 right-4 z-50 animate-slideInRight">
                            <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-500">
                                <CheckCircle className="w-8 h-8 text-green-200" />
                                <div>
                                    <h4 className="font-bold text-lg">Booking Confirmed!</h4>
                                    <p className="text-sm text-green-100 font-medium">Your Darshan slot has been reserved.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
