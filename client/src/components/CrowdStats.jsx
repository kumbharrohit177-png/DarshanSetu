import React from 'react';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';

const CrowdStats = () => {
    // Placeholder stats - in real app, fetch from API
    const stats = [
        { title: 'Current Footfall', value: '1,245', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Crowd Density', value: 'High', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100', warning: true },
        { title: 'Active Incidents', value: '2', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className={`bg-white rounded-xl shadow-md p-6 flex items-center justify-between ${stat.warning ? 'ring-2 ring-orange-400' : ''}`}>
                    <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.title}</p>
                        <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                        <stat.icon size={24} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CrowdStats;
