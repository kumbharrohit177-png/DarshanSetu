import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Lock, Unlock, User, ChevronRight, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SlotControlPanel = ({ selectedTemple }) => {
    const [slots, setSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editCapacity, setEditCapacity] = useState('');

    useEffect(() => {
        if (selectedTemple) {
            fetchSlots();
        }
    }, [selectedDate, selectedTemple]);

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/slots?date=${selectedDate}&temple=${selectedTemple}`);
            setSlots(data);
        } catch (error) {
            console.error('Error fetching slots:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleLock = async (slotId, currentStatus) => {
        try {
            await api.put(`/slots/${slotId}`, { isLocked: !currentStatus });
            // Optimistic update
            setSlots(slots.map(s => s._id === slotId ? { ...s, isLocked: !currentStatus } : s));
        } catch (error) {
            console.error('Error toggling lock:', error);
            alert('Failed to update lock status');
        }
    };

    const handleCapacityUpdate = async (slotId) => {
        try {
            await api.put(`/slots/${slotId}`, { capacity: parseInt(editCapacity) });
            setSlots(slots.map(s => s._id === slotId ? { ...s, capacity: parseInt(editCapacity) } : s));
            setEditingId(null);
        } catch (error) {
            console.error('Error updating capacity:', error);
            alert('Failed to update capacity');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Lock className="text-purple-600" size={20} />
                    Slot Management
                </h3>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {loading ? (
                    <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-lg" />)}</div>
                ) : slots.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">No slots configured for this date</div>
                ) : (
                    <div className="space-y-3">
                        {slots.map((slot) => (
                            <motion.div
                                key={slot._id}
                                layout
                                className={`p-4 rounded-lg border transition-all ${slot.isLocked ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-orange-300'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${slot.isLocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {slot.isLocked ? <Lock size={18} /> : <Unlock size={18} />}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 text-lg">{slot.startTime} - {slot.endTime}</div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                <User size={14} />
                                                <span>{slot.bookedCount} / {slot.capacity} Booked</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Capacity Edit Mode */}
                                        {editingId === slot._id ? (
                                            <div className="flex items-center gap-2 animate-fadeIn">
                                                <input
                                                    type="number"
                                                    value={editCapacity}
                                                    onChange={(e) => setEditCapacity(e.target.value)}
                                                    className="w-20 border rounded px-2 py-1 text-sm"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleCapacityUpdate(slot._id)}
                                                    className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600"
                                                >
                                                    <Save size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingId(slot._id);
                                                    setEditCapacity(slot.capacity.toString());
                                                }}
                                                className="text-xs text-blue-600 hover:underline disabled:text-gray-400"
                                                disabled={slot.isLocked}
                                            >
                                                Adjust Cap
                                            </button>
                                        )}

                                        {/* Lock Toggle */}
                                        <button
                                            onClick={() => toggleLock(slot._id, slot.isLocked)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${slot.isLocked
                                                ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                }`}
                                        >
                                            {slot.isLocked ? 'Unlock' : 'Lock Slot'}
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${slot.isLocked ? 'bg-gray-400' : 'bg-orange-500'}`}
                                        style={{ width: `${Math.min((slot.bookedCount / slot.capacity) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SlotControlPanel;
