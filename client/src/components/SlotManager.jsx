import React, { useState } from 'react';
import api from '../utils/api';
import { Plus, Save } from 'lucide-react';

const SlotManager = () => {
    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: '',
        capacity: 100,
        zone: 'Main Temple'
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await api.post('/slots', formData);
            setMessage('Slot created successfully!');
            setFormData({ ...formData, startTime: '', endTime: '' }); // Reset times but keep date/zone
        } catch (error) {
            setMessage('Failed to create slot: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
                <Plus size={20} className="text-primary-600" />
                Create Slots
            </h2>
            {message && (
                <div className={`p-3 rounded mb-4 text-sm ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" name="date" required value={formData.date} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Zone</label>
                        <select name="zone" value={formData.zone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
                            <option value="Main Temple">Main Temple</option>
                            <option value="Inner Sanctum">Inner Sanctum</option>
                            <option value="North Gate">North Gate</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input type="time" name="startTime" required value={formData.startTime} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                        <input type="time" name="endTime" required value={formData.endTime} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Capacity</label>
                        <input type="number" name="capacity" required min="1" value={formData.capacity} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                    <Save size={18} />
                    {loading ? 'Saving...' : 'Create Slot'}
                </button>
            </form>
        </div>
    );
};

export default SlotManager;
