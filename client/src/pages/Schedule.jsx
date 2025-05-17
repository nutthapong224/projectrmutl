import React, { useState } from "react";
import rmutlimage from "../assets/rmutlprojectimage.png";
import { Typography, Box, Modal, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import schedule1 from "../assets/schedule1.jpg";
import schedule2 from "../assets/schedule2.jpg";
import schedule3 from "../assets/schedule3.jpg";
import schedule4 from "../assets/schedule4.jpg";
import schedulepdf from "../assets/schedulepdf.pdf";

function Schedule() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        maxWidth: "1000px",
        margin: "auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {/* Header Image */}
      <Box
        component="img"
        src={rmutlimage}
        alt="RMUTL Project"
        sx={{
          width: "100%",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      />

      {/* Title */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "'Kanit', sans-serif",
          fontWeight: "bold",
          marginTop: "20px",
          color: "#333",
        }}
      >
        สูจิบัตร การแข่งขันกีฬามหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ครั้งที่ 39
        “พุทธรักษาเกมส์”
      </Typography>

      {/* Schedule Images */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr" },
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {[schedule1, schedule2, schedule3, schedule4].map((image, index) => (
          <Box
            key={index}
            component="img"
            src={image}
            alt={`Schedule ${index + 1}`}
            sx={{
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          />
        ))}
      </Box>

      {/* Button to open PDF Modal */}
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          marginTop: "30px",
          fontFamily: "'Kanit', sans-serif",
          fontWeight: "bold",
        }}
      >
        ⬇ ต้องการดาวโหลดตารางการแข่งขัน
      </Button>

      {/* Modal PDF Viewer */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "70%" },
            height: { xs: "80%", md: "90%" },
            bgcolor: "background.paper",
            borderRadius: "10px",
            boxShadow: 24,
            p: 2,
            overflow: "hidden",
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <iframe
            src={`${schedulepdf}#zoom=100`}
            title="Schedule PDF"
            width="100%"
            height="100%"
            style={{ border: "none", borderRadius: "10px" }}
          ></iframe>

          {/* Download link inside modal */}
          <Box sx={{ textAlign: "right", marginTop: "10px" }}>
            <a
              href={schedulepdf}
              download="schedule.pdf"
              style={{
                textDecoration: "none",
                fontFamily: "'Kanit', sans-serif",
                fontWeight: "bold",
                color: "#1976d2",
              }}
            >
              ดาวน์โหลด PDF
            </a>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Schedule;
