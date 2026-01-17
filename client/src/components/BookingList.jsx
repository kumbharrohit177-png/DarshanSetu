import React from 'react';
import { Ticket, Clock, MapPin } from 'lucide-react';

const BookingList = ({ bookings }) => {
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
                // If slot is null (deleted), we might still want to show it as "Cancelled/Invalid" or skip it.
                // For now, let's skip to prevent crash.
                if (!booking.slot) return null;

                return (
                    <div key={booking._id} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-primary-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition hover:shadow-lg">
                        <div>
                            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                                <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded uppercase tracking-wide">
                                    {booking.status}
                                </span>
                                <h3>{booking.slot.date ? new Date(booking.slot.date).toLocaleDateString() : 'Date N/A'}</h3>
                            </div>
                            <div className="mt-2 space-y-1 text-gray-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{booking.slot.startTime} - {booking.slot.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span>{booking.slot.temple ? booking.slot.temple.name : (booking.slot.zone || 'Unknown')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2 bg-gray-50 p-3 rounded-lg">
                            <div className="h-20 w-20 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.qrCode || booking._id}`}
                                    alt="Booking QR Code"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="text-xs font-mono text-gray-500">{booking.qrCode ? booking.qrCode.split('-').pop() : 'REF'}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BookingList;
