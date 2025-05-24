import React from 'react';
import NavbarMinimalColored from '../assets/SidebarAdmin';
import { Outlet, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/adminControlPanel/adminDashboard';
// import AdminManufacturer from '../components/admin/adminControlPanel/AdminManufacturer';
// Import other admin components

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavbarMinimalColored />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        {/* Outlet will render the child routes' components */}
        <Outlet />
      </div>
    </div>
  );
};

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="dashboard" replace />} /> {/* Redirect /admin to /admin/dashboard */}
    <Route path="dashboard" element={<AdminDashboard />} />
    {/* <Route path="manufacturer" element={<AdminManufacturer />} /> */}
    {/* Define other admin routes here */}
  </Routes>
);

export default AdminLayout;