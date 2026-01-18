import React, { useState } from 'react';
import { Ambulance, Activity, CheckCircle, AlertTriangle, Power, MapPin, Phone } from 'lucide-react';
import api from '../utils/api';

const ResourceStatusPanel = ({ resources, onUpdate }) => {
    const [toggling, setToggling] = useState(null);

    const toggleStatus = async (resource) => {
        setToggling(resource._id);
        const newStatus = resource.status === 'available' ? 'busy' : 'available';

        try {
            const { data } = await api.patch(`/medical/resources/${resource._id}/status`, { status: newStatus });
            if (onUpdate) onUpdate(data);
        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setToggling(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 h-full flex flex-col text-gray-900">
            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2 text-gray-800">
                    <Ambulance size={20} className="text-blue-600" />
                    Resource Command
                </h2>
                <div className="flex gap-2 text-[10px] font-bold uppercase">
                    <span className="flex items-center gap-1 text-green-600"><span className="w-2 h-2 rounded-full bg-green-500"></span> Active</span>
                </div>
            </div>

            <div className="overflow-y-auto flex-grow p-2 space-y-2 custom-scrollbar">
                {resources.map(res => (
                    <div
                        key={res._id}
                        className={`p-3 rounded-lg border flex flex-col gap-2 transition-all ${res.status === 'available'
                                ? 'bg-white border-gray-200 hover:border-green-400 shadow-sm'
                                : 'bg-red-50 border-red-100'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${res.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {res.type === 'ambulance' ? <Ambulance size={18} /> : <Activity size={18} />}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{res.name}</p>
                                    <p className="text-[10px] uppercase text-gray-500 font-bold">{res.type} • {res.location?.zone || 'Unknown Zone'}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => toggleStatus(res)}
                                disabled={toggling === res._id}
                                className={`p-2 rounded-lg transition-all ${res.status === 'available'
                                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-200'
                                        : 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-200'
                                    }`}
                                title={res.status === 'available' ? "Mark as Busy" : "Mark as Available"}
                            >
                                <Power size={18} className={toggling === res._id ? "animate-spin" : ""} />
                            </button>
                        </div>

                        <div className="text-xs text-gray-500 flex flex-col gap-1 pl-12">
                            <div className="flex items-center gap-2">
                                <MapPin size={12} />
                                {res.location?.zone || 'Unknown Zone'}
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={12} />
                                {res.contactNumber}
                            </div>
                        </div>

                        {res.status === 'busy' && (
                            <div className="mt-1 ml-12 text-xs bg-red-50 text-red-700 p-2 rounded border border-red-200 flex items-center gap-2">
                                <AlertTriangle size={12} /> Responding to incident
                            </div>
                        )}
                    </div>
                ))}
            </div>
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

export default ResourceStatusPanel;
