import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RoleProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect to their default landing page if role not allowed
        if (userRole === 'admin') return <Navigate to="/admin" replace />;
        if (userRole === 'guide') return <Navigate to="/guide" replace />;
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RoleProtectedRoute;
