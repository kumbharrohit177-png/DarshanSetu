import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import api from '../utils/api';

const SOSButton = () => {
    const [loading, setLoading] = useState(false);
    const [alertSent, setAlertSent] = useState(false);

    const handleSOS = async () => {
        if (!window.confirm("Are you sure you want to send an SOS alert?")) return;

        setLoading(true);
        // Immediate visual feedback
        setAlertSent(true);

        // Don't hide the alert too quickly, keep it until we know more or for a set time
        const alertTimer = setTimeout(() => setAlertSent(false), 8000);

        try {
            let location = null;

            // Attempt to get location - Race against a timeout
            try {
                location = await new Promise((resolve) => {
                    const timeoutId = setTimeout(() => resolve(null), 2500); // 2.5s max wait

                    if (!navigator.geolocation) {
                        clearTimeout(timeoutId);
                        resolve(null);
                        return;
                    }

                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            clearTimeout(timeoutId);
                            resolve(`${pos.coords.latitude}, ${pos.coords.longitude}`);
                        },
                        (err) => {
                            clearTimeout(timeoutId);
                            console.warn("Geo error:", err);
                            resolve(null);
                        },
                        { enableHighAccuracy: true, maximumAge: 10000, timeout: 2000 }
                    );
                });
            } catch (e) {
                console.warn("Location flow error", e);
            }

            // Send incident report
            await api.post('/incidents', {
                type: 'security',
                location: location, // Controller will fallback if null
                description: 'Emergency SOS Alert from Pilgrim'
            });

        } catch (error) {
            console.error("SOS Error:", error);
            alert("Failed to send SOS to server. Please call emergency services.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {alertSent && (
                <div className="absolute bottom-20 right-0 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg mb-2 whitespace-nowrap animate-bounce font-bold tracking-wide">
                    SOS SIGNAL SENT!
                </div>
            )}
            <button
                onClick={handleSOS}
                disabled={loading}
                className={`rounded-full p-5 shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-1 border-4 border-white ${loading ? 'bg-gray-400 animate-pulse' : 'bg-red-600 hover:bg-red-700'} text-white`}
            >
                <AlertTriangle size={32} className={loading ? 'animate-spin' : ''} />
                <span className="font-bold text-xs">SOS</span>
            </button>
        </div>
    );
};

export default SOSButton;
