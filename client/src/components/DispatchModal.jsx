import React, { useState, useEffect } from 'react';
import { Ambulance, MapPin, X, Navigation, Clock, Zap, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const DispatchModal = ({ incident, resources, onClose }) => {
    const [selectedResource, setSelectedResource] = useState(null);
    const [loading, setLoading] = useState(false);
    const [prioritizedResources, setPrioritizedResources] = useState([]);
    const [useAutoRouting, setUseAutoRouting] = useState(true);
    const [loadingPriorities, setLoadingPriorities] = useState(false);

    const availableResources = resources.filter(r => r.status === 'available' || r.status === 'en_route');

    // Fetch prioritized resources if incident has coordinates
    useEffect(() => {
        const fetchPrioritized = async () => {
            if (!incident) return;

            // Try to extract coordinates from location string if not in incident.coordinates
            let incidentCoords = incident.coordinates;
            if (!incidentCoords && incident.location) {
                const gpsMatch = incident.location.match(/GPS: ([0-9.-]+),\s*([0-9.-]+)/);
                if (gpsMatch) {
                    incidentCoords = {
                        lat: parseFloat(gpsMatch[1]),
                        lng: parseFloat(gpsMatch[2])
                    };
                } else if (incident.location.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) {
                    const parts = incident.location.split(',').map(s => s.trim());
                    incidentCoords = {
                        lat: parseFloat(parts[0]),
                        lng: parseFloat(parts[1])
                    };
                }
            }

            // Only fetch prioritized if we have coordinates
            if (incidentCoords) {
                setLoadingPriorities(true);
                try {
                    const { data } = await api.get(`/incidents/${incident._id}/resources`);
                    setPrioritizedResources(data);
                    // Auto-select best resource if auto-routing is enabled
                    if (useAutoRouting && data.length > 0) {
                        setSelectedResource(data[0].resource);
                    }
                } catch (error) {
                    console.error("Failed to fetch prioritized resources", error);
                    // Continue with manual selection if prioritized fetch fails
                } finally {
                    setLoadingPriorities(false);
                }
            }
        };

        fetchPrioritized();
    }, [incident, useAutoRouting]);

    // Use prioritized resources if available, otherwise fallback to simple sorting
    const sortedResources = prioritizedResources.length > 0
        ? prioritizedResources.map(pr => pr.resource).filter(r => r) // Filter out any null resources
        : [...availableResources].sort((a, b) => {
            if (a.type === 'ambulance' && b.type !== 'ambulance') return -1;
            if (a.type !== 'ambulance' && b.type === 'ambulance') return 1;
            return 0;
        });

    const handleDispatch = async () => {
        // Allow dispatch if we have resources, even without selection (auto-routing will handle it)
        if (sortedResources.length === 0) {
            alert("No available resources to dispatch. Please ensure medical resources are seeded and available.");
            return;
        }

        // If auto-routing is off, require manual selection
        if (!useAutoRouting && !selectedResource) {
            alert("Please select a resource or enable auto-routing");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post(`/incidents/${incident._id}/dispatch`, {
                resourceId: useAutoRouting ? null : selectedResource?._id,
                useAutoRouting: useAutoRouting
            });

            // Show success message
            if (response.data && response.data.resource) {
                const resource = response.data.resource;
                const routeInfo = response.data.routeInfo;
                let message = `${resource.name} has been dispatched to the incident location.`;
                if (routeInfo && routeInfo.estimatedTime && !isNaN(routeInfo.estimatedTime)) {
                    const etaMinutes = Math.ceil(routeInfo.estimatedTime / 60);
                    message += `\nEstimated arrival: ${etaMinutes} minute(s).`;
                }
                alert(message);
            }
            onClose();
        } catch (error) {
            console.error("Dispatch failed", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to dispatch resource";
            alert(`Dispatch Failed: ${errorMessage}\n\nPlease ensure medical resources are available. You may need to seed resources first.`);
        } finally {
            setLoading(false);
        }
    };

    const formatDistance = (meters) => {
        if (meters < 1000) return `${Math.round(meters)}m`;
        return `${(meters / 1000).toFixed(1)}km`;
    };

    const formatTime = (seconds) => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${minutes}m ${secs}s`;
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white border border-gray-200 text-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
                    <Ambulance size={24} />
                    Dispatch Unit
                </h2>

                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm text-gray-500 uppercase font-bold mb-1">Incident</h3>
                    <p className="font-semibold text-gray-900 text-lg">{incident.type?.toUpperCase() || 'INCIDENT'}</p>
                    {incident.severity && (
                        <p className="text-xs mt-1">
                            <span className={`px-2 py-0.5 rounded font-bold ${incident.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                    incident.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                        incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-blue-100 text-blue-700'
                                }`}>
                                {incident.severity?.toUpperCase() || 'UNKNOWN'}
                            </span>
                        </p>
                    )}
                    <p className="text-gray-600 text-sm flex items-center gap-1 mt-2">
                        <MapPin size={12} className="text-red-500" /> {incident.location}
                    </p>
                </div>

                {/* Auto-routing toggle */}
                <div className="mb-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <input
                        type="checkbox"
                        id="autoRouting"
                        checked={useAutoRouting}
                        onChange={(e) => {
                            setUseAutoRouting(e.target.checked);
                            if (!e.target.checked && sortedResources.length > 0) {
                                // When disabling auto-routing, select first resource by default
                                setSelectedResource(sortedResources[0]);
                            }
                        }}
                        className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor="autoRouting" className="text-sm font-semibold text-blue-900 cursor-pointer flex items-center gap-2">
                        <Zap size={16} />
                        Auto-select best resource (Priority Routing)
                    </label>
                </div>

                <h3 className="text-sm text-gray-500 mb-3 uppercase font-bold">
                    {useAutoRouting && prioritizedResources.length > 0 ? 'Recommended Resources' : 'Select Available Unit'}
                </h3>

                <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                    {loadingPriorities ? (
                        <p className="text-gray-500 italic text-center py-4">Calculating optimal routes...</p>
                    ) : sortedResources.length === 0 ? (
                        <div className="text-center py-4">
                            <p className="text-gray-500 italic mb-2">No available units found.</p>
                            <p className="text-xs text-gray-400">Resources may need to be seeded. Check the medical dashboard.</p>
                        </div>
                    ) : (
                        sortedResources.map((resource, index) => {
                            const priorityData = prioritizedResources.find(pr => pr && pr.resource && pr.resource._id === resource._id);
                            const isSelected = useAutoRouting && prioritizedResources.length > 0 ? index === 0 : selectedResource?._id === resource._id;

                            return (
                                <div
                                    key={resource._id}
                                    onClick={() => {
                                        if (!useAutoRouting) {
                                            setSelectedResource(resource);
                                        }
                                    }}
                                    className={`p-3 rounded-lg border transition-all ${isSelected
                                            ? 'bg-blue-50 border-blue-500 shadow-sm ring-2 ring-blue-300'
                                            : 'bg-white border-gray-200 hover:border-gray-400'
                                        } ${!useAutoRouting ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-grow">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold">{resource.name}</p>
                                                {isSelected && useAutoRouting && (
                                                    <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded font-bold">
                                                        RECOMMENDED
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">{resource.location?.zone || 'Unknown Zone'}</p>
                                        </div>
                                        <span className="text-[10px] bg-gray-100 px-2 py-1 rounded uppercase tracking-wider text-gray-600">
                                            {resource.type.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {priorityData && (
                                        <div className="mt-2 pt-2 border-t border-gray-200 space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Navigation size={12} className="text-blue-500" />
                                                <span>Distance: <strong>{formatDistance(priorityData.distance)}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Clock size={12} className="text-green-500" />
                                                <span>ETA: <strong>{formatTime(priorityData.estimatedTime)}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <TrendingUp size={12} className="text-orange-500" />
                                                <span>Traffic: <strong>{(priorityData.trafficPenalty * 100).toFixed(0)}%</strong> delay</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-gray-500">Priority Score:</span>
                                                <span className="font-bold text-blue-600">{Math.round(priorityData.priorityScore)}/100</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                <button
                    onClick={handleDispatch}
                    disabled={(sortedResources.length === 0) || loading || loadingPriorities}
                    className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider transition-all shadow-md ${((sortedResources.length === 0) || loading || loadingPriorities)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white shadow-red-200 active:scale-[0.98]'
                        }`}
                >
                    {loading ? 'Dispatching...' : loadingPriorities ? 'Calculating...' : sortedResources.length === 0 ? 'NO RESOURCES AVAILABLE' : 'CONFIRM DISPATCH'}
                </button>
            </div>
        </div>
    );
};

export default DispatchModal;
