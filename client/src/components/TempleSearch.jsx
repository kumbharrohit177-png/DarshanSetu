import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const TEMPLES = [
    { id: 1, name: "Kashi Vishwanath", location: "Varanasi, UP" },
    { id: 2, name: "Tirumala Tirupati", location: "Tirumala, AP" },
    { id: 3, name: "Vaishno Devi", location: "Katra, J&K" },
    { id: 4, name: "Golden Temple", location: "Amritsar, Punjab" },
    { id: 5, name: "Jagannath Temple", location: "Puri, Odisha" },
    { id: 6, name: "Somnath Temple", location: "Veraval, Gujarat" },
    { id: 7, name: "Kedarnath Temple", location: "Kedarnath, Uttarakhand" },
    { id: 8, name: "Badrinath Temple", location: "Badrinath, Uttarakhand" },
    { id: 9, name: "Meenakshi Temple", location: "Madurai, TN" },
    { id: 10, name: "Ramanathaswamy", location: "Rameswaram, TN" },
    { id: 11, name: "Siddhivinayak", location: "Mumbai, Maharashtra" },
    { id: 12, name: "Shirdi Sai Baba", location: "Shirdi, Maharashtra" },
    { id: 13, name: "Dwarkadhish", location: "Dwarka, Gujarat" },
    { id: 14, name: "Akshardham", location: "Delhi" },
    { id: 15, name: "Konark Sun Temple", location: "Konark, Odisha" },
    { id: 16, name: "Brihadeeswarar", location: "Thanjavur, TN" },
    { id: 17, name: "Padmanabhaswamy", location: "Thiruvananthapuram, Kerala" },
    { id: 18, name: "Sabarimala", location: "Pathanamthitta, Kerala" },
    { id: 19, name: "Mahakaleshwar", location: "Ujjain, MP" },
    { id: 20, name: "Kamakhya Temple", location: "Guwahati, Assam" },
    { id: 21, name: "Prem Mandir", location: "Vrindavan, UP" },
    { id: 22, name: "Banke Bihari", location: "Vrindavan, UP" },
    { id: 23, name: "Dakshineswar Kali", location: "Kolkata, WB" },
    { id: 24, name: "Lingaraj Temple", location: "Bhubaneswar, Odisha" },
    { id: 25, name: "Amarnath Cave", location: "J&K" },
];

const TempleSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const filteredTemples = TEMPLES.filter(temple =>
        temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        temple.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-2xl mx-auto relative z-[60]">
            <div className={`relative flex items-center bg-white rounded-full shadow-xl transition-all duration-300 ${isFocused ? 'ring-2 ring-primary-500 scale-105' : ''}`}>
                <Search className="ml-6 text-gray-400 w-6 h-6" />
                <input
                    type="text"
                    placeholder="Search for a temple (e.g., Kashi, Tirupati)..."
                    className="w-full px-4 py-4 rounded-full focus:outline-none text-gray-700 text-lg placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                // keeping focus true for demo to show list, or use blur with delay
                />
            </div>

            {/* Dropdown Results */}
            {isFocused && (
                <div className="absolute top-16 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-96 overflow-y-auto overflow-x-hidden z-[100]">
                    {filteredTemples.length > 0 ? (
                        <>
                            <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0">
                                Popular Temples ({filteredTemples.length})
                            </div>
                            {filteredTemples.map((temple) => (
                                <div
                                    key={temple.id}
                                    className="px-6 py-3 hover:bg-primary-50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0 transition-colors"
                                >
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{temple.name}</h4>
                                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {temple.location}
                                        </div>
                                    </div>
                                    <button className="text-xs font-medium text-primary-600 border border-primary-200 px-3 py-1 rounded-full hover:bg-primary-600 hover:text-white transition-all">
                                        View Slots
                                    </button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No temples found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            )}

            {/* Overlay to close dropdown when clicking outside - simplified for local demo */}
            {isFocused && (
                <div
                    className="fixed inset-0 z-[-1]"
                    onClick={() => setIsFocused(false)}
                ></div>
            )}
        </div>
    );
};

export default TempleSearch;
