import React from 'react';
import { Ticket, Clock, MapPin, Baby, Accessibility, HelpingHand, ShieldCheck } from 'lucide-react';

import api from '../utils/api';

const BookingList = ({ bookings, onRefresh }) => {
    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await api.put(`/bookings/${bookingId}/cancel`);
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Failed to cancel booking", error);
            alert("Failed to cancel booking.");
        }
    };

    const getPriorityDetails = (type) => {
        switch (type) {
            case 'elderly':
                return { label: 'Senior Citizen Priority', icon: HelpingHand, color: 'bg-purple-100 text-purple-800 border-purple-200' };
            case 'differently-abled':
                return { label: 'Special Access (Divyang)', icon: Accessibility, color: 'bg-blue-100 text-blue-800 border-blue-200' };
            case 'women-with-children':
                return { label: 'Mother & Child Lane', icon: Baby, color: 'bg-pink-100 text-pink-800 border-pink-200' };
            default:
                return null;
        }
    };

    if (!bookings || bookings.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                <Ticket size={48} className="mx-auto mb-4 opacity-20" />
                <p>You haven't made any bookings yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map(booking => {
                // Determine if slot data is available
                if (!booking.slot) return null;

                const isCancelled = booking.status === 'cancelled';
                const isCompleted = booking.status === 'completed' || booking.status === 'checked-in';
                const canCancel = !isCancelled && !isCompleted;

                const priority = getPriorityDetails(booking.specialAssistance);

                return (
                    <div key={booking._id} className={`bg-white rounded-xl shadow-md p-0 border-l-[6px] ${isCancelled ? 'border-gray-400 opacity-75' : (priority ? 'border-amber-500' : 'border-primary-500')} flex flex-col sm:flex-row justify-between items-stretch transition hover:shadow-lg relative overflow-hidden group`}>
                        {/* Status Badge */}
                        {isCancelled && (
                            <div className="absolute top-0 right-0 bg-gray-200 text-gray-600 text-xs font-bold px-3 py-1 rounded-bl-lg z-20">
                                CANCELLED
                            </div>
                        )}

                        {/* Priority Banner */}
                        {!isCancelled && priority && (
                            <div className="absolute top-0 right-0 flex items-center gap-1 text-xs font-bold px-4 py-1.5 rounded-bl-xl z-20 bg-amber-100 text-amber-900 border-b border-l border-amber-200 shadow-sm">
                                <ShieldCheck size={14} className="text-amber-700" />
                                PRIORITY PASS
                            </div>
                        )}

                        <div className="flex-grow p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${priority ? 'bg-amber-100 text-amber-800' : 'bg-primary-50 text-primary-700 border border-primary-100'}`}>
                                        {booking.status}
                                    </span>
                                    <h4 className="text-xs font-mono text-gray-400 font-semibold tracking-widest uppercase">
                                        Booking ID: {booking._id.slice(-8).toUpperCase()}
                                    </h4>
                                </div>

                                <div className="flex items-baseline gap-2 mb-4">
                                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight">
                                        {booking.slot.date ? new Date(booking.slot.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : 'Date N/A'}
                                    </h3>
                                </div>

                                {/* Special Assistance Chip */}
                                {!isCancelled && priority && (
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border mb-4 ${priority.color}`}>
                                        <priority.icon size={14} />
                                        {priority.label}
                                    </div>
                                )}

                                <div className="space-y-3 mt-2 text-sm">
                                    <div className="flex items-start gap-3 group/item">
                                        <Clock size={16} className="text-gray-400 mt-0.5 group-hover/item:text-primary-600 transition-colors" />
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Slot Booked</p>
                                            <p className="font-bold text-gray-800 text-base">{booking.slot.startTime} - {booking.slot.endTime}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 group/item">
                                    <MapPin size={16} className="text-gray-400 mt-0.5 group-hover/item:text-primary-600 transition-colors" />
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Temple & Location</p>
                                        <p className="font-bold text-gray-800 text-base leading-tight">
                                            {booking.slot.temple ? booking.slot.temple.name : (booking.slot.zone || 'Unknown')}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-0.5">
                                            {booking.slot.temple ? booking.slot.temple.location : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Family Members Display */}
                                {booking.members && booking.members.length > 0 && (
                                    <div className="pt-2 border-t border-gray-100 mt-2">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                                            <Accessibility size={12} />
                                            Group Members ({booking.members.length + 1})
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700 border border-gray-200">
                                                You (Primary)
                                            </span>
                                            {booking.members.map((member, idx) => (
                                                <span key={idx} className="text-xs bg-orange-50 px-2 py-1 rounded text-orange-800 border border-orange-100 font-medium">
                                                    {member.name} {member.age ? `(${member.age})` : ''}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cancel Button */}
                            {canCancel && (
                                <button
                                    onClick={() => handleCancel(booking._id)}
                                    className="mt-6 text-sm text-red-600 hover:text-red-700 hover:underline font-semibold self-start"
                                >
                                    Cancel Booking
                                </button>
                            )}
                        </div>
                    </div>

                        {/* Ticket Perforated Line Visual */ }
                <div className="hidden sm:block w-[2px] bg-gray-200 border-l border-dashed border-gray-400 relative my-4">
                    <div className="absolute -top-6 -left-2 w-4 h-4 rounded-full bg-gray-50 z-10"></div>
                    <div className="absolute -bottom-6 -left-2 w-4 h-4 rounded-full bg-gray-50 z-10"></div>
                </div>

                {/* QR Section */ }
                {
                    !isCancelled && (
                        <div className="sm:w-48 bg-gray-50 p-6 flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-dashed border-gray-200">
                            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200">
                                <div className="h-32 w-32 bg-white flex items-center justify-center overflow-hidden mix-blend-multiply">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.qrCode || booking._id}`}
                                        alt="Booking QR Code"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400 mt-3 text-center break-all max-w-[120px] select-all">
                                {booking._id}
                            </span>
                        </div>
                    )
                }
                    </div>
    );
})}
        </div >
    );
};

export default BookingList;
