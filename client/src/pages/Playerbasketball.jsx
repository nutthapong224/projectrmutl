import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Card, CardContent, Typography, CardMedia, Button, CircularProgress } from "@mui/material";
import backcard from "../assets/backcard.png";
import iconimages from "../assets/icons.png";
import d from "../assets/d.png";
import logo from "../assets/logos.png";
import qrcode from "../assets/qrcodesport.png";
import backgroundimg from "../assets/background3.png";

const Playerbasketball = () => {
  const { id } = useParams(); // Get the player ID from the URL
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flip, setFlip] = useState(false); // Define the flip state

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/basketball/${id}`);
        setPlayer(response.data);
      } catch (err) {
        setError("Failed to fetch player details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayerDetails();
  }, [id]);

  // Handle flip on card click
  const handleCardClick = () => {
    setFlip(!flip); // Toggle flip state on card click
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <CircularProgress />; // Show loading spinner while fetching
  if (error) return <Typography color="error">{error}</Typography>; // Display error message

  return (
    <div>
      <Card
        style={{
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          pageBreakInside: "avoid",
          pageBreakBefore: "auto",
          pageBreakAfter: "auto",
          size: "A4",
        }}
        sx={{
          maxWidth: 400,
          margin: "auto",
          fontFamily: "'Kanit', sans-serif",
          backgroundImage: `url(${backgroundimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "black",
          cursor: "pointer", // Make the card clickable
          transformStyle: "preserve-3d", // Necessary for 3D transformations
          transition: "transform 0.6s", // Smooth transition
          transform: flip ? "rotateY(360deg)" : "rotateY(0deg)", // 350 degree rotation on flip
        }}
        onClick={handleCardClick} // When the card is clicked, it will rotate
      >
        <CardContent>
          {/* Front Card Content */}
          {!flip && player && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 5,
                  flexDirection: "row",
                }}
              >
                <CardMedia
                  component="img"
                  height="70"
                  image={logo}
                  alt="Logo"
                  sx={{
                    objectFit: "contain",
                    width: "auto",
                    height: {
                      xs: 50, // 50px on extra small screens (mobile)
                      sm: 70, // 70px on small screens and above
                    },
                  }}
                />
                <div>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "12px", md: "13px" },
                      textAlign: "center",
                      mx: 1,
                      fontFamily: "'Kanit', sans-serif",
                      color: "black",
                      fontWeight: "bold",
                      marginLeft: { xs: "0px" },
                    }}
                  >
                    การแข่งขัน <br /> กีฬามหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา <br />
                  </Typography>
                </div>

                <div>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "12px", md: "15px" },
                      textAlign: "center",
                      mx: 1,
                      fontFamily: "'Kanit', sans-serif",
                      color: "black",
                      fontWeight: "bold",
                      marginLeft: { xs: "0px", md: "-5px" },
                    }}
                  >
                    ครั้งที่<br />
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "23px", md: "28px" },
                      textAlign: "center",
                      mx: 1,
                      fontFamily: "'Kanit', sans-serif",
                      color: "black",
                      fontWeight: "bold",
                      marginLeft: { xs: "0px", md: "-5px" },
                    }}
                  >
                    39
                  </Typography>
                </div>
              </Box>

              {/* Title Section */}
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "'Kanit', sans-serif",
                  textShadow:
                    "2px 2px 0px white, -2px -2px 0px white, 2px -2px 0px white, -2px 2px 0px white",
                  display: "block",
                  marginTop: "-40px",
                  fontSize: { xs: "20px", md: "24px" },
                  textAlign: "center",
                  mx: 2,
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                "พุทธรักษาเกมส์"
              </Typography>

              {/* Student Info */}
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "12px", md: "13px" },
                  fontFamily: "'Kanit', sans-serif",
                  color: "black",
                  mt: 2,
                  fontWeight: "bold",
                }}
              >
                <span>ชื่อสกุล : </span>
                {player.fname} {player.lname}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "12px", md: "13px" },
                  fontFamily: "'Kanit', sans-serif",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                <span>ประเภทกีฬา: </span>
                {player.sport_type}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "12px", md: "13px" },
                  fontFamily: "'Kanit', sans-serif",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                <span>หน่วยงาน/สังกัด : </span>
                {player.department}
              </Typography>

              {/* Image Section */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mb: 1.5,
                  mt: 2,
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={`http://localhost:5000/uploads/${player.profile_image}`}
                  alt={`${player.fname} ${player.lname}`}
                  sx={{ width: "48%" }}
                  style={{ border: "3px solid red" }}
                />
                <CardMedia
                  component="img"
                  height="165"
                  image={d}
                  alt="Second Image"
                  sx={{ width: "48%" }}
                />
              </Box>

              {/* Footer Section */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                  mt: 2,
                  flexDirection: "row",
                }}
              >
                <CardMedia
                  component="img"
                  height="100"
                  image={iconimages}
                  alt="Logo"
                  sx={{ objectFit: "contain", width: "auto" }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "12px", md: "12px" },
                    mx: 2,
                    fontFamily: "'Kanit', sans-serif",
                    color: "black",
                    marginLeft: "5px",
                    fontWeight: "bold",
                  }}
                >
                  ระหว่างวันที่ 1 - 6 ธันวาคม 2567 <br />ณ
                  มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนาน่าน
                </Typography>
                <CardMedia
                  component="img"
                  height="80"
                  image={qrcode}
                  alt="Logo"
                  sx={{
                    objectFit: "contain",
                    width: "auto",
                    border: "4px solid red", // Adds a 2px border with black color
                  }}
                />
              </Box>
            </>
          )}

          {/* Back Card Content */}
          {flip && (
            <img
              src={backcard}
              alt="Back Card"
              style={{
                width: "100%",
                height: "100%",
                maxWidth: 400,
                marginTop: "-40px",
                marginBottom: "-20px",
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Print Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // Centers horizontally
          marginTop: 4, // Add some space from the top if needed
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{
            marginBottom: 2,
            fontFamily: "'Kanit', sans-serif",
          }}
        >
          พิมพ์บัตรประจำตัว
        </Button>
      </Box>
    </div>
  );
};

export default Playerbasketball;
