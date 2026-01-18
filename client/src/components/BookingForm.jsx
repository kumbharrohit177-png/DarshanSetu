import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';
import { Calendar, Clock, User } from 'lucide-react';

const BookingForm = ({ onBookingSuccess, templeId }) => {
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [specialAssistance, setSpecialAssistance] = useState('none');
    const [ticketCount, setTicketCount] = useState(1);
    const [members, setMembers] = useState([]); // Array of { name: '', age: '', gender: '' }
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

    // Handle ticket count change
    const handleTicketCountChange = (count) => {
        const newCount = parseInt(count);
        setTicketCount(newCount);

        // Adjust members array size (Count - 1, since 1 is the primary user)
        const additionalMembersNeeded = newCount - 1;
        if (additionalMembersNeeded > members.length) {
            // Add new empty members
            const newMembers = [...members];
            for (let i = members.length; i < additionalMembersNeeded; i++) {
                newMembers.push({ name: '', age: '', gender: 'male' });
            }
            setMembers(newMembers);
        } else if (additionalMembersNeeded < members.length) {
            // Remove excess members
            setMembers(members.slice(0, additionalMembersNeeded));
        }
    };

    // Handle member field change
    const handleMemberChange = (index, field, value) => {
        const updatedMembers = [...members];
        updatedMembers[index] = { ...updatedMembers[index], [field]: value };
        setMembers(updatedMembers);
    };

    const handleBook = async () => {
        if (!selectedSlot) return;

        // Validate members
        if (ticketCount > 1) {
            for (let i = 0; i < members.length; i++) {
                if (!members[i].name.trim()) {
                    setError(`Please enter the name for Member ${i + 1}`);
                    return;
                }
            }
        }

        setLoading(true);
        setError('');
        try {
            // Calculate total needed
            const totalPeople = ticketCount;
            if (selectedSlot.bookedCount + totalPeople > selectedSlot.capacity) {
                throw new Error(`Only ${selectedSlot.capacity - selectedSlot.bookedCount} slots remaining.`);
            }

            // Sanitize members data
            const sanitizedMembers = members.map(m => ({
                name: m.name,
                age: m.age ? parseInt(m.age) : null,
                gender: m.gender || 'male'
            }));

            await api.post('/bookings', {
                slotId: selectedSlot._id,
                members: sanitizedMembers,
                specialAssistance: specialAssistance
            });
            setLoading(false);
            onBookingSuccess();
            // Reset form
            setDate('');
            setSlots([]);
            setSelectedSlot(null);
            setMembers([]);
            setTicketCount(1);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Booking failed');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <Calendar className="text-orange-600" />
                Book Darshan Slots
            </h2>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium border border-red-200">{error}</div>}

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Date</label>
                    <input
                        type="date"
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2.5 border"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {date && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Available Slots</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {slots.length === 0 ? (
                                <p className="text-gray-500 text-sm col-span-3 italic">No slots found for this date.</p>
                            ) : (
                                slots.map(slot => (
                                    <button
                                        key={slot._id}
                                        disabled={slot.bookedCount >= slot.capacity || slot.isLocked}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`p-3 rounded-lg border text-sm flex flex-col items-center justify-center transition-all duration-200
                                    ${selectedSlot?._id === slot._id
                                                ? 'border-orange-600 bg-orange-50 text-orange-800 ring-2 ring-orange-500 ring-opacity-50 shadow-md'
                                                : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                                            }
                                    ${(slot.bookedCount >= slot.capacity || slot.isLocked) ? 'opacity-50 cursor-not-allowed bg-gray-100 grayscale' : ''}
                                `}
                                    >
                                        <span className="font-bold text-base">{slot.startTime} - {slot.endTime}</span>
                                        <span className={`text-xs mt-1 font-medium px-2 py-0.5 rounded-full ${slot.capacity - slot.bookedCount < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {slot.isLocked ? 'LOCKED' : (slot.capacity - slot.bookedCount > 0 ? `${slot.capacity - slot.bookedCount} left` : 'FULL')}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {selectedSlot && (
                    <div className="space-y-5 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                        {/* Ticket Count Selection */}
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <User size={18} />
                                Number of Tickets (Max 4)
                            </label>
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => handleTicketCountChange(num)}
                                        className={`flex-1 py-2 rounded-md font-bold transition-all ${ticketCount === num
                                            ? 'bg-orange-600 text-white shadow-md transform scale-105'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-orange-100'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-orange-700 mt-2">
                                {ticketCount === 1 ? 'Booking for yourself only.' : `Booking for yourself + ${ticketCount - 1} family members.`}
                            </p>
                        </div>

                        {/* Family Member Details */}
                        {ticketCount > 1 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-gray-700">Enter Family Member Details</h3>
                                {members.map((member, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 relative">
                                        <div className="col-span-12 sm:col-span-6">
                                            <input
                                                type="text"
                                                placeholder={`Member ${index + 1} Name *`}
                                                value={member.name}
                                                onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                                className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                                            />
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <input
                                                type="number"
                                                placeholder="Age"
                                                value={member.age}
                                                onChange={(e) => handleMemberChange(index, 'age', e.target.value)}
                                                className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                                            />
                                        </div>
                                        <div className="col-span-6 sm:col-span-3">
                                            <select
                                                value={member.gender}
                                                onChange={(e) => handleMemberChange(index, 'gender', e.target.value)}
                                                className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-orange-500 focus:border-orange-500"
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Priority Access / Special Assistance</label>
                            <select
                                value={specialAssistance}
                                onChange={(e) => setSpecialAssistance(e.target.value)}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 p-2.5 border"
                            >
                                <option value="none">None (General Entry)</option>
                                <option value="elderly">Elderly (Senior Citizens)</option>
                                <option value="differently-abled">Differently Abled (Divyang)</option>
                                <option value="women-with-children">Women with Children (Infants)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Select if any member in your group requires priority lane access.</p>
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={handleBook}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3.5 rounded-lg font-bold text-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99]"
                            >
                                {loading ? 'Processing Booking...' : `Confirm Booking (${ticketCount} Tickets)`}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingForm;
