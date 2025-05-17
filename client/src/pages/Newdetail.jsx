import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Container, Card, CardMedia, CardContent } from "@mui/material";
import axios from "axios";

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/news/player/${id}`);
        setNewsItem(response.data);
      } catch (err) {
        console.error("Error fetching news detail:", err);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (!newsItem) {
    return <Typography variant="h5" align="center">กำลังโหลดข้อมูล...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ p: 0 }}>
      <Card sx={{ mt: 4, boxShadow: 3 }}>
        {/* ทำให้รูปภาพเต็มจอ */}
        <CardMedia
          component="img"
          image={`http://localhost:5000${newsItem.profile_image}`}
          alt={newsItem.title}
          sx={{
            width: "100%",  // ให้รูปเต็มจอ
            height: "auto", // ปรับขนาดอัตโนมัติ
            objectFit: "cover", // ป้องกันการบีบรูป
            maxHeight: { xs: "400px", sm: "600px", md: "800px" } // จำกัดความสูง
          }}
        />
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Kanit', sans-serif",
              fontWeight: "bold",
              color: "#2c3e50",
              mb: 2,
            }}
          >
            {newsItem.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Kanit', sans-serif",
              fontSize: "18px",
              lineHeight: 1.6,
              color: "#34495e",
            }}
          >
            {newsItem.description}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 3, display: "block", fontSize: "14px" }}
          >
            📅 วันที่เผยแพร่: {new Date(newsItem.created_at).toLocaleDateString("th-TH")}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NewsDetail;
