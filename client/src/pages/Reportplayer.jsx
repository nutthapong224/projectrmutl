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
import logormutl from "../assets/logormutl.png";
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import card from "../assets/card.jpg";
import logol from "../assets/logol.jpg";
const Reportplayer = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL_APPROVEFOOTBAL;
  const [users, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showData, setShowData] = useState(false); // Flag to control data visibility
  const [isFormValid, setIsFormValid] = useState(false); // New state to track form validity
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    department: false,
    sport: false,
    category: false,
  });

  // States for notifications and dialogs
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dialog, setDialog] = useState({ open: false, id: null, action: "" });

  // States for modals
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // States for name search
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // States for filters
  const [departments, setDepartments] = useState([]);
  const [positiondirector, setPositionDirector] = useState([]);
  const [sportTypes, setSportTypes] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPositionDirector, setSelectedPositionDirector] = useState("");
  const [selectedSportType, setSelectedSportType] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ category_id: "" });
  const [selectedCategory, setSelectedCategory] = useState("");
  const sports = [
    { value: "football", label: "ฟุตบอล"},
    { value: "futsal", label: "ฟุตซอล" },
    { value: "basketball", label: "บาสเก็ตบอล" },
    { value: "badminton", label: "แบดมินตัน"},
    { value: "tabletenis", label: "เทเบิลเทนิส" },
    { value: "takraw", label: "เซปักตะกร้อ" },
    { value: "volleyball", label: "วอลเลย์บอล" },
    { value: "hooptakraw", label: "ตะกร้อลอดห่วง" },
    { value: "esport", label: "e-sport" },
    { value: "petanque", label: "เปตอง" },
  ];

  // Check form validity whenever any input changes
  useEffect(() => {
    const isValid = 
      firstName.trim() !== "" && 
      lastName.trim() !== "" && 
      selectedDepartment !== "" && 
      selectedSport !== "" && 
      selectedCategory !== "";
    
    setIsFormValid(isValid);
  }, [firstName, lastName, selectedDepartment, selectedSport, selectedCategory]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };
  
  const fetchCategoriesBySportType = async (sportType) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/category/${sportType}`);
      setCategories(response.data.categories);  // Assuming response contains categories array
    } catch (err) {
      setError("Failed to load categories.");
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

  // Enhanced validation function
  const validateForm = () => {
    const newErrors = {
      firstName: firstName.trim() === "",
      lastName: lastName.trim() === "",
      department: selectedDepartment === "",
      sport: selectedSport === "",
      category: selectedCategory === ""
    };
    
    setFormErrors(newErrors);
    
    // Show error message for all empty fields
    if (Object.values(newErrors).some(error => error)) {
      const errorMessages = [];
      
      if (newErrors.firstName) errorMessages.push("กรุณากรอกชื่อ");
      if (newErrors.lastName) errorMessages.push("กรุณากรอกนามสกุล");
      if (newErrors.department) errorMessages.push("กรุณาเลือกวิทยาเขต");
      if (newErrors.sport) errorMessages.push("กรุณาเลือกประเภทกีฬา");
      if (newErrors.category) errorMessages.push("กรุณาเลือกประเภท");
      
      setSnackbar({
        open: true,
        message: "กรุณากรอกข้อมูลให้ครบทุกช่อง: " + errorMessages.join(", "),
        severity: "error"
      });
      
      return false;
    }
    
    return true;
  };

  const fetchUsers = async () => {
    // Always validate form before proceeding
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:5000/api/players/searchpending`;
      const params = new URLSearchParams();

      if (selectedDepartment) {
        params.append('department', selectedDepartment);
      }
      if (selectedSport) {
        params.append('sport_table', selectedSport);
      }
      if (selectedCategory) {
        params.append('category_id', selectedCategory);
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
          message: "ไม่พบข้อมูลนักกีฬาที่ตรงกับเงื่อนไขการค้นหา",
          severity: "info"
        });
      } else {
        setSnackbar({
          open: true,
          message: `พบนักกีฬา ${response.data.length} คน`,
          severity: "success"
        });
      }
    } catch (err) {
      setError(err.response?.data || "Failed to fetch pending users.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ดึงข้อมูลหน่วยงาน/วิทยาเขตเมื่อโหลดคอมโพเนนต์ครั้งแรก
    fetchDepartments();
  }, []);
  
  useEffect(() => {
    if (selectedSport) {
      // ใช้ API call เพียงครั้งเดียว
      axios.get(`http://localhost:5000/api/sports/category/${selectedSport}`)
        .then(response => {
          const categoryData = response.data.categories || response.data;
          console.log("โหลดข้อมูลประเภทกีฬาสำเร็จ:", categoryData);
          setCategories(categoryData);
        })
        .catch(error => {
          console.error("ไม่สามารถโหลดข้อมูลประเภทกีฬาได้:", error);
          setCategories([]);
        });
    } else {
      // ถ้าไม่มีการเลือกกีฬา ให้เคลียร์ข้อมูลประเภทกีฬา
      setCategories([]);
      setSelectedCategory(""); // รีเซ็ตค่าที่เลือกไว้ด้วย
    }
  }, [selectedSport]); // ดำเนินการเฉพาะเมื่อ selectedSport เปลี่ยน

  const handleSearch = () => {
    fetchUsers();
  };

  // Reset all filters and hide data
  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedCategory("");
    setSelectedSport("");
    setFirstName("");
    setLastName("");
    setShowData(false);
    setPendingUsers([]);
    setError("");
    setFormErrors({
      firstName: false,
      lastName: false,
      department: false,
      sport: false,
      category: false,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      setFormData(prev => ({ ...prev, [name]: value }));
      setSelectedCategory(value);
      setFormErrors(prev => ({ ...prev, category: value === "" }));
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
              <br>${user.status} ${user.category_name}
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
        
        <!-- สามเหลี่ยมตกแต่งด้านขวา -->
        <div style="
          position: absolute;
          top: 30%;
          right: 10%;
          width: 0;
          height: 0;
          border-top: 50px solid transparent;
          border-right: 100px solid #f1c40f;
          border-bottom: 50px solid transparent;
          opacity: 0.5;
          z-index: 1;
        "></div>
        
        <div style="
          position: absolute;
          top: 45%;
          right: 20%;
          width: 0;
          height: 0;
          border-top: 40px solid transparent;
          border-left: 80px solid #cccccc;
          border-bottom: 40px solid transparent;
          opacity: 0.5;
          z-index: 1;
        "></div>
  
        <!-- เนื้อหาตรงกลาง -->
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
            <br>${user.status} ${user.category_name}
            <br>ให้ไว้ ณ วันที่ ๖ ธันวาคม ๒๕๖๗
          </p>
        </div>
        
        <!-- ลายเซ็น -->
        <div style="
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 2;
        ">
          <div style="font-size: 35px; color: #666; margin-bottom: 5px;">____________________</div>
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
            พิมพ์เกียรตินักกีฬา
          </Typography>
          
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              ค้นหานักกีฬา
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="ชื่อ *"
                  variant="outlined"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFormErrors({...formErrors, firstName: e.target.value.trim() === ""});
                  }}
                  error={formErrors.firstName}
                  helperText={formErrors.firstName ? "กรุณากรอกชื่อ" : ""}
                  required
                  onBlur={() => setFormErrors({...formErrors, firstName: firstName.trim() === ""})}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label="นามสกุล *"
                  variant="outlined"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setFormErrors({...formErrors, lastName: e.target.value.trim() === ""});
                  }}
                  error={formErrors.lastName}
                  helperText={formErrors.lastName ? "กรุณากรอกนามสกุล" : ""}
                  required
                  onBlur={() => setFormErrors({...formErrors, lastName: lastName.trim() === ""})}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth error={formErrors.department} required>
                  <InputLabel>วิทยาเขต</InputLabel>
                  <Select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setFormErrors({...formErrors, department: e.target.value === ""});
                    }}
                  >
                    <MenuItem value="">เลือกวิทยาเขต</MenuItem>
                    {departments.map((department) => (
                      <MenuItem key={department.id} value={department.name}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.department && <FormHelperText>กรุณาเลือกวิทยาเขต</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth error={formErrors.sport} required>
                  <InputLabel>กีฬา</InputLabel>
                  <Select
                    value={selectedSport}
                    onChange={(e) => {
                      setSelectedSport(e.target.value);
                      setFormErrors({...formErrors, sport: e.target.value === ""});
                      // Reset category when sport changes
                      setSelectedCategory("");
                    }}
                  >
                    <MenuItem value="">เลือกประเภทกีฬา</MenuItem>
                    {sports.map((sport) => (
                      <MenuItem key={sport.value} value={sport.value}>
                        {sport.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.sport && <FormHelperText>กรุณาเลือกประเภทกีฬา</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth error={formErrors.category} disabled={!selectedSport} required>
                  <InputLabel>ประเภท</InputLabel>
                  <Select
                    name="category_id"
                    value={selectedCategory}
                    onChange={(e) => {
                      handleInputChange(e);
                      setSelectedCategory(e.target.value);
                      setFormErrors({...formErrors, category: e.target.value === ""});
                    }}
                  >
                    <MenuItem value="">เลือกประเภท</MenuItem>
                    {categories && Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((cat) => (
                        <MenuItem key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem value="">
                        <em>ไม่มีประเภทกีฬา</em>
                      </MenuItem>
                    )}
                  </Select>
                  {formErrors.category && <FormHelperText>กรุณาเลือกประเภท</FormHelperText>}
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
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" elevation={6}>
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
                    <TableCell sx={{ fontWeight: "bold" }}>กีฬา</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>ประเภท</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>วิทยาเขต</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>พิมพ์</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        ไม่พบข้อมูลนักกีฬา
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          {user.title} {user.fname} {user.lname}
                        </TableCell>
                        <TableCell>{user.sport_table}</TableCell>
                        <TableCell>{user.category_name}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => generatePdf(user)}
                            startIcon={<PictureAsPdfIcon />}
                            sx={{ 
                              textTransform: 'none',
                              borderRadius: '8px'
                            }}
                          >
                            พิมพ์เกียรติบัตร
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

export default Reportplayer;