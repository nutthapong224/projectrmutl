import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logo from "../assets/logos.png";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTabletOrLaptop = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [certificateAnchorEl, setCertificateAnchorEl] = useState(null);
  const [registerAnchorEl, setRegisterAnchorEl] = useState(null); // New state for register dropdown

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCertificateClick = (event) => {
    setCertificateAnchorEl(event.currentTarget);
  };

  const handleCertificateClose = () => {
    setCertificateAnchorEl(null);
  };

  const handleRegisterClick = (event) => {
    setRegisterAnchorEl(event.currentTarget);
  };

  const handleRegisterClose = () => {
    setRegisterAnchorEl(null);
  };

  const navLinks = [
    { label: "ลงทะเบียนผู้ใช้งาน", to: "/register" },
    { label: "พิมพ์เกียรติบัตร", to: "/report" },
  
    { label: "พิมพ์บัตรผู้เข้าร่วมการแข่งขัน", to: "/systemcard" },
    { label: "รายงานการแข่งขัน", to: "/matchresult" },
    { label: "ตารางเหรียญรางวัล", to: "/tablemedal" },
    { label: "เข้าสู่ระบบ", to: "/loginpage" }
  ];

  // Registration dropdown items


  // Existing certificate options remain the same
  const certificateOptions = [
    { label: "ฟุตบอล", to: "/reportfootball" },
    { label: "ฟุตซอล", to: "/reportfutsal" },
    { label: "เปตอง", to: "/reportpetanque" },
    { label: "บาสเกตบอล", to: "/reportbasketball" },
    { label: "เทเบิลเทนิส", to: "/reporttabletenis" },
    { label: "เซปักตะกร้อ", to: "/reporttakraw" },
    { label: "เซปักตะกร้อลอดห่วง", to: "/reporthooptakraw" },
    { label: "วอลเลย์บอล", to: "/reportvolleyball" },
    { label: "E-sport", to: "/reportesport" },
    { label: "แบตมินตัน", to: "/reportbadminton" },
    { label: "องค์การนักศึกษา", to: "/reportbadminton" },
    { label: "ผู้จัดการทีม ผู้ช่วยผู้ฝึกสอน และผู้จัดการทีม", to: "/reportbadminton" },
    { label: "กรรมการตัดสิน ผู้ช่วยผู้ตัดสิน และฝ่ายเทคนิคกีฬา", to: "/reportbadminton" },
  ];

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", mb: 5 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 4 },
        }}
      >
        {/* Logo Section - Unchanged */}
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              height: { xs: 30, sm: 40, md: 50 },
              width: "auto",
              mr: 2,
            }}
          />
          <Typography
            variant="h6"
            component="span"
            sx={{
              textDecoration: "none",
              color: "#333",
              fontFamily: "'Kanit', sans-serif",
              fontSize: { xs: "0.9rem", sm: "1.2rem", md: "1.5rem" },
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            พุทธรักษาเกมส์
          </Typography>
        </Box>

        {/* Navigation Links */}
        {isMobile || isTabletOrLaptop ? (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              sx={{
                color: "#333",
                fontSize: isTabletOrLaptop ? "2.5rem" : "2rem",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                "& .MuiPaper-root": {
                  width: isTabletOrLaptop ? 250 : 200,
                  padding: isTabletOrLaptop ? 2 : 1,
                },
              }}
            >
              {navLinks.map((link) => {
                if (link.isRegisterDropdown) {
                  return (
                    <MenuItem
                      key={link.to}
                      onClick={handleRegisterClick}
                      sx={{
                        textDecoration: "none",
                        color: "#333",
                        fontFamily: "'Kanit', sans-serif",
                        fontSize: isTabletOrLaptop ? "1.2rem" : "1rem",
                      }}
                    >
                      {link.label}
                    </MenuItem>
                  );
                } else if (link.isDropdown) {
                  return (
                    <MenuItem
                      key={link.to}
                      onClick={handleCertificateClick}
                      sx={{
                        textDecoration: "none",
                        color: "#333",
                        fontFamily: "'Kanit', sans-serif",
                        fontSize: isTabletOrLaptop ? "1.2rem" : "1rem",
                      }}
                    >
                      {link.label}
                    </MenuItem>
                  );
                } else {
                  return (
                    <MenuItem
                      key={link.to}
                      component={RouterLink}
                      to={link.to}
                      onClick={handleMenuClose}
                      sx={{
                        textDecoration: "none",
                        color: "#333",
                        fontFamily: "'Kanit', sans-serif",
                        fontSize: isTabletOrLaptop ? "1.2rem" : "1rem",
                      }}
                    >
                      {link.label}
                    </MenuItem>
                  );
                }
              })}
            </Menu>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
            }}
          >
            {navLinks.map((link) => {
              if (link.isRegisterDropdown) {
                return (
                  <Box key={link.to} sx={{ position: "relative" }}>
                    <Typography
                      variant="h6"
                      component="div"
                      onClick={handleRegisterClick}
                      sx={{
                        textDecoration: "none",
                        color: "#333",
                        fontFamily: "'Kanit', sans-serif",
                        fontSize: { sm: "1rem", md: "1.2rem" },
                        cursor: "pointer",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {link.label}
                    </Typography>
                    <Menu
                      anchorEl={registerAnchorEl}
                      open={Boolean(registerAnchorEl)}
                      onClose={handleRegisterClose}
                    >
                      {registerOptions.map((option) => (
                        <MenuItem
                          key={option.to}
                          component={RouterLink}
                          to={option.to}
                          onClick={handleRegisterClose}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                );
              } else if (link.isDropdown) {
                return (
                  <Box key={link.to} sx={{ position: "relative" }}>
                    <Typography
                      variant="h6"
                      component="div"
                      onClick={handleCertificateClick}
                      sx={{
                        textDecoration: "none",
                        color: "#333",
                        fontFamily: "'Kanit', sans-serif",
                        fontSize: { sm: "1rem", md: "1.2rem" },
                        cursor: "pointer",
                        "&:hover": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {link.label}
                    </Typography>
                    <Menu
                      anchorEl={certificateAnchorEl}
                      open={Boolean(certificateAnchorEl)}
                      onClose={handleCertificateClose}
                    >
                      {certificateOptions.map((option) => (
                        <MenuItem
                          key={option.to}
                          component={RouterLink}
                          to={option.to}
                          onClick={handleCertificateClose}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Box>
                );
              } else {
                return (
                  <Typography
                    key={link.to}
                    variant="h6"
                    component={RouterLink}
                    to={link.to}
                    sx={{
                      textDecoration: "none",
                      color: "#333",
                      fontFamily: "'Kanit', sans-serif",
                      fontSize: { sm: "1rem", md: "1.2rem" },
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {link.label}
                  </Typography>
                );
              }
            })}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;