import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { TrendingUp, BarChart2 } from 'lucide-react';

const AnalyticsCharts = () => {
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const { data } = await api.get('/analytics/trends');
                setTrendData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching trends:', error);
                setLoading(false);
            }
        };
        fetchTrends();
    }, []);

    if (loading) return <div className="h-64 bg-gray-50 rounded-xl animate-pulse"></div>;

    const maxVisitors = Math.max(...trendData.map(d => d.visitors));

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="text-orange-500" size={20} />
                Hourly Footfall Trends
            </h3>

            <div className="flex-1 flex items-end gap-2 h-64 w-full overflow-x-auto pb-4 custom-scrollbar">
                {trendData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 min-w-[30px] group">
                        {/* Tooltip */}
                        <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 absolute -mt-10 z-10">
                            {data.visitors} visitors
                            <div className="border-t border-gray-600 mt-1 pt-1 opacity-70">
                                {data.capacity} cap
                            </div>
                        </div>

                        {/* Bar */}
                        <div className="w-full h-full flex items-end relative">
                            {/* Capacity Line Marker (Invisible helper for proportional height) */}
                            {/* Actual Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(data.visitors / maxVisitors) * 100}%` }}
                                transition={{ duration: 0.8, delay: index * 0.05 }}
                                className={`w-full rounded-t-md opacity-80 hover:opacity-100 transition-all cursor-pointer ${data.visitors > data.capacity ? 'bg-red-400' : 'bg-orange-400'
                                    }`}
                            />
                        </div>

                        <span className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-top-left translate-y-2">
                            {data.time}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-400 rounded-sm"></div> Normal Flow
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded-sm"></div> Capacity Exceeded
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
