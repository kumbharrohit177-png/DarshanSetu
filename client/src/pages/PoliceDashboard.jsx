import React from 'react';
import CrowdStats from '../components/CrowdStats';
import IncidentList from '../components/IncidentList';
import { useAuth } from '../context/AuthContext';
import { Map, ShieldAlert } from 'lucide-react';

const PoliceDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Police Command Center</h1>

            <CrowdStats />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <Map size={24} className="text-blue-600" />
                            Live Surveillance Map
                        </h2>
                        <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center text-gray-500 font-bold">
                            [Interactive Zone Map / Heatmap]
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <ShieldAlert size={24} className="text-red-600" />
                            Incident Feed
                        </h2>
                        <IncidentList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoliceDashboard;
