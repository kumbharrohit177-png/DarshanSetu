import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { AlertTriangle, User, MapPin } from 'lucide-react';

const ZoneDensityPanel = ({ temples, selectedTemple, setSelectedTemple }) => {
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);



    const fetchZones = async () => {
        if (!selectedTemple) return;
        try {
            const { data } = await api.get(`/analytics/zones?templeId=${selectedTemple}`);
            setZones(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching zone density:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchZones();
        const interval = setInterval(fetchZones, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [selectedTemple]);

    const getStatusColor = (percent) => {
        if (percent >= 90) return 'bg-red-500';
        if (percent >= 70) return 'bg-orange-500';
        return 'bg-emerald-500';
    };

    if (loading) return <div className="p-4 bg-white rounded-xl shadow-sm animate-pulse h-64"></div>;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <User className="text-blue-600" size={20} />
                    Live Zone Density
                </h3>

                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                    <select
                        value={selectedTemple}
                        onChange={(e) => setSelectedTemple(e.target.value)}
                        className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 appearance-none cursor-pointer hover:bg-white transition-colors"
                        style={{ minWidth: '160px' }}
                    >
                        {temples.map(temple => (
                            <option key={temple._id} value={temple._id}>
                                {temple.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-6">
                {zones.map((zone) => (
                    <div key={zone.name} className="relative">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h4 className="font-semibold text-gray-700">{zone.name}</h4>
                                <span className="text-xs text-gray-500">Cap: {zone.capacity}</span>
                            </div>
                            <div className="text-right">
                                <span className={`text-sm font-bold ${zone.percentFull >= 90 ? 'text-red-600' :
                                    zone.percentFull >= 70 ? 'text-orange-600' : 'text-emerald-600'
                                    }`}>
                                    {zone.current} Active
                                </span>
                                <div className="text-xs text-gray-400">{zone.percentFull}% Full</div>
                            </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${zone.percentFull}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${getStatusColor(zone.percentFull)}`}
                            />
                        </div>

                        {/* Warning Indicator */}
                        {zone.percentFull >= 90 && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="absolute -right-2 -top-2"
                            >
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ZoneDensityPanel;
