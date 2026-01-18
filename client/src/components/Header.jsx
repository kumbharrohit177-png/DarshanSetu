import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DonationModal from './DonationModal';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Hover state for the "Gooey" pill effect
    const [hoveredNav, setHoveredNav] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    const [scrolled, setScrolled] = React.useState(false);

    // Determine if we should show the transparent hero style
    const isLanding = location.pathname === '/';
    // If we are NOT on landing, or if we have scrolled, use the solid/glass style
    const showSolid = !isLanding || scrolled;

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = ['News', 'About Us', 'Book Tickets'];

    // Hide Header on Login and Register pages
    if (['/login', '/register'].includes(location.pathname)) {
        return null;
    }

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleNavClick = (item) => {
        if (item === 'News') scrollToSection('news');
        else if (item === 'About Us') scrollToSection('about');
        else if (item === 'Book Tickets') {
            if (user) {
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'police') navigate('/police');
                else if (user.role === 'medical') navigate('/medical');
                else navigate('/dashboard');
            } else {
                navigate('/login');
            }
        }
    };

    return (
        <div className="fixed w-full top-0 z-50 flex justify-center pt-4 sm:pt-6 px-4 pointer-events-none">
            <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />

            {/* 
                Floating Island Container 
                pointer-events-auto ensures clicks work on the navbar, but clicks pass through the empty space around it
            */}
            <header
                className={`pointer-events-auto transition-all duration-500 ease-out border-2 backdrop-blur-2xl shadow-2xl rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4 sm:gap-8 relative overflow-hidden ${showSolid
                    ? 'bg-gradient-to-r from-amber-50/95 via-orange-50/95 to-rose-50/95 border-orange-300/70 shadow-amber-300/40 w-[95%] max-w-7xl'
                    : 'bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-rose-500/25 border-amber-400/60 shadow-[0_0_30px_rgba(251,191,36,0.4)] w-[90%] max-w-6xl text-white'
                    }`}
            >
                {/* Animated gradient background */}
                {!showSolid && (
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 via-rose-400/20 to-amber-400/20"
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ backgroundSize: '200% 200%' }}
                    />
                )}
                <div className="relative z-10 flex items-center justify-between gap-4 sm:gap-8 w-full">
                    {/* Logo Section */}
                    <Link to="/" className="group flex items-center gap-2 sm:gap-3 shrink-0">
                        <motion.div
                            whileHover={{ scale: 1.15, rotate: [0, 10, -10, 0] }}
                            className={`p-2.5 rounded-full transition-all duration-500 relative overflow-hidden ${showSolid
                                ? 'bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200 text-amber-800 shadow-lg'
                                : 'bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 text-white shadow-xl'}`}
                        >
                            <span className="text-lg sm:text-xl relative z-10">🕉️</span>
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${showSolid
                                    ? 'from-amber-300 via-orange-300 to-rose-300'
                                    : 'from-amber-500 via-orange-500 to-rose-500'}`}
                                animate={{
                                    opacity: [0.4, 0.9, 0.4],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                        </motion.div>
                        <div className="flex flex-col">
                            <motion.span
                                className={`text-lg sm:text-xl font-serif font-bold tracking-tight transition-colors duration-300 ${showSolid
                                    ? 'bg-gradient-to-r from-amber-700 via-orange-700 to-rose-700 bg-clip-text text-transparent'
                                    : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'}`}
                                style={{ fontFamily: 'Georgia, serif' }}
                                animate={showSolid ? {} : {
                                    textShadow: [
                                        '0 0 10px rgba(251,191,36,0.5)',
                                        '0 0 20px rgba(249,115,22,0.6)',
                                        '0 0 10px rgba(251,191,36,0.5)'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                DarshanSetu
                            </motion.span>
                            <span className={`text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.2em] font-medium transition-colors duration-300 ${showSolid
                                ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent'
                                : 'text-amber-100'}`}>
                                ॐ Divine Connections ॐ
                            </span>
                        </div>
                    </Link>



                    {/* Navigation Links with "Gooey" Hover Effect */}
                    <nav className="flex items-center gap-1">
                        {location.pathname === '/' && (
                            <>
                                <div className="hidden md:flex items-center bg-transparent rounded-full p-1 relative">
                                    {navItems.map((item) => (
                                        <button
                                            key={item}
                                            onMouseEnter={() => setHoveredNav(item)}
                                            onMouseLeave={() => setHoveredNav(null)}
                                            onClick={() => {
                                                if (item === 'Book Tickets') {
                                                    if (user && user.role === 'pilgrim') {
                                                        navigate('/dashboard');
                                                    } else {
                                                        navigate('/login');
                                                    }
                                                } else {
                                                    const id = item.toLowerCase().split(' ')[0];
                                                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 relative z-10 ${showSolid
                                                ? (hoveredNav === item ? 'text-amber-900' : 'text-amber-800')
                                                : (hoveredNav === item ? 'text-white' : 'text-white drop-shadow-md')
                                                }`}
                                        >
                                            {/* Background "Gooey" Pill Animation - More Colorful */}
                                            {hoveredNav === item && (
                                                <motion.div
                                                    layoutId="navbar-hover"
                                                    className={`absolute inset-0 rounded-full -z-10 ${showSolid
                                                        ? 'bg-gradient-to-r from-amber-200 via-orange-200 via-rose-200 to-amber-200 shadow-lg'
                                                        : 'bg-gradient-to-r from-orange-500/90 via-amber-500/90 via-rose-500/90 to-orange-500/90 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                                                        }`}
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    animate={!showSolid ? {
                                                        boxShadow: [
                                                            '0 0 15px rgba(245,158,11,0.6)',
                                                            '0 0 25px rgba(251,191,36,0.8)',
                                                            '0 0 15px rgba(245,158,11,0.6)'
                                                        ]
                                                    } : {}}
                                                />
                                            )}
                                            {item}
                                        </button>
                                    ))}

                                    <motion.button
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsDonationModalOpen(true)}
                                        className={`ml-4 px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 relative overflow-hidden ${showSolid
                                            ? 'bg-gradient-to-r from-amber-500 via-orange-500 via-rose-500 to-amber-500 text-white shadow-amber-500/50'
                                            : 'bg-gradient-to-r from-amber-500 via-orange-500 via-rose-500 to-amber-500 text-white shadow-[0_0_25px_rgba(245,158,11,0.7)]'
                                            }`}
                                        animate={{
                                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        style={{ backgroundSize: '200% 200%' }}
                                    >
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Sparkles size={14} />
                                        </motion.div>
                                        Donate
                                    </motion.button>
                                </div>
                                <div className={`h-8 w-px hidden md:block mx-4 transition-colors duration-300 ${showSolid
                                    ? 'bg-gradient-to-b from-amber-300 via-orange-300 to-rose-300'
                                    : 'bg-gradient-to-b from-white/40 via-amber-200/40 to-white/40'}`}></div>
                            </>
                        )}

                        {/* User Profile / Auth Buttons */}
                        {user ? (
                            <div className="flex items-center gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 rounded-full border transition-all duration-300 ${showSolid
                                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm'
                                        : 'bg-white/15 border-white/30 backdrop-blur-md'
                                        }`}
                                >
                                    <div className={`p-1.5 rounded-full ${showSolid ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md' : 'bg-white/25 text-white'}`}>
                                        <User size={14} />
                                    </div>
                                    <span className={`text-xs sm:text-sm font-medium ${showSolid ? 'text-amber-900' : 'text-white'}`}>
                                        <span className="hidden sm:inline">{user.name}</span>
                                        <span className="sm:hidden">{user.name.split(' ')[0]}</span>
                                    </span>
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleLogout}
                                    className={`p-2 rounded-full transition-all duration-300 ${showSolid
                                        ? 'text-amber-600 hover:text-red-600 hover:bg-red-50'
                                        : 'text-white/80 hover:text-white hover:bg-white/15'
                                        }`}
                                    title="Logout"
                                >
                                    <LogOut size={18} />
                                </motion.button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${showSolid
                                        ? 'text-amber-800 hover:bg-amber-50'
                                        : 'text-white hover:bg-white/15 backdrop-blur-sm'
                                        }`}
                                >
                                    Login
                                </Link>
                                <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        to="/register"
                                        className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 shadow-lg hover:-translate-y-0.5 flex items-center gap-1.5 relative overflow-hidden ${showSolid
                                            ? 'bg-gradient-to-r from-amber-500 via-orange-500 via-rose-500 to-amber-500 text-white hover:shadow-amber-500/50'
                                            : 'bg-gradient-to-r from-white via-amber-50 to-white text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:via-orange-50 hover:to-rose-50 shadow-black/20 font-bold'
                                            }`}
                                        animate={showSolid ? {
                                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                        } : {}}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        style={showSolid ? { backgroundSize: '200% 200%' } : {}}
                                    >
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Sparkles size={12} />
                                        </motion.div>
                                        <span>Register</span>
                                    </Link>
                                </motion.div>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        {location.pathname === '/' && (
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`md:hidden p-2 rounded-full transition-all duration-300 ${showSolid
                                    ? 'text-amber-800 hover:bg-amber-50'
                                    : 'text-white hover:bg-white/15'
                                    }`}
                            >
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && location.pathname === '/' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md pointer-events-auto z-40 md:hidden"
                    >
                        <div className="bg-white/95 backdrop-blur-xl border border-amber-200/50 rounded-2xl shadow-2xl p-4">
                            <div className="flex flex-col gap-2">
                                {navItems.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            if (item === 'Book Tickets') {
                                                if (user && user.role === 'pilgrim') {
                                                    navigate('/dashboard');
                                                } else {
                                                    navigate('/login');
                                                }
                                            } else {
                                                const id = item.toLowerCase().split(' ')[0];
                                                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                        className="px-4 py-3 rounded-xl text-sm font-medium text-amber-900 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-200 text-left"
                                    >
                                        {item}
                                    </button>
                                ))}
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setIsDonationModalOpen(true);
                                    }}
                                    className="px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg flex items-center gap-2 justify-center mt-2"
                                >
                                    <Sparkles size={14} />
                                    Donate
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Header;
