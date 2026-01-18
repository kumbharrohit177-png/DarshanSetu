import React, { createContext, useState, useEffect, useContext } from 'react';

import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initialize user from localStorage synchronously to avoid "flicker"
    const [user, setUser] = useState(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            return storedUser || null;
        } catch (error) {
            console.error("AuthContext: Error parsing user from local storage", error);
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            console.log("AuthContext: Checking stored user:", storedUser);

            if (storedUser && storedUser.token) {
                try {
                    console.log("AuthContext: Verifying token with backend...");
                    // Verify token with backend
                    const { data } = await api.get('/auth/profile');
                    console.log("AuthContext: Token verified. Updating user data.");

                    // IMPORTANT: Merge with existing token, don't lose it if profile API doesn't return it
                    setUser({ ...data, token: storedUser.token });
                } catch (error) {
                    console.error("AuthContext: Session verification failed:", error);

                    // Only logout if 401 (Unauthorized) or 403 (Forbidden)
                    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                        console.log("AuthContext: Token invalid. Logging out.");
                        localStorage.removeItem('user');
                        setUser(null);
                    } else {
                        // For other errors (network, 500), keep the user logged in but maybe log warning
                        console.log("AuthContext: Keeping user logged in despite verification error (network/server issue?).");
                    }
                }
            } else {
                console.log("AuthContext: No valid stored user found.");
                setUser(null);
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const googleLogin = async (userData) => {
        const { data } = await api.post('/auth/google/demo', userData);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const { data } = await api.post('/auth/register', userData);
        // Do not auto-login: localStorage.setItem('user', JSON.stringify(data));
        // setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
