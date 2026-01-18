import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, ShieldAlert, X, CheckCircle } from 'lucide-react';

// ... (inside component)

const getIcon = (severity) => {
    switch (severity) {
        case 'critical':
            return <ShieldAlert size={24} />;
        case 'warning':
            return <AlertTriangle size={24} />;
        case 'success':
            return <CheckCircle size={24} />;
        case 'info':
        default:
            return <Info size={24} />;
    }
};

// ... (render logic)

<h4 className="font-bold uppercase tracking-wider text-xs opacity-90 mb-1">
    {alert.severity === 'warning' ? '⚠️ POLICE WARNING' : (alert.severity === 'success' ? '🚑 HELP ON THE WAY' : 'ℹ️ POLICE NOTICE')}
</h4>
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../utils/socket';
import { useAuth } from '../context/AuthContext';

const NotificationToast = () => {
    const [alerts, setAlerts] = useState([]);

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    const { user } = useAuth(); // Get current user context

    useEffect(() => {
        const handleAlert = (data) => {
            const id = Date.now();
            setAlerts(prev => [...prev, { ...data, id }]);

            if (data.severity !== 'critical') {
                setTimeout(() => removeAlert(id), 10000);
            }
        };

        const handlePilgrimNotification = (data) => {
            // Only show if it's for THIS user, or if no target specified (broadcast)
            // We use loose comparison because IDs might be string vs objectId
            if (user && data.targetUserId && user.id !== data.targetUserId && user._id !== data.targetUserId) {
                return;
            }

            // If it's a success/dispatch message, maybe we want a special style?
            // For now passing it as 'info' or 'success' if we supported it.
            // Let's force severity to be 'success'-like if needed, or just standard info.
            handleAlert({ ...data, severity: 'success' });
        };

        socket.on('crowd-alert', handleAlert);
        socket.on('pilgrim-notification', handlePilgrimNotification);

        return () => {
            socket.off('crowd-alert', handleAlert);
            socket.off('pilgrim-notification', handlePilgrimNotification);
        };
    }, [user]);

    const getStyles = (severity) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-600 text-white border-red-700';
            case 'warning':
                return 'bg-amber-500 text-white border-amber-600';
            case 'success':
                return 'bg-green-600 text-white border-green-700';
            case 'info':
            default:
                return 'bg-blue-600 text-white border-blue-700';
        }
    };

    const getIcon = (severity) => {
        switch (severity) {
            case 'critical':
                return <ShieldAlert size={24} />;
            case 'warning':
                return <AlertTriangle size={24} />;
            case 'success':
                return <ShieldAlert size={24} />; // Reusing Shield or maybe Check? Let's use Info for now or import Check
            case 'info':
            default:
                return <Info size={24} />;
        }
    };

    return (
        <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            <AnimatePresence>
                {alerts.map((alert) => (
                    <motion.div
                        key={alert.id}
                        initial={alert.severity !== 'info' ? { opacity: 0, scale: 0.5 } : { opacity: 0, x: 50, scale: 0.9 }}
                        animate={alert.severity !== 'info' ? { opacity: 1, scale: 1 } : { opacity: 1, x: 0, scale: 1 }}
                        exit={alert.severity !== 'info' ? { opacity: 0, scale: 0.5 } : { opacity: 0, x: 20, scale: 0.95 }}
                        className={
                            alert.severity !== 'info'
                                ? `fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4` // Modal Overlay for Critical & Warning
                                : `pointer-events-auto p-4 rounded-lg shadow-2xl border-l-4 flex items-start gap-4 ${getStyles(alert.severity)}` // Toast for Info
                        }
                    >
                        {alert.severity !== 'info' ? (
                            // CRITICAL / WARNING / SUCCESS ALERT MODAL DESIGN
                            <div className={`${alert.severity === 'critical' ? 'bg-red-600 border-red-500' :
                                (alert.severity === 'success' ? 'bg-green-600 border-green-500' : 'bg-amber-500 border-amber-400')
                                } text-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full border-8 border-opacity-30 flex flex-col items-center text-center relative animate-pulse`}>
                                {alert.severity === 'critical' ? <ShieldAlert size={80} className="mb-4 text-white drop-shadow-lg" /> :
                                    (alert.severity === 'success' ? <CheckCircle size={80} className="mb-4 text-white drop-shadow-lg" /> : <AlertTriangle size={80} className="mb-4 text-white drop-shadow-lg" />)
                                }
                                <h2 className="text-4xl font-black uppercase tracking-widest mb-4 drop-shadow-md">
                                    {alert.severity === 'critical' ? '🚨 POLICE CRITICAL ALERT 🚨' :
                                        (alert.severity === 'success' ? '🚑 HELP ON THE WAY 🚑' : '⚠️ POLICE WARNING ⚠️')
                                    }
                                </h2>
                                <p className="text-2xl font-bold leading-relaxed mb-6">
                                    {alert.message}
                                </p>
                                <span className={`text-sm font-mono opacity-80 ${alert.severity === 'critical' ? 'bg-red-800/50' :
                                    (alert.severity === 'success' ? 'bg-green-800/50' : 'bg-amber-700/50')
                                    } px-4 py-1 rounded-full mb-6`}>
                                    AUTHORITY: {alert.severity === 'success' ? 'MEDICAL RESPONSE UNIT' : 'DASHBOARD COMMAND'} • {new Date(alert.timestamp).toLocaleTimeString()}
                                </span>
                                <div className="w-full bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                                        <span>Dispatched</span>
                                        <span className="animate-pulse text-green-300">En Route</span>
                                        <span>On Scene</span>
                                    </div>
                                    <div className="relative h-4 bg-black/20 rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-green-400 w-1/2 animate-[shimmer_2s_infinite] shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                                        {/* Moving Ambulance Icon */}
                                        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-3 transition-all duration-[5000ms] ease-linear">
                                            <span className="text-lg filter drop-shadow">🚑</span>
                                        </div>
                                    </div>
                                    <p className="text-center text-xs mt-2 font-mono opacity-70">
                                        Live updates: Ambulance is moving towards your location.
                                    </p>
                                </div>

                                <button
                                    onClick={() => removeAlert(alert.id)}
                                    className="bg-white text-green-700 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-bold uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95"
                                >
                                    I AM WAITING HERE
                                </button>
                            </div>
                        ) : (
                            // STANDARD TOAST CONTENT (Info Only)
                            <>
                                <div className="shrink-0 mt-0.5 animate-bounce">
                                    {getIcon(alert.severity)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold uppercase tracking-wider text-xs opacity-90 mb-1">
                                        {alert.severity === 'warning' ? '⚠️ POLICE WARNING' : (alert.severity === 'success' ? '🚑 HELP ON THE WAY' : 'ℹ️ POLICE NOTICE')}
                                    </h4>
                                    <p className="text-sm font-medium leading-relaxed">
                                        {alert.message}
                                    </p>
                                    <span className="text-[10px] opacity-75 mt-2 block">
                                        Zone: {alert.zone} • {new Date(alert.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeAlert(alert.id)}
                                    className="text-white/60 hover:text-white transition"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationToast;
