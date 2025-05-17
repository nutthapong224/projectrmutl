import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

import logormutl from "../assets/logormutl.png";
import logol from "../assets/logol.jpg";
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
  Snackbar,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  Tooltip,
  FormHelperText,
  TextField
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';

const Reportstudentorganization = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL_ESPORT;
  const [users, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showData, setShowData] = useState(false);

  // States for notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // States for filters
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  
  // States for name search
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // States for field validation
  const [fieldErrors, setFieldErrors] = useState({
    department: false,
    position: false,
    fname: false,
    lname: false
  });
  
  // Error messages for name validation
  const [nameErrorMessages, setNameErrorMessages] = useState({
    fname: "",
    lname: ""
  });
  
  // State to track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);

  const sports = [
    { value: 'สโมสรนักศึกษา', label: 'สโมสรนักศึกษา' },
    { value: 'องค์การนักศึกษา', label: 'องค์การนักศึกษา' },
  ];

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setSnackbar({
        open: true,
        message: "ไม่สามารถเรียกข้อมูลวิทยาเขตได้",
        severity: "error"
      });
    }
  };

  // Validate name fields
  const validateNameField = (field, value) => {
    // Check if empty (now required)
    if (!value || value.trim() === "") {
      return { isValid: false, message: `กรุณากรอก${field === 'fname' ? 'ชื่อ' : 'นามสกุล'}` };
    }
    
    // Check for minimum length
    if (value.trim().length < 2) {
      return { isValid: false, message: `${field === 'fname' ? 'ชื่อ' : 'นามสกุล'}ต้องมีความยาวอย่างน้อย 2 ตัวอักษร` };
    }
    
    // Check for Thai characters only (including spaces)
    // Unicode range for Thai: \u0E00-\u0E7F
    const thaiRegex = /^[\u0E00-\u0E7F\s]+$/;
    if (!thaiRegex.test(value)) {
      return { isValid: false, message: `${field === 'fname' ? 'ชื่อ' : 'นามสกุล'}ต้องเป็นภาษาไทยเท่านั้น` };
    }
    
    // Check for numbers or special characters
    const specialCharsRegex = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (specialCharsRegex.test(value)) {
      return { isValid: false, message: `${field === 'fname' ? 'ชื่อ' : 'นามสกุล'}ต้องไม่มีตัวเลขหรืออักขระพิเศษ` };
    }
    
    return { isValid: true, message: "" };
  };

  // Validate fields before search
  const validateFields = () => {
    // Validate required fields
    const errors = {
      department: selectedDepartment === "",
      position: selectedSport === "",
      fname: !firstName || firstName.trim() === "",  // Now required
      lname: !lastName || lastName.trim() === ""     // Now required
    };
    
    // Validate name fields
    const fnameValidation = validateNameField('fname', firstName);
    const lnameValidation = validateNameField('lname', lastName);
    
    errors.fname = !fnameValidation.isValid;
    errors.lname = !lnameValidation.isValid;
    
    setNameErrorMessages({
      fname: fnameValidation.message,
      lname: lnameValidation.message
    });
    
    setFieldErrors(errors);
    
    // Return true only if all fields are valid
    return !Object.values(errors).some(error => error);
  };
  
  const fetchUsers = async () => {
    setFormSubmitted(true);
    
    // Validate fields
    if (!validateFields()) {
      setSnackbar({
        open: true,
        message: "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง",
        severity: "warning"
      });
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:5000/api/studentorgranization/search`;
      const params = new URLSearchParams();
   
      if (selectedDepartment) {
        params.append('department', selectedDepartment);
      }
      if (selectedSport) {
        params.append('position', selectedSport);
      }
      // Add name search parameters
      if (firstName.trim()) {
        params.append('fname', firstName.trim());
      }
      if (lastName.trim()) {
        params.append('lname', lastName.trim());
      }
  
      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      console.log("Fetching data from:", fullUrl);
   
      const response = await axios.get(fullUrl);
      setPendingUsers(response.data);
      setShowData(true);
      
      // Show success message
      if (response.data.length > 0) {
        setSnackbar({
          open: true,
          message: `พบข้อมูลผู้ประสานงาน ${response.data.length} รายการ`,
          severity: "success"
        });
      } else {
        setSnackbar({
          open: true,
          message: "ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา",
          severity: "info"
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "ไม่สามารถดึงข้อมูลผู้ประสานงานได้");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSearch = () => {
    fetchUsers();
  };

  // Reset all filters and hide data
  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedSport("");
    setFirstName("");
    setLastName("");
    setShowData(false);
    setPendingUsers([]);
    setError("");
    setFieldErrors({
      department: false,
      position: false,
      fname: false,
      lname: false
    });
    setNameErrorMessages({
      fname: "",
      lname: ""
    });
    setFormSubmitted(false);
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  // Function to handle select field changes
  const handleSelectChange = (field, setter) => (event) => {
    setter(event.target.value);
    // Clear error for this field if it has a value now
    if (formSubmitted && event.target.value !== "") {
      setFieldErrors(prev => ({...prev, [field]: false}));
    }
  };

  // Function to handle text field changes (with validation)
  const handleTextChange = (field, setter) => (event) => {
    const value = event.target.value;
    setter(value);
    
    // Update field validation if form was already submitted
    if (formSubmitted) {
      const validation = validateNameField(field, value);
      setFieldErrors(prev => ({...prev, [field]: !validation.isValid}));
      setNameErrorMessages(prev => ({...prev, [field]: validation.message}));
    }
  };

  const generatePdf = (user) => {
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
              <br>ปฏิบัติหน้าที่ ${user.position}
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
  
      html2pdf().from(element).set(opt).save();
    };
    
    // Handle error if image fails to load
    logoImg.onerror = function() {
      console.error("Failed to load logo image");
      // Fallback to generate PDF without the logo
      generatePdfWithoutLogo(user);
    };
  };
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            พิมพ์เกียรติบัตรผู้ประสานงาน
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            ค้นหาและพิมพ์เกียรติบัตรผู้ประสานงาน
          </Typography>
        </Box>
        
        <Card variant="outlined" sx={{ mb: 4, backgroundColor: "#f9f9f9" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }} color="primary">
              <SearchIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              ค้นหาผู้ประสานงาน
            </Typography>
            
            <Grid container spacing={3}>
              {/* วิทยาเขต */}
              <Grid item xs={12} sm={6} md={6}>
                <FormControl 
                  fullWidth 
                  error={formSubmitted && fieldErrors.department}
                  required
                >
                  <InputLabel>วิทยาเขต *</InputLabel>
                  <Select
                    value={selectedDepartment}
                    onChange={handleSelectChange('department', setSelectedDepartment)}
                    startAdornment={<SchoolIcon color="action" sx={{ mr: 1 }} />}
                    label="วิทยาเขต *"
                  >
                    <MenuItem value=""><em>เลือกวิทยาเขต</em></MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formSubmitted && fieldErrors.department && (
                    <FormHelperText>กรุณาเลือกวิทยาเขต</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* ประเภทผู้ประสานงาน */}
              <Grid item xs={12} sm={6} md={6}>
                <FormControl 
                  fullWidth 
                  error={formSubmitted && fieldErrors.position}
                  required
                >
                  <InputLabel>ประเภทผู้ประสานงาน *</InputLabel>
                  <Select
                    value={selectedSport}
                    onChange={handleSelectChange('position', setSelectedSport)}
                    startAdornment={<WorkIcon color="action" sx={{ mr: 1 }} />}
                    label="ประเภทผู้ประสานงาน *"
                  >
                    <MenuItem value=""><em>เลือกประเภท</em></MenuItem>
                    {sports.map(sport => (
                      <MenuItem key={sport.value} value={sport.value}>{sport.label}</MenuItem>
                    ))}
                  </Select>
                  {formSubmitted && fieldErrors.position && (
                    <FormHelperText>กรุณาเลือกประเภทผู้ประสานงาน</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              {/* ชื่อ */}
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="ชื่อ *"
                  variant="outlined"
                  value={firstName}
                  onChange={handleTextChange('fname', setFirstName)}
                  error={formSubmitted && fieldErrors.fname}
                  helperText={formSubmitted && fieldErrors.fname ? nameErrorMessages.fname : ""}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  placeholder="ระบุชื่อเป็นภาษาไทย"
                  required
                />
              </Grid>
              
              {/* นามสกุล */}
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="นามสกุล *"
                  variant="outlined"
                  value={lastName}
                  onChange={handleTextChange('lname', setLastName)}
                  error={formSubmitted && fieldErrors.lname}
                  helperText={formSubmitted && fieldErrors.lname ? nameErrorMessages.lname : ""}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  placeholder="ระบุนามสกุลเป็นภาษาไทย"
                  required
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: 2,
                  fontWeight: "bold",
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "ค้นหา"}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleResetFilters}
                startIcon={<RefreshIcon />}
                sx={{ py: 1.5, px: 4, borderRadius: 2 }}
              >
                รีเซ็ตการค้นหา
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Snackbar for messages */}
        <Snackbar
          open={snackbar.open || Boolean(error)}
          autoHideDuration={6000}
          onClose={() => {
            setSnackbar({ ...snackbar, open: false });
            setError("");
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert 
            severity={error ? "error" : snackbar.severity} 
            variant="filled"
            onClose={() => {
              setSnackbar({ ...snackbar, open: false });
              setError("");
            }}
          >
            {error || snackbar.message}
          </Alert>
        </Snackbar>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {showData && !loading && (
          <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
                <Typography variant="h6" color="primary">
                  ผลการค้นหา
                </Typography>
                <Chip 
                  label={`พบผู้ประสานงาน ${users.length} คน`} 
                  color={users.length > 0 ? "primary" : "default"} 
                  variant="outlined" 
                />
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell>ลำดับ</TableCell>
                      <TableCell>ชื่อ-นามสกุล</TableCell>
                      <TableCell>ประเภทผู้ประสานงาน</TableCell>
                      <TableCell>วิทยาเขต</TableCell>
                      <TableCell align="center">ดำเนินการ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">ไม่พบข้อมูลผู้ประสานงาน</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user, index) => (
                        <TableRow 
                          key={user._id || index}
                          sx={{ '&:hover': { backgroundColor: '#f5f9ff' } }}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: `hsl(${index * 40}, 70%, 60%)` }}>
                                {user.fname ? user.fname.charAt(0) : "?"}
                              </Avatar>
                              <Typography>
                                {user.title} {user.fname} {user.lname}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={<WorkIcon fontSize="small" />}
                              label={user.position || "-"} 
                              variant="outlined" 
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{user.department || "-"}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="พิมพ์เกียรติบัตร">
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => generatePdf(user)}
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 2,
                                }}
                                startIcon={<PrintIcon />}
                              >
                                พิมพ์เกียรติบัตร
                              </Button>
                            </Tooltip>
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
      </Paper>
    </Container>
  );
};

export default Reportstudentorganization;