import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Modal,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Stack,
  Card,
  CardContent,
  Divider,
  FormHelperText,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import logormutl from "../assets/logormutl.png";
import logol from "../assets/logol.jpg";

const Reportdirector = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL_ESPORT;
  const [users, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showData, setShowData] = useState(false); // Flag to control data visibility
  const [pdfGenerating, setPdfGenerating] = useState(false); // State for PDF generation progress
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isFormValid, setIsFormValid] = useState(false); // State to track form validity

  // States for name search
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // States for filters
  const [departments, setDepartments] = useState([]);
  const [positiondirector, setPositionDirector] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPositionDirector, setSelectedPositionDirector] = useState("");
  const [selectedSport, setSelectedSport] = useState("");

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    department: false,
    position: false,
    sport: false,
  });

  const sports = [
    { value: "ฟุตบอล", label: "ฟุตบอล" },
    { value: "ฟุตซอล", label: "ฟุตซอล" },
    { value: "บาสเก็ตบอล", label: "บาสเก็ตบอล" },
    { value: "แบดมินตัน", label: "แบดมินตัน"}, 
    { value: "เทเบิลเทนิส", label: "เทเบิลเทนิส" },
    { value: "เซปักตะกร้อ", label: "เซปักตะกร้อ" },
    { value: "วอลเลย์บอล", label: "วอลเลย์บอล" },
    { value: "ตะกร้อลอดห่วง", label: "ตะกร้อลอดห่วง" },
    { value: "esport", label: "e-sport" },
    { value: "เปตอง", label: "เปตอง" },
  ];

  // Check form validity whenever any input changes
  useEffect(() => {
    const isValid = 
      firstName.trim() !== "" || 
      lastName.trim() !== "" || 
      selectedDepartment !== "" || 
      selectedPositionDirector !== "" || 
      selectedSport !== "";
    
    setIsFormValid(isValid);
  }, [firstName, lastName, selectedDepartment, selectedPositionDirector, selectedSport]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };
  
  const fetchpositionDirector = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/positiondirector");
      setPositionDirector(response.data);
    } catch (err) {
      console.error("Failed to fetch position directors:", err);
    }
  };

  // Validate that at least one filter is set
  const validateForm = () => {
    const hasAtLeastOneFilter = 
      firstName.trim() !== "" ||
      lastName.trim() !== "" ||
      selectedDepartment !== "" ||
      selectedPositionDirector !== "" ||
      selectedSport !== "";
    
    if (!hasAtLeastOneFilter) {
      setSnackbar({
        open: true,
        message: "กรุณาระบุอย่างน้อยหนึ่งเงื่อนไขในการค้นหา",
        severity: "error"
      });
      return false;
    }
    
    return true;
  };
 
  const fetchUsers = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:5000/api/director/search`;
      const params = new URLSearchParams();
   
      if (selectedDepartment) {
        params.append('department', selectedDepartment);
      } 
      if (selectedPositionDirector) {
        params.append('position', selectedPositionDirector);
      }
      if (selectedSport) {
        params.append('sport_type', selectedSport);
      }
      // Add name filters
      if (firstName) {
        params.append('fname', firstName);
      }
      if (lastName) {
        params.append('lname', lastName);
      }
  
      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      console.log("Fetching data from:", fullUrl);
   
      const response = await axios.get(fullUrl);
      setPendingUsers(response.data);
      setShowData(true); // Show data after successful fetch
      
      // Show success message
      if (response.data.length === 0) {
        setSnackbar({
          open: true,
          message: "ไม่พบข้อมูลกรรมการที่ตรงกับเงื่อนไขการค้นหา",
          severity: "info"
        });
      } else {
        setSnackbar({
          open: true,
          message: `พบกรรมการ ${response.data.length} คน`,
          severity: "success"
        });
      }
    } catch (err) {
      setError(err.response?.data || "Failed to fetch data.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchpositionDirector();
    fetchDepartments();
  }, []);

  const handleSearch = () => {
    fetchUsers();
  };

  // Reset all filters and hide data
  const handleResetFilters = () => {
    setFirstName("");
    setLastName("");
    setSelectedDepartment("");
    setSelectedPositionDirector("");
    setSelectedSport("");
    setShowData(false); // Hide the data table
    setPendingUsers([]); // Clear existing data
    setError(""); // Clear any errors
    setFormErrors({
      firstName: false,
      lastName: false,
      department: false,
      position: false,
      sport: false,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({...snackbar, open: false});
  };

  const generatePdf = (user) => {
    // Set PDF generating state
    setPdfGenerating(true);
    
    // Convert image to Base64 to include in the PDF
    const logoImg = document.createElement('img');
    logoImg.src = logormutl;
    
    // Wait for the image to load before generating PDF
    logoImg.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = logoImg.width;
      canvas.height = logoImg.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(logoImg, 0, 0);
      const logoBase64 = canvas.toDataURL('image/png');
      
      const content = `
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap" rel="stylesheet">
        <div style="
          font-family: 'Kanit', sans-serif;
          width: 297mm;
          height: 210mm;
          position: relative;
          overflow: hidden;
          background-color: white;
          margin: 0;
          padding: 0;
        ">
          <!-- พื้นหลังและตกแต่ง -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 15%;
            background: linear-gradient(180deg, #b78d49 0%, #b78d49 100%);
            z-index: 1;
          "></div>
          
          <div style="
            position: absolute;
            top: 0;
            left: 10%;
            height: 100%;
            width: 5%;
            background: linear-gradient(180deg, #f1c40f 0%, #f1c40f 100%);
            z-index: 1;
          "></div>
          
          <!-- จุดด้านขวา -->
          <div style="
            position: absolute;
            top: 0;
            right: 0;
            height: 100%;
            width: 20%;
            background-image: radial-gradient(#f1c40f 2px, transparent 2px);
            background-size: 20px 20px;
            z-index: 1;
          "></div>

  
          <!-- ตราสัญลักษณ์มหาวิทยาลัย -->
          <div style="
            position: absolute;
            top: 5%;
          margin-top: -20px; 
            left: 55%;
            transform: translateX(-50%);
            z-index: 2;
          ">
            <img src="${logormutl}" width="100" alt="มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา" />
          </div>
          
          <!-- เนื้อหาตรงกลาง -->
          <div style="
            position: absolute;
            top: 50%;
            left: 55%;
            transform: translate(-50%, -50%);
            width: 75%;
            text-align: center;
            z-index: 2;
          ">
            <h1 style="font-size: 34px; font-weight: bold; margin-bottom: 10px; color: #333;">มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา</h1>
            <p style="font-size: 22px; color: #555; margin-bottom: 20px;">ขอมอบเกียรติบัตรฉบับนี้ไว้เพื่อแสดงว่า</p>
            
            <p style="font-size: 32px; color: #000; font-weight: bold; margin: 30px 0;">${user.title} ${user.fname} ${user.lname}</p>
            
            <p style="font-size: 22px; line-height: 1.6; color: #444;">
              การแข่งขันกีฬามหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ครั้งที่ ๓๘ "พุทธรักษาเกมส์"
              <br>ระหว่างวันที่ ๑ - ๖ ธันวาคม ๒๕๖๗
              <br>ณ มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา น่าน
              <br>ได้ปฏิบัติหน้าที่ ${user.position} ${user.sport_type}
              <br>ให้ไว้ ณ วันที่ ๖ ธันวาคม ๒๕๖๗
            </p>
          </div>
          
          <!-- ลายเซ็น -->
          <div style="
            position: absolute;
            bottom: 10%;
            left: 55%;
            transform: translateX(-50%);
            text-align: center;
            z-index: 2;
            margin-top:10px
          ">
          
                 <div style="
            position: absolute;
            top: 5%;
          margin-top: -50px; 
                margin-left: -5px; 
            left: 55%;
            transform: translateX(-50%);
            z-index: 2;
          ">
            <img src="${logol}" width="200" alt="มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา" />
          </div>
            <p style="font-size: 18px; margin-top: 5px; line-height: 1.5;">
              (รองศาสตราจารย์ อุเทน คำน่าน)<br>
              รักษาการแทน<br>
              อธิการบดีมหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา
            </p>
          </div>
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
  
      html2pdf().from(element).set(opt).save().then(() => {
        // Show success notification and reset PDF generating state
        setPdfGenerating(false);
        setSnackbar({
          open: true,
          message: "สร้างเกียรติบัตร PDF สำเร็จ",
          severity: "success"
        });
      });
    };
    
    // Handle error if image fails to load
    logoImg.onerror = function() {
      console.error("Failed to load logo image");
      setPdfGenerating(false);
      setError("Failed to load logo image. PDF creation failed.");
      // Fallback to generate PDF without the logo
      generatePdfWithoutLogo(user);
    };
  };

  // Fallback function if logo image fails to load
  const generatePdfWithoutLogo = (user) => {
    const content = `
      <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap" rel="stylesheet">
      <div style="
        font-family: 'Kanit', sans-serif;
        width: 297mm;
        height: 210mm;
        position: relative;
        overflow: hidden;
        background-color: white;
        margin: 0;
        padding: 0;
      ">
        <!-- Content without logos -->
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 75%;
          text-align: center;
          z-index: 2;
        ">
          <h1 style="font-size: 34px; font-weight: bold; margin-bottom: 10px; color: #333;">มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา</h1>
          <p style="font-size: 22px; color: #555; margin-bottom: 20px;">ขอมอบเกียรติบัตรฉบับนี้ไว้เพื่อแสดงว่า</p>
          
          <p style="font-size: 32px; color: #000; font-weight: bold; margin: 30px 0;">${user.title} ${user.fname} ${user.lname}</p>
          
          <p style="font-size: 22px; line-height: 1.6; color: #444;">
            การแข่งขันกีฬามหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา ครั้งที่ ๓๘ "พุทธรักษาเกมส์"
            <br>ระหว่างวันที่ ๑ - ๖ ธันวาคม ๒๕๖๗
            <br>ณ มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา น่าน
            <br>ได้ปฏิบัติหน้าที่ ${user.position} ${user.sport_type}
            <br>ให้ไว้ ณ วันที่ ๖ ธันวาคม ๒๕๖๗
          </p>
        </div>
        
        <div style="
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 2;
        ">
          <p style="font-size: 18px; margin-top: 5px; line-height: 1.5;">
            (รองศาสตราจารย์ อุเทน คำน่าน)<br>
            รักษาการแทน<br>
            อธิการบดีมหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา
          </p>
        </div>
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

    html2pdf().from(element).set(opt).save().then(() => {
      setPdfGenerating(false);
      setSnackbar({
        open: true,
        message: "สร้างเกียรติบัตร PDF สำเร็จ",
        severity: "success"
      });
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: "bold", 
            textAlign: "center",
            color: "#1976d2",
            mb: 3
          }}>
            พิมพ์เกียรติบัตรกรรมการ
          </Typography>
          
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              ค้นหากรรมการ
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  variant="outlined"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="นามสกุล"
                  variant="outlined"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>วิทยาเขต</InputLabel>
                  <Select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <MenuItem value=""><em>ทั้งหมด</em></MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>ประเภทการคุม</InputLabel>
                  <Select
                    value={selectedPositionDirector}
                    onChange={(e) => setSelectedPositionDirector(e.target.value)}
                  >
                    <MenuItem value=""><em>ทั้งหมด</em></MenuItem>
                    {Array.isArray(positiondirector)
                      ? positiondirector.map((pos) => (
                          <MenuItem key={pos.id} value={pos.name}>
                            {pos.name}
                          </MenuItem>
                        ))
                      : <MenuItem value=""><em>โหลดข้อมูล...</em></MenuItem>}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>ประเภทกีฬา</InputLabel>
                  <Select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                  >
                    <MenuItem value=""><em>ทั้งหมด</em></MenuItem>
                    {sports.map(sport => (
                      <MenuItem key={sport.value} value={sport.value}>{sport.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    height: '56px',
                    ...(isFormValid && {
                      backgroundColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: '#115293',
                      },
                    }),
                  }}
                  onClick={handleSearch}
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                >
                  ค้นหา
                </Button>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleResetFilters}
                startIcon={<RefreshIcon />}
                sx={{ px: 4, py: 1 }}
              >
                รีเซ็ตการค้นหา
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={3000}
          onClose={() => setError("")}
        >
          <Alert severity="error" variant="filled" elevation={6}>
            {error}
          </Alert>
        </Snackbar>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" elevation={6}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {showData && (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              ผลการค้นหา
            </Typography>
            
            <TableContainer component={Paper} sx={{ mt: 2, boxShadow: "none" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: "bold" }}>ชื่อ - นามสกุล</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ตำแหน่ง</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ประเภทกีฬาที่คุม</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>พิมพ์</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        ไม่พบข้อมูลกรรมการ
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          {user.title} {user.fname} {user.lname}
                        </TableCell>
                        <TableCell>{user.position}</TableCell>
                        <TableCell>{user.sport_type}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => generatePdf(user)}
                            disabled={pdfGenerating}
                            startIcon={<PictureAsPdfIcon />}
                            sx={{ 
                              textTransform: 'none',
                              borderRadius: '8px'
                            }}
                          >
                            {pdfGenerating ? 'กำลังสร้าง...' : 'พิมพ์เกียรติบัตร'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Reportdirector;