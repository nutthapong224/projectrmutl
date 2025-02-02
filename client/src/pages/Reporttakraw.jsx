import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const Reporttakraw = () => {
  const [users, setUsers] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL_TAKRAW;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const generatePdf = (user) => {
    const content = `
      <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap" rel="stylesheet">
      <div style="
        font-family: 'Kanit', sans-serif;
        width: 297mm;
        height: 210mm;
        padding: 20mm;
        text-align: center;
        background: linear-gradient(to bottom right, #ffffff, #f0f0f0);
        border: 20px double;
        position: relative;
      ">
        <h1 style="font-size: 40px; font-weight: bold;">มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา</h1>
        <p style="font-size: 24px; color: #333;">ขอมอบเกียรติบัตรฉบับนี้ไว้เพื่อแสดงว่า</p>
        <p style="font-size: 36px; color: #000; font-weight: bold; margin: 40px 0;">${user.prefix}${user.fname} ${user.lname}</p>
        <p style="font-size: 24px; color: #333; margin: 30px 0;">${user.status}${user.sport_type}</p>
        <p style="font-size: 24px; color: #333; margin: 30px 0;">การแข่งขันกีฬามหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ครั้งที่ ๓๘ "พุทธรักษาเกมส์"</p>
        <p style="font-size: 20px;">(รองศาสตราจารย์ อุเทน คำน่าน)<br>รักษาการแทน<br>อธิการบดีมหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา</p>
      </div>
    `;

    const element = document.createElement("div");
    element.innerHTML = content;

    const opt = {
      margin: 0,
      filename: `certificate_${user.fname}_${user.lname}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
        พิมพ์เกียรติบัตร
      </h1>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  backgroundColor: "#f0f0f0",
                  borderBottom: "2px solid #ddd",
                }}
              >
                ชื่อ
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  backgroundColor: "#f0f0f0",
                  borderBottom: "2px solid #ddd",
                }}
              >
                นามสกุล
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  backgroundColor: "#f0f0f0",
                  borderBottom: "2px solid #ddd",
                }}
              >
                ดำเนินการ
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                  "&:hover": { backgroundColor: "#f1f1f1" },
                }}
              >
                <TableCell>{user.fname}</TableCell>
                <TableCell>{user.lname}   </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => generatePdf(user)}
                    sx={{
                      textTransform: "none",
                      fontSize: "14px",
                      padding: "6px 12px",
                    }}
                  >
                    พิมพ์เกียรติบัตร
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Reporttakraw;
