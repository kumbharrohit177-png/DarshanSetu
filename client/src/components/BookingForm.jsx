import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';
import { Calendar, Clock, User } from 'lucide-react';

const BookingForm = ({ onBookingSuccess, templeId }) => {
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [specialAssistance, setSpecialAssistance] = useState('none');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchSlots = async () => {
        try {
            const { data } = await api.get(`/slots?date=${date}&temple=${templeId}`);
            setSlots(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (date && templeId) {
            fetchSlots();
        }
    }, [date, templeId]);

    const handleBook = async () => {
        if (!selectedSlot) return;
        setLoading(true);
        setError('');
        try {
            await api.post('/bookings', {
                slotId: selectedSlot._id,
                members: members,
                specialAssistance: specialAssistance
            });
            setLoading(false);
            onBookingSuccess();
            // Reset form
            setDate('');
            setSlots([]);
            setSelectedSlot(null);
            setMembers([]);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <Calendar className="text-primary-600" />
                Book a Darshan Slot
            </h2>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <input
                        type="date"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {date && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {slots.length === 0 ? (
                                <p className="text-gray-500 text-sm col-span-3">No slots found for this date.</p>
                            ) : (
                                slots.map(slot => (
                                    <button
                                        key={slot._id}
                                        disabled={slot.bookedCount >= slot.capacity || slot.isLocked}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`p-3 rounded-lg border text-sm flex flex-col items-center justify-center transition-all
                                    ${selectedSlot?._id === slot._id
                                                ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500 ring-opacity-50'
                                                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                            }
                                    ${(slot.bookedCount >= slot.capacity || slot.isLocked) ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}
                                `}
                                    >
                                        <span className="font-semibold">{slot.startTime} - {slot.endTime}</span>
                                        <span className={`text-xs mt-1 ${slot.capacity - slot.bookedCount < 10 ? 'text-red-500' : 'text-green-600'}`}>
                                            {slot.isLocked ? 'LOCKED' : (slot.capacity - slot.bookedCount > 0 ? `${slot.capacity - slot.bookedCount} left` : 'FULL')}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {selectedSlot && (
                    <div className="space-y-4 pt-4 border-t">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Access / Special Assistance</label>
                            <select
                                value={specialAssistance}
                                onChange={(e) => setSpecialAssistance(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2 border"
                            >
                                <option value="none">None (General Entry)</option>
                                <option value="elderly">Elderly (Senior Citizens)</option>
                                <option value="differently-abled">Differently Abled (Divyang)</option>
                                <option value="women-with-children">Women with Children (Infants)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Select if you require priority lane access.</p>
                        </div>

                        <div className="">
                            <button
                                onClick={handleBook}
                                disabled={loading}
                                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition shadow-md hover:shadow-lg disabled:opacity-70"
                            >
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingForm;
