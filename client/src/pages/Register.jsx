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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Shape your spiritual journey
                    </p>
                </div>
                {error && <div className="text-red-500 text-center text-sm bg-red-100 p-2 rounded">{error}</div>}
                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                        <input name="name" type="text" required placeholder="Full Name" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                        <input name="email" type="email" required placeholder="Email Address" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                        <input name="password" type="password" required placeholder="Password" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                        <input name="phone" type="tel" required placeholder="Phone Number" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                        <div className="grid grid-cols-2 gap-4">
                            <input name="age" type="number" placeholder="Age" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                            <select name="gender" onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <select name="role" onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-gray-50">
                            <option value="pilgrim">Pilgrim</option>
                            <option value="admin">Temple Admin</option>
                            <option value="police">Police</option>
                            <option value="medical">Medical Staff</option>
                        </select>

                        {/* Secret Code for Privileged Roles */}
                        {formData.role !== 'pilgrim' && (
                            <div className="animate-fade-in-up">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Official Access Code Required
                                </label>
                                <input
                                    name="secretCode"
                                    type="password"
                                    placeholder="Enter Secret Code"
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border-2 border-red-200 rounded-md focus:border-red-500 focus:ring-red-200"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Only authorized personnel can register for this role.
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition"
                    >
                        Register
                    </button>
                    <div className="text-center">
                        <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
