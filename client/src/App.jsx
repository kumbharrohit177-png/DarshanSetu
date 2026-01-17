import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import MedicalDashboard from './pages/MedicalDashboard';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';
import DebugSession from './components/DebugSession';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 pt-20">
          <DebugSession />
          <Header />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['pilgrim', 'admin', 'police', 'medical']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['police']} />}>
              <Route path="/police" element={<PoliceDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['medical']} />}>
              <Route path="/medical" element={<MedicalDashboard />} />
            </Route>

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
