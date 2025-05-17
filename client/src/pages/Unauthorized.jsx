import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <LockOutlined sx={{ fontSize: 60, color: "error.main" }} />
        <Typography variant="h4" color="error">
          Unauthorized Access
        </Typography>
        <Typography variant="body1" color="textSecondary">
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้ โปรดตรวจสอบสิทธิ์ของคุณ
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate("/loginpage")}
        >
          กลับไปหน้าหลัก
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;
