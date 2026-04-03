import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MapView from './pages/MapView';
import ExplorePage from './pages/ExplorePage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import GuideListPage from './pages/GuideListPage';
import BookingPage from './pages/BookingPage';
import BookingStatusPage from './pages/BookingStatusPage';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Layouts & Protection
import AdminLayout from './layouts/AdminLayout';
import GuideLayout from './layouts/GuideLayout';
import RoleProtectedRoute from './components/RoleProtectedRoute';

// Role-Specific Pages
import { 
  AdminDashboard, AdminUsers, AdminGuides, 
  AdminBookings, AdminPlaces, AdminReports 
} from './pages/adminPanel';
import { 
  GuideDashboard, GuideBookings, GuideProfile 
} from './pages/guidePortal';

import { SocketProvider } from './context/SocketContext';
import FloatingNavbar from './components/FloatingNavbar';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <SocketProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-surface flex flex-col">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User (Tourist) Routes */}
            <Route element={<RoleProtectedRoute allowedRoles={['user']} />}>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/location/:id" element={<PlaceDetailsPage />} />
              <Route path="/location/:id/guides" element={<GuideListPage />} />
              <Route path="/location/:locId/book/:guideId" element={<BookingPage />} />
              <Route path="/booking-status/:id" element={<BookingStatusPage />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Guide Routes */}
            <Route path="/guide" element={<RoleProtectedRoute allowedRoles={['guide']} />}>
              <Route element={<GuideLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<GuideDashboard />} />
                <Route path="bookings" element={<GuideBookings />} />
                <Route path="profile" element={<GuideProfile />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="guides" element={<AdminGuides />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="places" element={<AdminPlaces />} />
                <Route path="reports" element={<AdminReports />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to={token ? (role === 'admin' ? '/admin' : (role === 'guide' ? '/guide' : '/')) : '/login'} replace />} />
          </Routes>
          
          {/* Only show User Navbar for tourists */}
          {(token && role === 'user') && <FloatingNavbar />}
        </div>
      </Router>
     </ErrorBoundary>
    </SocketProvider>
  );
}

export default App;
