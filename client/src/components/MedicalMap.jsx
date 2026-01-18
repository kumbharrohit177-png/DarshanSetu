import React from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

const MedicalMap = ({ resources, incidents }) => {
    // Simulated Map Background (Mocking a temple zone layout)
    return (
        <div className="relative w-full h-[600px] bg-indigo-50 rounded-xl overflow-hidden border border-indigo-100 shadow-inner group">
            {/* Map Grid / Background */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Zones Mockup */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-orange-300 rounded-full flex items-center justify-center opacity-20">
                <span className="text-4xl text-orange-400 font-bold uppercase rotate-45">Sanctum</span>
            </div>
            <div className="absolute top-10 left-10 text-xl font-bold text-gray-400">North Gate</div>
            <div className="absolute bottom-10 right-10 text-xl font-bold text-gray-400">South Parking</div>

            {/* Resources (Ambulances, Teams) */}
            {resources.map((res) => (
                <div
                    key={res._id}
                    className="absolute flex flex-col items-center transition-all duration-1000 ease-in-out"
                    style={{
                        // Simple mock positioning based on lat/lng or zone
                        top: `${(res.location.lat % 1) * 1000 - 100}%`, // Mock conversion
                        left: `${(res.location.lng % 1) * 1000 - 100}%`,
                    }}
                >
                    <div className={`
                        p-2 rounded-full shadow-lg border-2 
                        ${res.status === 'available' ? 'bg-green-500 border-white' : 'bg-red-500 border-red-200'}
                        text-white transform hover:scale-125 transition-transform cursor-pointer
                    `}>
                        <Navigation size={20} className={res.status === 'busy' ? 'animate-pulse' : ''} />
                    </div>
                    <span className="bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm mt-1 backdrop-blur-sm">
                        {res.name}
                    </span>
                    {res.status === 'busy' && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                    )}
                </div>
            ))}

            {/* Incidents */}
            {incidents.map((incident) => (
                <div
                    key={incident._id}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500 rounded-full opacity-50 animate-ping"></div>
                        <div className="bg-red-600 text-white p-2 rounded-full shadow-xl border-4 border-red-100 z-10 relative">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="bg-red-600 text-white text-xs px-2 py-1 rounded mt-2 font-bold shadow-lg animate-bounce">
                        {incident.type.toUpperCase()}
                    </div>
                </div>
            ))}

            {/* Simulated Live Traffic/Route Data */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <path d="M100,100 Q400,300 700,500" fill="none" stroke="red" strokeWidth="4" strokeDasharray="10,5" className="animate-pulse" />
                <path d="M700,100 Q400,300 100,600" fill="none" stroke="green" strokeWidth="4" strokeDasharray="5,5" />
            </svg>
        </div>
    );
};

export default MedicalMap;
