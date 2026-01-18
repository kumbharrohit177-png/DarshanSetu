import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Info } from 'lucide-react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const TempleSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [temples, setTemples] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/temples');
                setTemples(data);
            } catch (error) {
                console.error("Failed to fetch temples for search", error);
            } finally {
                setLoading(false);
            }
        };

        if (isFocused && temples.length === 0) {
            fetchTemples();
        }
    }, [isFocused]);

    // Filter temples: Matching search term AND ensuring they have an image
    const filteredTemples = searchTerm.trim() === '' ? [] : temples.filter(temple => {
        const matchesSearch =
            temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            temple.location.toLowerCase().includes(searchTerm.toLowerCase());

        // Strict filter: Must have a valid imageUrl (not empty, not null)
        const hasImage = temple.imageUrl && temple.imageUrl.trim().length > 0;

        return matchesSearch && hasImage;
    });

    const handleTempleClick = (temple) => {
        // Navigate or show details. For now, we can maybe navigate to dashboard with this temple selected?
        // Or just let user see info. The requirement was "get some info".
        // Let's just keep it as a viewing experience for now.
        console.log("Selected temple:", temple);
    };

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
                // onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                />
            </div>

            {/* Dropdown Results */}
            {isFocused && (
                <div className="absolute top-16 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[500px] overflow-y-auto overflow-x-hidden z-[100] custom-scrollbar">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-2"></div>
                            Searching sacred sites...
                        </div>
                    ) : filteredTemples.length > 0 ? (
                        <>
                            <div className="px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0 z-10 border-b border-gray-100">
                                Found {filteredTemples.length} Temples with Gallery
                            </div>
                            {filteredTemples.map((temple) => (
                                <div
                                    key={temple._id}
                                    onClick={() => handleTempleClick(temple)}
                                    className="px-4 py-4 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors group"
                                >
                                    <div className="flex gap-4">
                                        {/* Temple Thumbnail */}
                                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
                                            <img
                                                src={temple.imageUrl}
                                                alt={temple.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    // Hide if image fails to load, effectively filtering it out visually or showing placeholder
                                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                                }}
                                            />
                                        </div>

                                        {/* Temple Details */}
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-lg text-gray-800 group-hover:text-orange-700 transition-colors">{temple.name}</h4>
                                                <span className="bg-green-100 text-green-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Open</span>
                                            </div>

                                            <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                                                <MapPin className="w-3.5 h-3.5 mr-1 text-orange-500" />
                                                {temple.location}
                                            </div>

                                            {/* Extra Info Snippet */}
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {temple.description || "A sacred place for spiritual connection and divine blessings."}
                                            </p>

                                            <div className="flex items-center gap-3 mt-2 text-xs font-medium text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {temple.openingHours || "06:00 - 22:00"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="p-8 text-center bg-gray-50 rounded-b-2xl">
                            {searchTerm ? (
                                <>
                                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium">No temples found matching "{searchTerm}"</p>
                                    <p className="text-gray-400 text-sm mt-1">Try checking the spelling or search for a major city.</p>
                                </>
                            ) : (
                                <p className="text-gray-400">Start typing to search for temples...</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Overlay to close dropdown when clicking outside */}
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
