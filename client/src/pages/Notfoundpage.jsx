// src/components/NotFoundPage.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <Box
  display="flex"
  flexDirection="column"
  alignItems="center"
  justifyContent="center"
  minHeight="100vh"
  textAlign="center"
  padding={2}
  sx={{
    marginTop: {
      xs: '-80px', // Small screens
      sm: '-90x', // Medium screens
      md: '-120px', // Large screens and above
    },
  }}
>
      <Typography
        variant="h1"
        color="error"
        sx={{ 
          fontSize: isSmallScreen ? '3rem' : '6rem',
          fontWeight: 'bold',
          fontFamily: 'Kanit, sans-serif', // Set Kanit font
          marginBottom: theme.spacing(2) 
        }}
      >
        404
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontSize: isSmallScreen ? '1.25rem' : '2rem',
          fontFamily: 'Kanit, sans-serif', // Set Kanit font
          marginBottom: theme.spacing(3),
        }}
      >
        ขอโทษค่ะ! ไม่พบหน้าที่คุณกำลังมองหา
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleBackHome}
        sx={{
          padding: theme.spacing(1, 4),
          fontSize: isSmallScreen ? '0.875rem' : '1rem',
          fontFamily: 'Kanit, sans-serif', // Set Kanit font
        }}
      >
        กลับสู่หน้าหลัก
      </Button>
    </Box>
  );
};

export default NotFoundPage;
