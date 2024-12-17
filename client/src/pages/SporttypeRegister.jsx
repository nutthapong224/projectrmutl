import React from "react";
import {
  Button,
  Grid,
  ImageList,
  ImageListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import playerfootball from "../assets/football.png";
import playerfutsal from "../assets/futsal.png";
import playerbasketball from "../assets/basketball.png";
import playervolleyball from "../assets/volleyball.png";
import playertabletenis from "../assets/tabletenis.png";
import playerpetanque from "../assets/petanque.png";
import playerbadminton from "../assets/badminton.png";
import playertakraw from "../assets/takraw.png";
import hooptakraw from "../assets/hooptakraw.png";
import esport from "../assets/esport.png";

const SporttypeRegister = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobileView = useMediaQuery("(max-width:450px)");

  const items = [
    { label: "ฟุตบอล", path: "/searhfootball", icon: playerfootball },
    { label: "ฟุตซอล", path: "/searhfutsal", icon: playerfutsal },
    { label: "บาสเกตบอล", path: "/searhbasketball", icon: playerbasketball },
    { label: "วอลเลย์บอล", path: "/searhvolleyball", icon: playervolleyball },
    { label: "เทเบิลเทนิส", path: "/searhtabletenis", icon: playertabletenis },
    { label: "เปตอง", path: "/searhpetanque", icon: playerpetanque },
    { label: "แบดมินตัน", path: "/searhbadminton", icon: playerbadminton },
    { label: "เซปักตะกร้อ", path: "/searhtakraw", icon: playertakraw },
    { label: "ตะกร้อลอดห่วง", path: "/searhhooptakraw", icon: hooptakraw },
    { label: "E-Sport", path: "/searhesport", icon: esport },
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Kanit, sans-serif" }}> 
     <Typography
  variant="h5"
  component="h2"
  align="center"
  gutterBottom
  sx={{
    marginTop: { xs: "-20px", sm: "-30px", md: "-40px" }, // Responsive marginTop
    fontFamily: "'Kanit', sans-serif",
    fontSize: { xs: "1.5rem", sm: "1.75rem" },
  }}
>
  เลือกประเภทกีฬา
</Typography>

      

      <ImageList
        cols={isSmallScreen ? 1 : 2}
        gap={10}
        sx={{ maxWidth: 600, margin: "auto" }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            style={{ cursor: "pointer", textAlign: "center" }}
          >
            <Typography
              variant={isMobileView ? "body1" : "h6"}
              sx={{ marginBottom: "10px", fontFamily: "Kanit, sans-serif" }}
            >
              {item.label}
            </Typography>
            <ImageListItem>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  style={{
                    borderRadius: "10px",
                    width: isMobileView ? "150px" : "150px",
                    height: isMobileView ? "150px" : "150px",
                  }}
                />
              </div>
            </ImageListItem>
          </div>
        ))}
      </ImageList>
    </div>
  );
};

export default SporttypeRegister;
