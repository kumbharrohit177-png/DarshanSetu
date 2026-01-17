import React from 'react';
import { useAuth } from '../context/AuthContext';

const DebugSession = () => {
    const { user, logout } = useAuth();
    const storedString = localStorage.getItem('user');

    if (!user && !storedString) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg shadow-2xl z-[100] max-w-sm text-xs font-mono">
            <h3 className="font-bold text-yellow-400 mb-2">DEBUG: Session Info</h3>
            <p><strong>User State:</strong> {user ? user.name : 'null'}</p>
            <p className="truncate"><strong>LocalStorage:</strong> {storedString ? 'Present' : 'Empty'}</p>
            <button
                onClick={logout}
                className="mt-2 bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700 w-full font-bold"
            >
                FORCE LOGOUT / CLEAR STORAGE
            </button>
        </div>
    );
};

export default DebugSession;
