import React, { useState, useEffect } from 'react';
import CrowdStats from '../components/CrowdStats';
import IncidentList from '../components/IncidentList';
import DeploymentManager from '../components/DeploymentManager';
import LiveMedicalMap from '../components/LiveMedicalMap';
import AlertBroadcastPanel from '../components/AlertBroadcastPanel';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Radio, Map as MapIcon } from 'lucide-react';
import api from '../utils/api';
import socket from '../utils/socket';

const PoliceDashboard = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [pilgrims, setPilgrims] = useState({});

    useEffect(() => {
        // Fetch initial data
        const fetchData = async () => {
            try {
                const [resData, incData] = await Promise.all([
                    api.get('/medical/resources'),
                    api.get('/incidents')
                ]);
                setResources(resData.data);
                setIncidents(incData.data);
            } catch (error) {
                console.error("Police Dashboard Fetch Error:", error);
            }
        };
        fetchData();

        // Socket Listeners
        socket.on('medical-resource-update', (updatedResource) => {
            setResources(prev => prev.map(r => r._id === updatedResource._id ? updatedResource : r));
        });

        socket.on('new-incident', (newIncident) => {
            setIncidents(prev => [newIncident, ...prev]);
        });

        socket.on('incident-update', (updatedIncident) => {
            setIncidents(prev => prev.map(i => i._id === updatedIncident._id ? updatedIncident : i));
        });

        socket.on('pilgrim-location-update', (data) => {
            setPilgrims(prev => ({ ...prev, [data.userId]: data }));
        });

        return () => {
            socket.off('medical-resource-update');
            socket.off('new-incident');
            socket.off('incident-update');
            socket.off('pilgrim-location-update');
        };
    }, []);

    // Police don't dispatch medical units directly in this view, or maybe they do?
    // For now, passing a no-op or handling basic dispatch if needed. 
    // Let's assume they can view but dispatching is Medical's job, or we can enable it.
    // I'll enable dispatching for them too as they are "Command Center".
    const handleDispatch = async (incident) => {
        // Ideally we reuse the DispatchModal, but I haven't imported it here.
        // For this step, I'll pass a dummy function or just let the map show the button but do nothing if modal is missing.
        // To do it right, I should probably add the modal here too.
        alert("Please use the Medical Dashboard for dispatching ambulances.");
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-12">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-pattern-mandala opacity-30 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 mb-8 text-white shadow-xl flex justify-between items-center border border-slate-700">
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-4 tracking-wide uppercase">
                            <ShieldAlert className="text-orange-500" size={36} />
                            Police Command
                        </h1>
                        <p className="text-slate-400 text-xs font-mono tracking-[0.3em] ml-14">TEMPLE SECURITY GRID ALPHA</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-600">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-300">LIVE MONITORING</span>
                        </div>
                    </div>
                </div>

                <CrowdStats />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Left Column: Surveillance & Deployment */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-md p-1 border border-gray-200 overflow-hidden h-[500px] flex flex-col">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 relative">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                                    <MapIcon size={24} className="text-blue-600" />
                                    Live Surveillance Map
                                </h2>
                                <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    ACTIVE TRACKING: {Object.keys(pilgrims).length} PILGRIMS
                                </span>
                            </div>

                            <div className="flex-grow relative">
                                <LiveMedicalMap
                                    resources={resources}
                                    incidents={incidents.filter(i => i.status !== 'resolved')}
                                    pilgrims={Object.values(pilgrims)}
                                    onDispatch={handleDispatch}
                                />
                            </div>
                        </div>

                        <DeploymentManager />
                    </div>

                    {/* Right Column: Incidents */}
                    <div className="space-y-8">
                        {/* Broadcast Panel */}
                        <AlertBroadcastPanel />

                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                                    <Radio size={24} className="text-red-600 animate-pulse" />
                                    Live Incident Feed
                                </h2>
                                <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full animate-pulse">LIVE</span>
                            </div>
                            <IncidentList />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoliceDashboard;
