import React from "react";
import { ImageListItem, Typography, Box } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import player from "../assets/player.png";
import coach from "../assets/coach.png"; 
import organization from "../assets/organization.png" 
import director from "../assets/director.png"

const Home = () => {
  const navigate = useNavigate(); 
  const items = [
    { label: "ระบบลงทะเบียน", path: "/register", icon: coach, description: "ระบบลงทะเบียน" },
    { label: "ระบบค้นหา", path: "/systemcard", icon: player, description: "ระบบพิมพ์บัตรประจำตัว" } 


  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        padding: { xs: "20px", md: "40px" },
        fontFamily: "'Kanit', sans-serif",
        marginTop: { xs: "-20px", sm: "-80px", md: "-100px" },
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem" },
          fontFamily: "'Kanit', sans-serif", 

        }}
      >
        ระบบลงทะเบียน/พิมพ์บัตรประจำตัว
      </Typography>

      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginBottom: { xs: "10px", sm: "15px", md: "20px" } }}
      >
        {items.map((item, index) => (
          <Grid2
            item
            xs={12}
            sm={6}
            md={5}
            key={index}
            onClick={() => navigate(item.path)}
            sx={{ cursor: "pointer" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                fontFamily: "'Kanit', sans-serif",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  marginBottom: { xs: "5px", sm: "10px" },
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  fontFamily: "'Kanit', sans-serif",
                }}
              >
                {item.description}
              </Typography>
              <ImageListItem>
                <img
                  src={item.icon}
                  alt={item.label}
                  style={{
                    borderRadius: "10px",
                    width: "100%",
                    maxWidth: "180px",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              </ImageListItem>
            </Box>
          </Grid2>
        ))}
      </Grid2>
      <Typography
        variant="h6"
        sx={{
          marginBottom: { xs: "5px", sm: "10px" },
          fontSize: {
            xs: "1rem",
            sm: "1.1rem",
            md: "1.3rem",
          },
          color: "red",
          fontFamily: "'Kanit', sans-serif",
        }}
      >
      
      </Typography>
    </Box>
  );
};

export default Home;  