import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        age: '',
        gender: '',
        role: 'pilgrim', // Default
        secretCode: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-amber-50 relative overflow-hidden py-12">
            {/* Background Mandala Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>

            {/* Decorative Orbs */}
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-10 left-10 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="max-w-xl w-full space-y-8 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-orange-100 relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-serif font-bold text-gray-900">
                        Join the Community
                    </h2>
                    <p className="mt-2 text-sm text-orange-800 font-medium">
                        Begin your spiritual journey today
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md animate-fade-in-down">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Full Name</label>
                            <input name="name" type="text" required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 hover:bg-white transition-colors"
                                placeholder="e.g. Rahul Kumar" onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Email Address</label>
                            <input name="email" type="email" required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 hover:bg-white transition-colors"
                                placeholder="pilgrim@example.com" onChange={handleChange}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Password</label>
                            <input name="password" type="password" required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 hover:bg-white transition-colors"
                                placeholder="••••••••" onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Phone Number</label>
                            <input name="phone" type="tel" required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 hover:bg-white transition-colors"
                                placeholder="+91 9876543210" onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Age</label>
                            <input name="age" type="number"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 hover:bg-white transition-colors"
                                placeholder="Age" onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Gender</label>
                            <select name="gender" onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 hover:bg-white transition-colors"
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Role</label>
                            <select name="role" onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50/50 hover:bg-white transition-colors"
                            >
                                <option value="pilgrim">Pilgrim</option>
                                <option value="admin">Temple Admin</option>
                                <option value="police">Police</option>
                                <option value="medical">Medical Staff</option>
                            </select>
                        </div>
                    </div>

                    {/* Secret Code for Privileged Roles */}
                    {formData.role !== 'pilgrim' && (
                        <div className="animate-fade-in-up bg-red-50 p-4 rounded-xl border border-red-100">
                            <label className="block text-sm font-bold text-red-800 mb-2">
                                Official Access Code Required
                            </label>
                            <input
                                name="secretCode"
                                type="password"
                                placeholder="Enter Secret Code"
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white"
                            />
                            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Only authorized personnel can register for this role.
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-orange-200 mt-6"
                    >
                        Create Account
                    </button>

                    <div className="text-center mt-4">
                        <Link to="/login" className="text-sm font-semibold text-orange-600 hover:text-orange-500 transition-colors">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
