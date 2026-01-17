import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import BookingForm from '../components/BookingForm';
import BookingList from '../components/BookingList';
import SOSButton from '../components/SOSButton';

const Dashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [temples, setTemples] = useState([]);
    const [selectedTemple, setSelectedTemple] = useState(null);
    const [error, setError] = useState('');
    const [loadingTemples, setLoadingTemples] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBookings();
            fetchTemples();
        }
    }, [user]);

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

    if (!user) {
        console.log("Dashboard: Waiting for user...");
        return <div>Loading user profile...</div>;
    }

    console.log("Dashboard Rendering. User:", user);
    console.log("Temples:", temples);
    console.log("Bookings:", bookings);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 border-4 border-red-500">
            <div className="mb-8 p-4 bg-yellow-100">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">
                    Namaste, {user?.name || 'Devotee'}
                </h1>
                <p className="mt-2 text-lg text-gray-600">Welcome to your spiritual dashboard.</p>
                <p className="text-xs text-gray-500">Debug: Role={user?.role}, ID={user?._id}</p>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Temple Selection / Booking */}
                <div className="lg:col-span-1">
                    {!selectedTemple ? (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800">Select a Temple</h2>

                            {loadingTemples ? (
                                <div className="text-gray-500">Loading temples...</div>
                            ) : temples.length === 0 ? (
                                <div className="text-gray-500">No temples found.</div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {temples.map(temple => (
                                        <div
                                            key={temple._id}
                                            onClick={() => setSelectedTemple(temple)}
                                            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                                        >
                                            <div className="h-32 bg-gray-200 overflow-hidden relative">
                                                {temple.imageUrl ? (
                                                    <img
                                                        src={temple.imageUrl}
                                                        alt={temple.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=Temple'; }}
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-lg text-gray-800">{temple.name}</h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                                    {temple.location}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transition-transform hover:-translate-y-1 duration-300">
                            <button
                                onClick={() => setSelectedTemple(null)}
                                className="mb-4 text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                            >
                                ← Back to Temples
                            </button>
                            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{selectedTemple.name} Darshan</h3>
                            <BookingForm
                                onBookingSuccess={() => {
                                    fetchBookings();
                                    setSelectedTemple(null);
                                }}
                                templeId={selectedTemple._id}
                            />
                        </div>
                    )}
                </div>

                {/* Right Column: My Bookings & Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                            <span className="w-2 h-8 bg-primary-600 rounded-full"></span>
                            Your Upcoming Darshans
                        </h2>
                        <BookingList bookings={bookings} />
                    </div>

                    {/* Additional info cards can go here */}
                    <div>
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                            <h3 className="font-bold text-orange-800 mb-2 text-lg">Temple Updates</h3>
                            <p className="text-orange-900/80">
                                Today: Special Aarti at 6:00 PM. Crowd density is currently moderate. Please arrive 30 mins before your slot.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating SOS Button */}
            <SOSButton />
        </div>
    );
};

export default Dashboard;
