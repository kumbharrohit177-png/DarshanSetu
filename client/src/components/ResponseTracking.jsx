import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Activity, CheckCircle, AlertCircle, Navigation } from 'lucide-react';
import api from '../utils/api';
import socket from '../utils/socket';

const ResponseTracking = ({ incidentId }) => {
    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const { data } = await api.get(`/incidents/${incidentId}`);
                setIncident(data);
            } catch (error) {
                console.error("Failed to fetch incident", error);
            } finally {
                setLoading(false);
            }
        };

        if (incidentId) {
            fetchIncident();
        }

        // Listen for real-time updates
        socket.on('incident-update', (updatedIncident) => {
            if (updatedIncident._id === incidentId) {
                setIncident(updatedIncident);
            }
        });

        return () => {
            socket.off('incident-update');
        };
    }, [incidentId]);

    const handleStatusUpdate = async (status) => {
        try {
            await api.put(`/incidents/${incidentId}/response-status`, { status });
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update response status");
        }
    };

    const formatTime = (seconds) => {
        if (!seconds) return 'N/A';
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${minutes}m ${secs}s`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-gray-100 text-gray-700';
            case 'en_route': return 'bg-yellow-100 text-yellow-700';
            case 'on_scene': return 'bg-blue-100 text-blue-700';
            case 'resolved': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'reported': return <AlertCircle size={14} />;
            case 'dispatched': return <Navigation size={14} />;
            case 'en_route': return <Activity size={14} />;
            case 'arrived': return <MapPin size={14} />;
            case 'on_scene': return <MapPin size={14} />;
            case 'resolved': return <CheckCircle size={14} />;
            default: return <Activity size={14} />;
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading response tracking...</div>;
    }

    if (!incident) {
        return <div className="text-center py-8 text-gray-500">Incident not found</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="text-red-600" size={20} />
                        Response Tracking
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Incident #{incident._id.slice(-6)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(incident.status)}`}>
                    {incident.status.replace('_', ' ')}
                </span>
            </div>

            {/* Response Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Response Time</p>
                    <p className="text-lg font-bold text-gray-900">
                        {incident.totalResponseTime ? formatTime(incident.totalResponseTime) : 'In Progress'}
                    </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Dispatched</p>
                    <p className="text-lg font-bold text-gray-900">
                        {incident.dispatchedAt 
                            ? new Date(incident.dispatchedAt).toLocaleTimeString()
                            : 'Pending'}
                    </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Arrived</p>
                    <p className="text-lg font-bold text-gray-900">
                        {incident.arrivedAt 
                            ? new Date(incident.arrivedAt).toLocaleTimeString()
                            : 'En Route'}
                    </p>
                </div>
            </div>

            {/* Response Log Timeline */}
            <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock size={16} />
                    Response Timeline
                </h4>
                <div className="space-y-3">
                    {incident.responseLog && incident.responseLog.length > 0 ? (
                        [...incident.responseLog].reverse().map((log, index) => (
                            <div key={index} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    {getActionIcon(log.action)}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900 capitalize">{log.action.replace('_', ' ')}</p>
                                            {log.notes && (
                                                <p className="text-xs text-gray-600 mt-1">{log.notes}</p>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    {log.location && (
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            <MapPin size={10} />
                                            {log.location.lat?.toFixed(4)}, {log.location.lng?.toFixed(4)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No response log entries yet</p>
                    )}
                </div>
            </div>

            {/* Status Update Actions */}
            {incident.status !== 'resolved' && (
                <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-bold text-gray-700 mb-3">Update Status</h4>
                    <div className="flex gap-2 flex-wrap">
                        {incident.status === 'en_route' && (
                            <button
                                onClick={() => handleStatusUpdate('on_scene')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                                Mark On Scene
                            </button>
                        )}
                        {incident.status === 'on_scene' && (
                            <button
                                onClick={() => handleStatusUpdate('resolved')}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                                Mark Resolved
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResponseTracking;
