import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
    User,
    UserCheck,
    Activity,
    AlertTriangle,
    BarChart3,
    Settings
} from 'lucide-react';
import ZoneDensityPanel from '../components/admin/ZoneDensityPanel';
import SlotControlPanel from '../components/admin/SlotControlPanel';
import AnalyticsCharts from '../components/admin/AnalyticsCharts';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBookings: 0,
        checkedInCount: 0,
        activeCrowd: 0,
        occupancyRate: 0
    });

    // Temple State Lifted from ZoneDensityPanel
    const [temples, setTemples] = useState([]);
    const [selectedTemple, setSelectedTemple] = useState('');

    useEffect(() => {
        const fetchTemples = async () => {
            try {
                const { data } = await api.get('/temples');
                setTemples(data);
                if (data.length > 0) {
                    setSelectedTemple(data[0]._id);
                }
            } catch (error) {
                console.error('Error fetching temples:', error);
            }
        };
        fetchTemples();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const url = selectedTemple
                    ? `/analytics/dashboard?templeId=${selectedTemple}`
                    : '/analytics/dashboard';
                const { data } = await api.get(url);
                setStats(data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };

        if (selectedTemple) {
            fetchStats();
        }

        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [selectedTemple]);

    return (
        <div className="min-h-screen bg-pattern-mandala pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-orange-100 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-extrabold font-serif text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-red-600 flex items-center gap-2">
                            Temple Command Center
                        </h1>
                        <p className="text-orange-800 text-sm font-medium mt-1">Operational Oversight & Crowd Logistics</p>
                    </div>

                    <div className="flex gap-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-full shadow-lg shadow-green-200 flex items-center gap-2 text-white border border-green-400">
                            <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                            <span className="text-xs font-bold tracking-wider">SYSTEM LIVE</span>
                        </div>
                    </div>
                </div>

                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Bookings', value: stats.totalBookings, icon: User, color: 'bg-blue-50 text-blue-600' },
                        { label: 'Checked In', value: stats.checkedInCount, icon: UserCheck, color: 'bg-green-50 text-green-600' },
                        { label: 'Active Crowd', value: stats.activeCrowd, icon: Activity, color: 'bg-orange-50 text-orange-600' },
                        { label: 'Occupancy', value: `${stats.occupancyRate}%`, icon: AlertTriangle, color: stats.occupancyRate > 80 ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl shadow-lg shadow-orange-100/50 border border-orange-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-3xl font-serif font-bold text-gray-800 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl shadow-inner ${stat.color} bg-opacity-20`}>
                                    <stat.icon size={28} strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Analytics & Zones */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Zone Density */}
                        <ZoneDensityPanel
                            temples={temples}
                            selectedTemple={selectedTemple}
                            setSelectedTemple={setSelectedTemple}
                        />

                        {/* Charts */}
                        <div className="h-[400px]">
                            <AnalyticsCharts />
                        </div>
                    </div>

                    {/* Right Column: Controls */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Slot Manager */}
                        <div className="h-[600px]">
                            <SlotControlPanel selectedTemple={selectedTemple} />
                        </div>

                        {/* Quick Actions (Crowd Protocols) */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Crowd Protocols</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                    <div>
                                        <div className="font-semibold text-orange-900 text-sm">Mandatory Booking</div>
                                        <div className="text-xs text-orange-700">Enforce 100% online booking</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                                    <div>
                                        <div className="font-semibold text-red-900 text-sm">Emergency Halt</div>
                                        <div className="text-xs text-red-700">Stop all new entries</div>
                                    </div>
                                    <button className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700">
                                        ACTIVATE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
