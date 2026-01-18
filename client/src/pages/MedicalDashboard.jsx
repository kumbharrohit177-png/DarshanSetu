import React, { useState, useEffect } from 'react';
import IncidentList from '../components/IncidentList';
import ResourceStatusPanel from '../components/ResourceStatusPanel';
import LiveMedicalMap from '../components/LiveMedicalMap';
import DispatchModal from '../components/DispatchModal';
import ResponseTracking from '../components/ResponseTracking';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import socket from '../utils/socket';
import { Activity, ShieldPlus, Radio, FileText } from 'lucide-react';

const MedicalDashboard = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [pilgrims, setPilgrims] = useState({}); // Map userId -> location data
    const [loading, setLoading] = useState(true);

    // Dispatch Modal State
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [trackingIncidentId, setTrackingIncidentId] = useState(null);

    // Initial Data Fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resData, incData] = await Promise.all([
                    api.get('/medical/resources'),
                    api.get('/incidents?type=medical')
                ]);
                setResources(resData.data);
                setIncidents(incData.data);

                // Auto-seed resources if none exist
                if (resData.data.length === 0) {
                    try {
                        await api.post('/medical/seed');
                        // Refetch after seeding
                        const newResData = await api.get('/medical/resources');
                        setResources(newResData.data);
                    } catch (seedError) {
                        console.warn("Could not auto-seed resources:", seedError);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch medical dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Real-time Listeners
    useEffect(() => {
        socket.on('medical-resource-update', (updatedResource) => {
            setResources(prev => prev.map(r => r._id === updatedResource._id ? updatedResource : r));
        });

        socket.on('new-incident', (newIncident) => {
            if (newIncident.type === 'medical' || newIncident.type === 'security') {
                setIncidents(prev => [newIncident, ...prev]);
            }
        });

        socket.on('incident-update', (updatedIncident) => {
            setIncidents(prev => prev.map(i => i._id === updatedIncident._id ? updatedIncident : i));
        });

        // Pilgrim Location Updates
        socket.on('pilgrim-location-update', (data) => {
            setPilgrims(prev => ({
                ...prev,
                [data.userId]: data
            }));
        });

        // Medical resource location updates
        socket.on('medical-resource-location-update', (data) => {
            setResources(prev => prev.map(r =>
                r._id === data.resourceId
                    ? { ...r, location: data.location }
                    : r
            ));
        });

        return () => {
            socket.off('medical-resource-update');
            socket.off('new-incident');
            socket.off('incident-update');
            socket.off('pilgrim-location-update');
            socket.off('medical-resource-location-update');
        };
    }, []);

    const handleResourceUpdate = (updatedResource) => {
        setResources(prev => prev.map(r => r._id === updatedResource._id ? updatedResource : r));
    };

    const openDispatchModal = (incident) => {
        setSelectedIncident(incident);
        setShowDispatchModal(true);
    };

    const closeDispatchModal = () => {
        setShowDispatchModal(false);
        setSelectedIncident(null);
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">Loading Command Center...</div>;

    const navStats = {
        total: resources.length,
        available: resources.filter(r => r.status === 'available').length,
        activeIncidents: incidents.filter(i => i.status !== 'resolved').length
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
            {/* Light Mode Header with Spiritual Context */}
            <div className="bg-white/90 backdrop-blur-md border-b border-red-100 sticky top-0 z-30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-50 p-2 rounded-lg border border-red-100">
                                <ShieldPlus className="text-red-600" size={32} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 font-serif tracking-tight">
                                    Medical Response Unit
                                </h1>
                                <p className="text-[11px] text-red-800/60 uppercase font-bold tracking-widest">Seva & Safety Division</p>
                            </div>
                        </div>
                        <div className="flex gap-12">
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Fleet Status</p>
                                <p className="text-3xl font-bold font-mono text-green-600 leading-none mt-1">
                                    {navStats.available}<span className="text-sm text-gray-300">/{navStats.total}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Active Alerts</p>
                                <p className={`text-3xl font-bold font-mono leading-none mt-1 flex justify-end gap-2 items-center ${navStats.activeIncidents > 0 ? 'text-red-600 animate-pulse' : 'text-gray-400'}`}>
                                    {navStats.activeIncidents > 0 && <Radio size={16} className="animate-ping" />}
                                    {navStats.activeIncidents}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
                {/* Background Pattern for Content Area */}
                <div className="absolute inset-0 bg-pattern-mandala opacity-40 pointer-events-none -z-10 bg-fixed"></div>

                {/* Main Content Grid - Allowed to grow for scrolling */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[800px] h-auto pb-10">

                    {/* Left Panel: Resource Status (3 cols) */}
                    <div className="lg:col-span-3 h-full">
                        <ResourceStatusPanel resources={resources} onUpdate={handleResourceUpdate} />
                    </div>

                    {/* Middle Panel: Live Map (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col h-[700px] lg:h-auto relative group shadow-xl rounded-xl overflow-hidden border border-gray-200">
                        <LiveMedicalMap
                            resources={resources}
                            incidents={incidents.filter(i => i.status !== 'resolved')}
                            pilgrims={Object.values(pilgrims)}
                            onDispatch={openDispatchModal}
                        />
                    </div>

                    {/* Right Panel: Incidents & Tracking (4 cols) - Widened */}
                    <div className="lg:col-span-4 h-full flex flex-col gap-4">
                        {/* Incidents List */}
                        <div className="flex-1 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col min-h-0">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center rounded-t-xl">
                                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Activity size={20} className="text-red-600" />
                                    LIVE WIRE
                                </h2>
                                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 font-bold animate-pulse">LIVE</span>
                            </div>
                            <div className="flex-grow overflow-hidden p-2">
                                <IncidentList
                                    type="medical"
                                    onDispatch={openDispatchModal}
                                    onTrack={(incidentId) => setTrackingIncidentId(incidentId)}
                                />
                            </div>
                        </div>

                        {/* Response Tracking */}
                        {trackingIncidentId && (
                            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-h-[300px] overflow-y-auto">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <FileText size={18} className="text-blue-600" />
                                        Tracking
                                    </h3>
                                    <button
                                        onClick={() => setTrackingIncidentId(null)}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        Close
                                    </button>
                                </div>
                                <ResponseTracking incidentId={trackingIncidentId} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dispatch Modal */}
            {showDispatchModal && selectedIncident && (
                <DispatchModal
                    incident={selectedIncident}
                    resources={resources}
                    onClose={closeDispatchModal}
                />
            )}
        </div>
    );
};

export default MedicalDashboard;
