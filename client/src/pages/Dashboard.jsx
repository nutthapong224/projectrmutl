import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

 

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    navigate('/loginadmin'); // Redirect to login
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        bgcolor: '#f5f5f5',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box
          sx={{
            bgcolor: '#fff',
            p: 2,
            borderRadius: 2,
            boxShadow: 3,
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <Typography variant="h6">Data:</Typography>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        sx={{ mt: 3 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Dashboard;
