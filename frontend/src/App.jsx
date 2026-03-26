import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MapView from './pages/MapView';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import GuideDashboard from './pages/GuideDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { SocketProvider } from './context/SocketContext';
import FloatingNavbar from './components/FloatingNavbar';
import './index.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <SocketProvider>
      <Router>
        <div className="min-h-screen bg-surface flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
            <Route path="/map" element={token ? <MapView /> : <Navigate to="/login" />} />
            <Route path="/bookings" element={token ? <Bookings /> : <Navigate to="/login" />} />
            <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/admin" element={token ? <Admin /> : <Navigate to="/login" />} />
            <Route path="/guide" element={token ? <GuideDashboard /> : <Navigate to="/login" />} />
          </Routes>
          {token && <FloatingNavbar />}
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
