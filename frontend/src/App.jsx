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
import Checkout from './components/checkout/checkoutPage';
import ProductSearch from './components/products/productSearch';
import Layout from "@/components/layouts/layout";
// import NotFound from './components/not-found';
import Dashboard from './components/manufacturer/Dashboard';
import Products from './components/manufacturer/products';
import ProductPage from './components/products/productPage';
import Requests from './components/manufacturer/requests';
import Orders from './components/manufacturer/orders';
import Messages from './components/manufacturer/messages';
import Analytics from './components/manufacturer/Analytics';
import Notifications from './components/manufacturer/notifications';
// import Settings from './components/manufacturer/settings';
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
  const isManufacturerRoute = location.pathname.startsWith('/manufacturer');

  return (
    <>
      {!isAdminRoute && !isManufacturerRoute && <Navabar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/build-profile" element={<ManufacturerStepper />} />
        <Route path='product/:id' element={<ProductPage />} />
        <Route path='/product/trade/search' element={<ProductSearch />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* Admin Layout with nested routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manufacturer" element={<AdminManufacturer />} />
        </Route>

        <Route path="/manufacturer" element={<Layout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard key={location.pathname} />} />
            <Route path="products" element={<Products key={location.pathname}/>} />
            <Route path="requests" element={<Requests key={location.pathname} />} />
            <Route path="orders" element={<Orders />} />
            <Route path="messages" element={<Messages />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            {/*<Route path="settings" element={Settings} />
            <Route element={NotFound} /> */}
          </Route>
      </Routes>

      
    </>
  );
};

export default App;
