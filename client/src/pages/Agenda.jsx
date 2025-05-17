import React, { useState } from 'react';
import rmutlimage from "../assets/rmutlprojectimage.png";
import { Typography, Box, Link, Modal, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // For close button
import agenda from "../assets/agenda.jpg";
import pdfagenda from "../assets/pdfagenda.pdf";

function Agenda() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ textAlign: "center", padding: "20px" }}>
      {/* Header Image */}
      <Box
        component="img"
        src={rmutlimage}
        alt="RMUTL Project"
        sx={{
          maxWidth: "100%",
          height: "auto",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      />

      <Typography
        variant="h4"
        gutterBottom
        sx={{
          marginTop: "20px",
          fontWeight: "bold",
          fontFamily: "'Kanit', sans-serif",
        }}
      >
        สูจิบัตร การแข่งขันกีฬามหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ครั้งที่ 39 “พุทธรักษาเกมส์”
      </Typography>

      {/* Event Agenda Image */}
      <Box
        component="img"
        src={agenda}
        alt="Agenda"
        sx={{
          maxWidth: "100%",
          height: "auto",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          marginTop: "20px",
        }}
      />

      <Typography
        variant="h5"
        gutterBottom
        sx={{
          marginTop: "20px",
          fontWeight: "bold",
        }}
      >
        <Link
          component="button"
          onClick={handleOpen}
          sx={{
            textDecoration: "none",
            color: "black",
            fontWeight: "bold",
            "&:hover": {
              textDecoration: "underline",
              cursor: "pointer",
              color: "blue",
            },
          }}
        >
          ⬇ คลิกที่นี่เพื่อดูสูจิบัตรการแข่งขัน
        </Link>
      </Typography>

      {/* Modal Popup */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-pdf-title"
        aria-describedby="modal-pdf-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "70%" },
            height: { xs: "80%", md: "80%" },
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
  src={`${pdfagenda}#zoom=100`}
  title="Agenda PDF"
  width="100%"
  height="100%"
  style={{ border: "none", borderRadius: "10px" }}
></iframe>
        </Box>
      </Modal>
    </Box>
  );
}

export default Agenda;
