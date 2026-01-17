import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';
import { AlertCircle, MapPin, Clock } from 'lucide-react';

const IncidentList = ({ type }) => {
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const { data } = await api.get('/incidents');
                const filtered = type ? data.filter(i => i.type === type || i.type === 'security') : data;
                setIncidents(filtered);
            } catch (error) {
                console.error("Failed to fetch incidents", error);
            }
        };

        fetchIncidents();

        // Real-time listener
        socket.on('new-incident', (newIncident) => {
            if (!type || newIncident.type === type || newIncident.type === 'security') {
                setIncidents(prev => [newIncident, ...prev]);
            }
        });

        return () => {
            socket.off('new-incident');
        };
    }, [type]);

    return (
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {incidents.length === 0 ? (
                <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg">
                    No active incidents reported.
                </div>
            ) : (
                incidents.map(incident => (
                    <div key={incident._id} className="bg-red-50 border-l-4 border-red-600 p-4 rounded-md shadow-sm animate-pulse-once">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-red-800 flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    {incident.type ? incident.type.toUpperCase() : 'ALERT'} ALERT
                                </h4>
                                <p className="text-red-900 mt-1">{incident.description}</p>
                                <div className="mt-2 flex items-center gap-4 text-xs text-red-700">
                                    <span className="flex items-center gap-1"><MapPin size={12} /> {incident.location}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(incident.createdAt).toLocaleTimeString()}</span>
                                </div>
                            </div>
                            <button className="bg-white text-red-600 border border-red-200 px-3 py-1 rounded text-xs font-semibold hover:bg-red-50">
                                Acknowledge
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default IncidentList;
