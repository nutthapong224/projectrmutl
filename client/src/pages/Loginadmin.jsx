import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink for navigation

const Loginadmin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the button
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Start loading

    try {
      // Make the POST request to the login endpoint
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, form);

      // If login is successful, store the token in localStorage
      const token = response.data.token;
      localStorage.setItem('token', token); // Store token in local storage

      // Set the token in the Axios request header globally for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Redirect to the dashboard
      navigate('/admindashboard');
    } catch (err) {
      // Handle errors if login fails
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false); // Stop loading if there's an error
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'white',
        p: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: '400px',
          bgcolor: 'white',
          boxShadow: 3,
          p: 3,
          borderRadius: 2,
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" gutterBottom align="center">
        เข้าสู่ระบบผู้ดูแลระบบ
        </Typography>

        <TextField
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
        />

        {/* Display Error Alert */}
        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            เข้าสู่ระบบ
          </Button>
        )}


       
      </Box>
    </Box>
  );
};

export default Loginadmin;
