import React from "react";
import { Typography, Box, Card, CardContent, CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';

const Loginpage = () => {
  const navigate = useNavigate();

  const items = [
    { 
      label: "แอดมิน", 
      path: "/loginadmin", 
      description: "แอดมิน",
      bgColor: "#e3f2fd",
      avatarBg: "#1976d2",
      icon: <AdminPanelSettingsIcon sx={{ fontSize: 70, color: "white" }} />
    },
    { 
      label: "กรรมการตัดสินกีฬา", 
      path: "/logindirector", 
      description: "กรรมการตัดสินกีฬา",
      bgColor: "#fff3e0",
      avatarBg: "#ed6c02",
      sportsIcons: true
    },
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
        background: "#f5f5f5",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          fontWeight: "bold",
          marginBottom: "2rem",
          fontFamily: "'Kanit', sans-serif",
          color: "#333"
        }}
      >
        ระบบเข้าสู่ระบบ
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ maxWidth: "800px", width: "100%" }}
      >
        {items.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            key={index}
          >
            <Card 
              elevation={5}
              sx={{ 
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)"
                },
                borderRadius: "16px",
                overflow: "hidden"
              }}
            >
              <CardActionArea 
                onClick={() => navigate(item.path)}
                sx={{ height: "100%" }}
              >
                <Box
                  sx={{
                    background: item.bgColor,
                    padding: "2rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
                  {item.sportsIcons ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        marginBottom: '10px'
                      }}>
                        <Avatar 
                          sx={{ 
                            width: 70, 
                            height: 70, 
                            backgroundColor: item.avatarBg,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            marginRight: '10px'
                          }}
                        >
                          <SportsSoccerIcon sx={{ fontSize: 40, color: "white" }} />
                        </Avatar>
                        <Avatar 
                          sx={{ 
                            width: 70, 
                            height: 70, 
                            backgroundColor: item.avatarBg,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                          }}
                        >
                          <SportsBasketballIcon sx={{ fontSize: 40, color: "white" }} />
                        </Avatar>
                      </Box>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          backgroundColor: item.avatarBg,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        <EmojiEventsIcon sx={{ fontSize: 50, color: "white" }} />
                      </Avatar>
                    </Box>
                  ) : (
                    <Avatar 
                      sx={{ 
                        width: 120, 
                        height: 120, 
                        backgroundColor: item.avatarBg,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      {item.icon}
                    </Avatar>
                  )}
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "1.2rem", sm: "1.4rem" },
                      fontFamily: "'Kanit', sans-serif",
                    }}
                  >
                    {item.description}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      fontFamily: "'Kanit', sans-serif",
                    }}
                  >
                    คลิกเพื่อเข้าสู่ระบบ
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Loginpage;