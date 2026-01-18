import React, { useState } from 'react';
import { Send, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import api from '../utils/api';

const AlertBroadcastPanel = () => {
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('info');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // success, error

    const handleSendAlert = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        setStatus(null);

        try {
            await api.post('/alerts/send', {
                message,
                severity,
                zone: 'All Zones' // hardcoded for now, can be dynamic later
            });
            setStatus('success');
            setMessage('');
            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            console.error('Failed to send alert:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Send size={18} className="text-primary-600" />
                    Broadcast Crowd Alert
                </h3>
            </div>

            <div className="p-5">
                <form onSubmit={handleSendAlert} className="space-y-4">
                    {/* Severity Selection */}
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => setSeverity('info')}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${severity === 'info'
                                    ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Info size={20} className="mb-1" />
                            <span className="text-xs font-medium">Info</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSeverity('warning')}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${severity === 'warning'
                                    ? 'bg-amber-50 border-amber-200 text-amber-700 ring-1 ring-amber-500'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <AlertTriangle size={20} className="mb-1" />
                            <span className="text-xs font-medium">Warning</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setSeverity('critical')}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${severity === 'critical'
                                    ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-500'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <ShieldAlert size={20} className="mb-1" />
                            <span className="text-xs font-medium">Critical</span>
                        </button>
                    </div>

                    {/* Message Input */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter alert message for all pilgrims..."
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 min-h-[100px] text-sm"
                            maxLength={200}
                        />
                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-400">{message.length}/200</span>
                            {status === 'success' && <span className="text-xs text-green-600 font-medium">Alert Sent!</span>}
                            {status === 'error' && <span className="text-xs text-red-600 font-medium">Failed to send.</span>}
                        </div>
                    </div>

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={loading || !message.trim()}
                        className="w-full py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Sending...' : 'Broadcast Alert'}
                        {!loading && <Send size={16} />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AlertBroadcastPanel;
