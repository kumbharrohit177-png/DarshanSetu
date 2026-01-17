import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import api from '../utils/api';

const SOSButton = () => {
    const [loading, setLoading] = useState(false);
    const [alertSent, setAlertSent] = useState(false);

    const getPosition = () => {
        return new Promise((resolve, reject) => {
            if (!("geolocation" in navigator)) {
                reject(new Error("Geolocation not supported"));
            }
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    };

    const handleSOS = async () => {
        if (!window.confirm("Are you sure you want to send an SOS alert? This will notify security and medical teams immediately.")) return;

        setLoading(true);
        try {
            let location = 'Unknown Location (No GPS)';

            try {
                // Try to get location with timeout
                const position = await new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(() => reject(new Error("Location timeout")), 5000);

                    if (!("geolocation" in navigator)) {
                        clearTimeout(timeoutId);
                        reject(new Error("Geolocation not supported"));
                    }

                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            clearTimeout(timeoutId);
                            resolve(pos);
                        },
                        (err) => {
                            clearTimeout(timeoutId);
                            reject(err);
                        }
                    );
                });
                location = `${position.coords.latitude}, ${position.coords.longitude}`;
            } catch (locError) {
                console.warn("Location retrieval failed, sending SOS with unknown location:", locError);
                // Continue execution to send SOS even if location fails
            }

            // Send incident report
            await api.post('/incidents', {
                type: 'security',
                location: location,
                description: 'Emergency SOS Alert from Pilgrim'
            });

            setAlertSent(true);
            setTimeout(() => setAlertSent(false), 5000);

        } catch (error) {
            console.error("SOS Error:", error);
            alert('Failed to send SOS. Please call emergency services at 100/108 directly.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {alertSent && (
                <div className="absolute bottom-20 right-0 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg mb-2 whitespace-nowrap animate-bounce">
                    SOS Sent! Help is on the way.
                </div>
            )}
            <button
                onClick={handleSOS}
                disabled={loading}
                className={`rounded-full p-6 shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex flex-col items-center justify-center gap-1 border-4 border-white ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white`}
            >
                <AlertTriangle size={32} />
                <span className="font-bold text-xs">SOS</span>
            </button>
        </div>
    );
};

export default SOSButton;
