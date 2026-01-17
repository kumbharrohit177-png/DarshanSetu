import React from 'react';
import CrowdStats from '../components/CrowdStats';
import SlotManager from '../components/SlotManager';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Settings } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Temple Management Dashboard</h1>
                    <p className="text-gray-600">Overview of crowd status and operations</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                        <BarChart3 size={16} /> Reports
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                        <Settings size={16} /> Settings
                    </button>
                </div>
            </div>

            <CrowdStats />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Placeholder for a large chart or heatmap */}
                    <div className="bg-white rounded-xl shadow-md p-6 h-full min-h-[400px]">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Live Crowd Analytics</h3>
                        <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center text-gray-500">
                            [Interactive Heatmap / Graph Placeholder]
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <SlotManager />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
