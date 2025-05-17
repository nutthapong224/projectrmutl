import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardMedia, CardContent, Grid, Container, Link, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios to make API calls
import rmutlimage from "../assets/rmutlprojectimage.png";
import table from "../assets/table.png";

const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [news, setNews] = useState([]); // State to store the news data
  const formatThaiDate = (dateString) => {
    if (!dateString) return 'วันที่ไม่ระบุ';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'วันที่ไม่ถูกต้อง';
    
    // Thai month names
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    // Get date components
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    // Convert to Buddhist Era (BE) by adding 543 to the year
    const year = date.getFullYear() + 543;
    
    return `${day} ${month} ${year}`;
  };
  // Fetch news data from the API on component mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/news/searchall");
        setNews(response.data); // Store the fetched data in state
      } catch (err) {
        console.error("Error fetching news data:", err);
      }
    };

    fetchNews();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: "1280px",
        margin: "auto",
        padding: { xs: "12px", sm: "16px", md: "20px" },
        textAlign: "center",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Header Image */}
      <Box
        component="img"
        src={rmutlimage}
        alt="RMUTL Project"
        sx={{
          width: "100%",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.01)",
          },
        }}
      />

      {/* Title */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontFamily: "'Kanit', sans-serif",
          fontWeight: "bold",
          marginTop: "20px",
          color: "#333",
          fontSize: { xs: "1.5rem", sm: "1.8rem" },
          textShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
        }}
      >
        ยินดีต้อนรับสู่การแข่งขันพุทธรักษาเกมส์
      </Typography>

      {/* Links */}
      <Box 
        display="flex" 
        flexWrap="wrap" 
        justifyContent="center"
        gap={{ xs: 2, sm: 4, md: 6 }} 
        mt={3}
        sx={{
          backgroundColor: "rgba(245, 245, 250, 0.8)",
          borderRadius: "12px",
          padding: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box onClick={() => setOpen(true)} sx={{ cursor: "pointer" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              "&:hover": { 
                color: "#3f51b5",
                backgroundColor: "rgba(63, 81, 181, 0.08)",
                transform: "translateY(-2px)"
              },
            }}
          >
            โปรแกรมการแข่งขัน
          </Typography>
        </Box>

        <Box
          onClick={() => navigate("/agenda")}
          sx={{
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              "&:hover": { 
                color: "#3f51b5",
                backgroundColor: "rgba(63, 81, 181, 0.08)",
                transform: "translateY(-2px)"
              },
            }}
          >
            สูจิบัตร พุทธรักษาเกมส์
          </Typography>
        </Box>

        <Box
          onClick={() => navigate("/schedule")}
          sx={{
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              "&:hover": { 
                color: "#3f51b5",
                backgroundColor: "rgba(63, 81, 181, 0.08)",
                transform: "translateY(-2px)"
              },
            }}
          >
            กำหนดพุทธรักษาเกมส์
          </Typography>
        </Box>
        
        <Box sx={{ cursor: "pointer", width: "fit-content" }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.3rem" },
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "all 0.2s ease",
              "&:hover": { 
                color: "#3f51b5",
                backgroundColor: "rgba(63, 81, 181, 0.08)",
                transform: "translateY(-2px)"
              },
            }}
          >
            <Link
              href="https://www.facebook.com/Buddharuksagames39"
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              color="inherit"
              sx={{ display: "block" }}
            >
              Facebook พุทธรักษาเกมส์
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* News Section */}
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontSize: { xs: "1.3rem", sm: "1.5rem" },
          fontFamily: "'Kanit', sans-serif",
          marginTop: "2rem",
          marginBottom: "1rem",
          position: "relative",
          display: "inline-block",
          paddingBottom: "8px",
          fontWeight: 600,
          "&:after": {
            content: '""',
            position: "absolute",
            width: "60%",
            height: "3px",
            bottom: 0,
            left: "20%",
            backgroundColor: "#3f51b5",
            borderRadius: "2px",
          }
        }}
      >
        ข่าวกิจกรรม
      </Typography>

      {/* Map over news data and display the images */}
      {news.length > 0 ? (
        <Grid container spacing={2}>
          {news.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: "pointer",
                  border: "1px solid #e0e0e0",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
                    borderColor: '#3f51b5',
                  }
                }}
                onClick={() => navigate(`/news/${item.id}`)}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={`http://localhost:5000${item.profile_image}`}
                  alt={item.title}
                  sx={{ 
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontFamily: "'Kanit', sans-serif",
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      mb: 0.5,
                      color: '#333',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </Typography>
                  
                  {item.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mt: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontFamily: "'Kanit', sans-serif",
                        fontSize: '0.95rem',
                        color: '#666',
                      }}
                    >
                      {item.description}
                    </Typography>
                  )}
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1.5,
                    pt: 1,
                    borderTop: '1px solid #f0f0f0',
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '0.85rem',
                        color: '#666',
                        fontFamily: "'Kanit', sans-serif",
                      }}
                    >
                      {formatThaiDate(item.created_at)}
                    </Typography>
                    
                    <Typography 
                      variant="caption"
                      sx={{ 
                        fontSize: '0.85rem',
                        color: '#3f51b5',
                        fontFamily: "'Kanit', sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      อ่านเพิ่มเติม
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 5,
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px dashed #ccc',
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#777',
              fontFamily: "'Kanit', sans-serif",
              fontSize: '1.1rem',
            }}
          >
            ยังไม่มีข่าวกิจกรรม
          </Typography>
        </Box>
      )}

      {/* Dialog for Program */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="l"
        PaperProps={{
          sx: {
            borderRadius: "10px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
            overflow: "hidden"
          }
        }}
      >
        <Box 
          sx={{ 
            padding: { xs: 1, sm: 2 }, 
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            position: "relative"
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: "'Kanit', sans-serif",
              position: "absolute",
              top: "10px",
              left: "10px",
              backgroundColor: "rgba(255,255,255,0.8)",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: 500,
              zIndex: 2
            }}
          >
            โปรแกรมการแข่งขัน
          </Typography>
          <img
            src={table}
            alt="โปรแกรมการแข่งขัน"
            style={{ 
              width: "90vw", 
              height: "auto", 
              maxHeight: "90vh", 
              borderRadius: "6px",
              boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)" 
            }}
          />
        </Box>
      </Dialog>
    </Box>
  );
};

export default Home;