import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import Navabar from './components/Navabar';
import AuthPage from './components/auth/auth';
import ForgotPassword from './components/auth/forgotPassword';
import HomePage from './components/home';
import ManufacturerStepper from './components/manufacturer/BuildProfile';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './components/admin/adminControlPanel/adminDashboard';
import AdminManufacturer from './components/admin/adminControlPanel/AdminManufacturer';

import '@mantine/core/styles.css';

const App = () => {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
};

// This component conditionally renders the layout and routes
const LayoutWrapper = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navabar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/build-profile" element={<ManufacturerStepper />} />

        {/* Admin Layout with nested routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manufacturer" element={<AdminManufacturer />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
