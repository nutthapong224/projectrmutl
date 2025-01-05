import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebars';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'white',
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Center content vertically
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
