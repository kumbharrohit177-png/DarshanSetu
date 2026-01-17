import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                    <span>TempleFlow</span>
                </Link>
                <nav className="flex items-center gap-6">
                    {/* Public Nav Items - Only show on Home Page */}
                    {location.pathname === '/' && (
                        <>
                            <div className="hidden md:flex items-center gap-6 mr-4">
                                <button
                                    onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                >
                                    News
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Book Tickets
                                </button>
                                <button
                                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                >
                                    About Us
                                </button>
                                <button
                                    onClick={() => alert("Thank you for your interest in donating! This feature is coming soon.")}
                                    className="bg-amber-500 text-white px-5 py-2 rounded-full hover:bg-amber-600 transition font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Donate
                                </button>
                            </div>
                            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
                        </>
                    )}

                    {user ? (
                        <>
                            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1 text-gray-600 hover:text-primary-600"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition font-medium shadow-sm"
                            >
                                Login
                            </Link>
                            <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition font-medium shadow-sm">
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
