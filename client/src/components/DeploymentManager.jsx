import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';
import { Plus, Trash2, MapPin, Shield, Truck, Stethoscope, User } from 'lucide-react';

const DeploymentManager = () => {
    const [deployments, setDeployments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'police',
        quantity: 1,
        location: '',
        notes: ''
    });

    const fetchDeployments = async () => {
        try {
            const { data } = await api.get('/deployments');
            setDeployments(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch deployments", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeployments();

        socket.on('deployment-update', (updatedDeployment) => {
            setDeployments(prev => {
                const index = prev.findIndex(d => d._id === updatedDeployment._id);
                if (index > -1) {
                    const newDeployments = [...prev];
                    newDeployments[index] = updatedDeployment;
                    return newDeployments;
                }
                return [updatedDeployment, ...prev];
            });
        });

        return () => socket.off('deployment-update');
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this deployment?')) return;
        try {
            await api.delete(`/deployments/${id}`);
            setDeployments(prev => prev.filter(d => d._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/deployments', formData);
            setDeployments(prev => [data, ...prev]);
            setShowForm(false);
            setFormData({ type: 'police', quantity: 1, location: '', notes: '' });
        } catch (error) {
            console.error('Failed to add deployment', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'police': return <Shield className="text-blue-600" />;
            case 'barricade': return <Truck className="text-orange-600" />;
            case 'medical': return <Stethoscope className="text-red-600" />;
            default: return <User className="text-gray-600" />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Resource Deployment</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={16} /> Deploy Unit
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                className="w-full border rounded-md p-2"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="police">Police Unit</option>
                                <option value="barricade">Barricade</option>
                                <option value="medical">Medical Team</option>
                                <option value="volunteer">Volunteer Group</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full border rounded-md p-2"
                                value={formData.quantity}
                                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                className="w-full border rounded-md p-2"
                                placeholder="e.g. North Gate, Zone A"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="text-gray-500 hover:text-gray-700 px-3 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Confirm Deployment
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {loading ? <p className="text-gray-500 text-center">Loading resources...</p> : deployments.map(dept => (
                    <div key={dept._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                {getIcon(dept.type)}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 capitalize flex items-center gap-2">
                                    {dept.type}
                                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">x{dept.quantity}</span>
                                </h4>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <MapPin size={12} /> {dept.location}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(dept._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {deployments.length === 0 && !loading && (
                    <p className="text-center text-gray-500 py-4">No active deployments.</p>
                )}
            </div>
        </div>
    );
};

export default DeploymentManager;
