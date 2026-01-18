import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';
import { AlertCircle, MapPin, Clock } from 'lucide-react';

const IncidentList = ({ type, onDispatch, onTrack }) => {
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const { data } = await api.get('/incidents');
                // Filter incidents: specific type matches OR security (always relevant), AND exclude resolved
                const filtered = data.filter(i =>
                    (i.status !== 'resolved') &&
                    (!type || i.type === type || i.type === 'security')
                );
                setIncidents(filtered);
            } catch (error) {
                console.error("Failed to fetch incidents", error);
            }
        };

        fetchIncidents();

        // Real-time listener
        socket.on('new-incident', (newIncident) => {
            // Adjust filter logic as needed
            if (!type || newIncident.type === type || newIncident.type === 'security') {
                setIncidents(prev => [newIncident, ...prev]);
            }
        });

        socket.on('incident-update', (updatedIncident) => {
            if (updatedIncident.status === 'resolved') {
                // Remove from list if resolved
                setIncidents(prev => prev.filter(i => i._id !== updatedIncident._id));
            } else {
                setIncidents(prev => prev.map(i => i._id === updatedIncident._id ? updatedIncident : i));
            }
        });

        return () => {
            socket.off('new-incident');
            socket.off('incident-update');
        };
    }, [type]);

    const handleUpdateStatus = async (id, status) => {
        // Optimistic update
        if (status === 'resolved') {
            setIncidents(prev => prev.filter(i => i._id !== id));
        }

        try {
            const { data } = await api.put(`/incidents/${id}/status`, { status });
            // Socket will confirm, but we already removed it.
        } catch (error) {
            console.error("Failed to update status", error);
            // If failed, maybe fetch incidents again or show error?
            // For now, simple console log.
        }
    };

    return (
        <div className="space-y-4 max-h-[500px] overflow-y-auto px-1 custom-scrollbar">
            {incidents.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                    No active incidents reported.
                </div>
            ) : (
                incidents.map(incident => (
                    <div key={incident._id} className={`p-4 rounded-xl shadow-sm border-l-4 transition-all ${incident.status === 'resolved' ? 'bg-gray-50 border-green-500 opacity-75' : 'bg-white border-red-600 shadow-md'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex-grow">
                                <h4 className={`font-bold flex items-center gap-2 ${incident.status === 'resolved' ? 'text-green-700' : 'text-red-700'}`}>
                                    <AlertCircle size={18} />
                                    {incident.type ? incident.type.toUpperCase() : 'ALERT'}
                                    {incident.status === 'resolved' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Resolved</span>}
                                    {incident.status === 'investigating' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Investigating</span>}
                                </h4>
                                <p className="text-gray-700 mt-1 text-sm">{incident.description}</p>
                                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 font-mono">
                                    <span className="flex items-center gap-1"><MapPin size={12} /> {incident.location}</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(incident.createdAt).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                                {incident.status !== 'resolved' && (
                                    <>
                                        {onDispatch && incident.status === 'open' && (
                                            <button
                                                onClick={() => onDispatch(incident)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-105"
                                            >
                                                Dispatch
                                            </button>
                                        )}
                                        {onTrack && (
                                            <button
                                                onClick={() => onTrack(incident._id)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:scale-105 mt-2"
                                            >
                                                Track
                                            </button>
                                        )}

                                        <div className="flex gap-2">
                                            {incident.status === 'open' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(incident._id, 'investigating')}
                                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs border border-gray-300"
                                                >
                                                    Ack
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleUpdateStatus(incident._id, 'resolved')}
                                                className="bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs border border-green-200"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #f3f4f6; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #d1d5db; 
                  border-radius: 2px;
                }
            `}</style>
        </div>
    );
};

export default IncidentList;
