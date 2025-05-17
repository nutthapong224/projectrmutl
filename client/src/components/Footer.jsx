import React from 'react';
import { Box, Container, Divider, Grid, IconButton, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import logo from "../assets/logos.png";
import './footer.css'

const Footer = () => {
  return (
    <Box component="footer" sx={{ 
      bgcolor: '#f8f9fa', 
      py: 2, 
      borderTop: '1px solid #e0e0e0',
      mt: 'auto'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Left section with logo and title */}
          <Grid item xs={12} md={4} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: { xs: 'center', md: 'flex-start' }
          }}>
            {/* Logo */}
            <Box 
              component="img" 
              src={logo}
              alt="University Games Logo" 
              sx={{ width: 80, height: 80, mb: 1 }}
            />
            
            {/* Main title */}
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 'bold', 
              textAlign: { xs: 'center', md: 'left' } 
            }}>
              กีฬามหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ครั้งที่ 39
            </Typography>
            
            {/* Subtitle */}
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 'bold', 
              textAlign: { xs: 'center', md: 'left' },
              mt: 0.5
            }}>
              พุทธรักษาเกมส์
            </Typography>
            
            {/* Quoted title */}
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold', 
              textAlign: { xs: 'center', md: 'left' },
              my: 1
            }}>
              "กีฬา มทร.ล้านนา ครั้งที่ 39"
            </Typography>
            
            {/* Facebook icon */}
            <IconButton 
              aria-label="facebook" 
              sx={{ 
                bgcolor: '#bdbdbd', 
                color: 'white',
                '&:hover': {
                  bgcolor: '#9e9e9e'
                }
              }}
            >
              <FacebookIcon />
            </IconButton>
          </Grid>
          
          {/* Vertical divider */}
          <Grid item xs={0} md={1} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Divider orientation="vertical" flexItem />
          </Grid>
          
          {/* Right section with contact information */}
          <Grid item xs={12} md={7} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            textAlign: { xs: 'center', md: 'left' }
          }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              กีฬามหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ครั้งที่ 39 พุทธรักษาเกมส์ : 59 หมู่ 13 ตำบลฝายแก้ว อำเภอภูเพียง จังหวัดน่าน 55000
            </Typography>
            <Typography variant="body2">
              โทรศัพท์ : 0 5471 0259 , โทรสาร : 0 5477 1398
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;