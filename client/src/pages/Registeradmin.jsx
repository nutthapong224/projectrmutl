import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom'; // Add RouterLink for navigation

const RegisterAdmin = () => {
  const [form, setForm] = useState({ username: '', password: '',role:'admin' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for the button
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // Start loading

    try {
      // Send only username and password without the authorization token
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/register`,
        form
      );

      setSuccess(response.data.message || 'Admin registered successfully!');
      setForm({ username: '', password: '',role:'admin' }); // Reset form
      setLoading(false);

      // Navigate to /registeradmin after a delay to show success message
      setTimeout(() => navigate('/loginadmin'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false); // Stop loading
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
        ลงทะเบียนผู้ดูแลระบบ
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

        {/* Display Success Alert */}
        {success && (
          <Alert severity="success" sx={{ marginTop: 2 }}>
            {success}
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            ลงทะเบียน
          </Button>
        )}

        {/* Register Link */}
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          คุณมีบัญชีผู้ใช้งานแล้วใช่ไหม?{' '}
          <RouterLink to="/loginadmin" style={{ textDecoration: 'none', color: '#3f51b5' }}>
            เข้าสู่ระบบ
          </RouterLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterAdmin;
