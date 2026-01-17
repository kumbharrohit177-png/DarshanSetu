import React from 'react';
import IncidentList from '../components/IncidentList';
import { useAuth } from '../context/AuthContext';
import { Ambulance, Activity } from 'lucide-react';

const MedicalDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Medical Response Unit</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium">Available Ambulances</h3>
                    <p className="text-3xl font-bold text-green-600">4 / 6</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium">First Aid Units</h3>
                    <p className="text-3xl font-bold text-blue-600">12 Active</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <h3 className="text-gray-500 text-sm font-medium">Critical Cases</h3>
                    <p className="text-3xl font-bold text-red-600">0</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <Activity size={24} className="text-red-600" />
                            Medical Incidents
                        </h2>
                        <IncidentList type="medical" />
                    </div>
                </div>

                <div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                            <Ambulance size={24} className="text-green-600" />
                            Asset Tracking
                        </h2>
                        <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center text-gray-500">
                            [Live Ambulance Tracker Map]
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalDashboard;
