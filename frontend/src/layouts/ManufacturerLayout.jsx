// src/layouts/ManufacturerLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const ManufacturerLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default ManufacturerLayout;