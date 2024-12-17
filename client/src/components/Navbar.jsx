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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Mobile screen check
  const isTabletOrLaptop = useMediaQuery(theme.breakpoints.between("sm", "lg")); // Tablet or laptop screen check
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navLinks = [
    { label: "ลงทะเบียนผู้ใช้งาน", to: "/register" },
    { label: "พิมพ์เกียรติบัตร", to: "/printcert" },
    { label: "รายงานการแข่งขัน", to: "/reportsport" },
    { label: "พิมพ์บัตรผู้เข้าร่วมการแข่งขัน", to: "/systemcard" }

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
        {/* Logo Section */}
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
              height: { xs: 30, sm: 40, md: 50 }, // Responsive logo height
              width: "auto", // Maintain aspect ratio
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
                fontSize: isTabletOrLaptop ? "2.5rem" : "2rem", // Adjust icon size for tablet or laptop
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              sx={{
                // Increase menu width and adjust padding on tablets and laptops
                "& .MuiPaper-root": {
                  width: isTabletOrLaptop ? 250 : 200, // Adjust width for tablets and mobile
                  padding: isTabletOrLaptop ? 2 : 1, // Adjust padding for tablets and mobile
                },
              }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  key={link.to}
                  component={RouterLink}
                  to={link.to}
                  onClick={handleMenuClose}
                  sx={{
                    textDecoration: "none",
                    color: "#333",
                    fontFamily: "'Kanit', sans-serif",
                    fontSize: isTabletOrLaptop ? "1.2rem" : "1rem", // Adjust font size for tablets
                  }}
                >
                  {link.label}
                </MenuItem>
              ))}
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
            {navLinks.map((link) => (
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
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
