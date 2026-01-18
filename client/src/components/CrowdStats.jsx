import React, { useState, useEffect } from 'react';
import { User, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '../utils/api';
import socket from '../utils/socket';

const CrowdStats = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        density: 'Low',
        activeIncidents: 0
    });

    const fetchStats = async () => {
        try {
            // In a real app, you'd have a dedicated stats endpoint.
            // For now, we'll approximate with multiple calls or a new endpoint.
            // Let's assume we add a dashboard-stats endpoint later. 
            // For now, we will use mock data for simplicity in this step, or try to hit existing endpoints.

            // Actually, let's just make a simple call to get incident count.
            const incidentsRes = await api.get('/incidents?status=active');

            // For bookings, we might need a new endpoint or just show a static number for today if we don't have a global count endpoint.
            // Let's placeholder the booking count for now until we add a stats endpoint.
            setStats(prev => ({
                ...prev,
                activeIncidents: incidentsRes.data.length
            }));

        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    useEffect(() => {
        fetchStats();

        // Listen for real-time updates
        socket.on('slot-update', () => fetchStats());
        socket.on('incident-update', () => fetchStats());
        socket.on('new-incident', () => fetchStats());

        return () => {
            socket.off('slot-update');
            socket.off('incident-update');
            socket.off('new-incident');
        };
    }, []);

    const statItems = [
        { title: 'Current Footfall', value: '1,245', icon: User, color: 'text-blue-600', bg: 'bg-blue-100' }, // Mock for now
        { title: 'Crowd Density', value: 'Normal', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100', warning: false },
        { title: 'Active Incidents', value: stats.activeIncidents, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {statItems.map((stat, index) => (
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
