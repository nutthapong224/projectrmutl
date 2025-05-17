import React, { useEffect, useState } from "react";
import axios from "axios";
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
  TextField,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Avatar,
  Tooltip,
  FormHelperText
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import { useNavigate } from "react-router-dom";

const Searchdirector = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL_ESPORT;
  const [users, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showData, setShowData] = useState(false);

  // States for notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // States for filters
  const [departments, setDepartments] = useState([]);
  const [positiondirector, setPositionDirector] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPositionDirector, setSelectedPositionDirector] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  
  // Add states for name search
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  
  // Enhanced validation system
  const [fieldErrors, setFieldErrors] = useState({
    fname: { error: false, message: "" },
    lname: { error: false, message: "" },
    department: { error: false, message: "" },
    position: { error: false, message: "" },
    sport: { error: false, message: "" }
  });
  
  // State to track if form has been interacted with
  const [formTouched, setFormTouched] = useState({
    fname: false,
    lname: false,
    department: false,
    position: false,
    sport: false
  });
  
  // State to track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const navigate = useNavigate();

  const sports = [
    { value: "ฟุตบอล", label: "ฟุตบอล", icon: "⚽" },
    { value: "ฟุตซอล", label: "ฟุตซอล", icon: "⚽" },
    { value: "บาสเก็ตบอล", label: "บาสเก็ตบอล", icon: "🏀" },
    { value: "แบดมินตัน", label: "แบดมินตัน", icon: "🏸" },
    { value: "เทเบิลเทนิส", label: "เทเบิลเทนิส", icon: "🏓" },
    { value: "เซปักตะกร้อ", label: "เซปักตะกร้อ", icon: "🥎" },
    { value: "วอลเลย์บอล", label: "วอลเลย์บอล", icon: "🏐" },
    { value: "ตะกร้อลอดห่วง", label: "ตะกร้อลอดห่วง", icon: "🥎" },
    { value: "esport", label: "e-sport", icon: "🎮" },
    { value: "เปตอง", label: "เปตอง", icon: "🥎" },
  ];

  const handleSearchDirector = (id) => {
    return () => {
      navigate(`/director/${id}`);
    };
  };
  
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/department`);
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

  const fetchpositionDirector = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/positiondirector`);
      setPositionDirector(response.data);
    } catch (err) {
      console.error("Failed to fetch position directors:", err);
      setSnackbar({
        open: true,
        message: "ไม่สามารถเรียกข้อมูลประเภทการคุมได้",
        severity: "error"
      });
    }
  };
 
  // ฟังก์ชัน validateInput เพื่อตรวจสอบความถูกต้องของข้อมูลในแต่ละฟิลด์
  const validateInput = (field, value, required = true) => {
    // กรณีที่ฟิลด์จำเป็นต้องกรอกแต่เป็นค่าว่าง
    if (required && (!value || value.trim() === "")) {
      switch (field) {
        case 'fname':
          return { error: true, message: "กรุณากรอกชื่อ" };
        case 'lname':
          return { error: true, message: "กรุณากรอกนามสกุล" };
        case 'department':
          return { error: true, message: "กรุณาเลือกวิทยาเขต" };
        case 'position':
          return { error: true, message: "กรุณาเลือกประเภทการคุม" };
        case 'sport':
          return { error: true, message: "กรุณาเลือกประเภทกีฬา" };
        default:
          return { error: true, message: "กรุณากรอกข้อมูล" };
      }
    }

    // กรณีที่มีข้อมูลแล้ว ตรวจสอบความถูกต้องของรูปแบบ
    if (value && value.trim() !== "") {
      // สำหรับชื่อและนามสกุล ให้เป็นตัวอักษรเท่านั้น (ภาษาไทยและอังกฤษ)
      if (field === 'fname' || field === 'lname') {
        // อนุญาตตัวอักษรภาษาไทย, อังกฤษ และเว้นวรรค
        const nameRegex = /^[ก-์a-zA-Z\s]+$/;
        if (!nameRegex.test(value)) {
          return { 
            error: true, 
            message: field === 'fname' 
              ? "ชื่อต้องเป็นตัวอักษรภาษาไทยหรืออังกฤษเท่านั้น" 
              : "นามสกุลต้องเป็นตัวอักษรภาษาไทยหรืออังกฤษเท่านั้น" 
          };
        }
        
        // ตรวจสอบความยาว
        if (value.length < 2) {
          return {
            error: true,
            message: field === 'fname'
              ? "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร"
              : "นามสกุลต้องมีความยาวอย่างน้อย 2 ตัวอักษร"
          };
        }
      }
    }

    // ถ้าผ่านการตรวจสอบทั้งหมด
    return { error: false, message: "" };
  };

  // ฟังก์ชันตรวจสอบความถูกต้องของทุกฟิลด์
  const validateFields = () => {
    const errors = {
      fname: validateInput('fname', searchFirstName),
      lname: validateInput('lname', searchLastName),
      department: validateInput('department', selectedDepartment),
      position: validateInput('position', selectedPositionDirector),
      sport: validateInput('sport', selectedSport)
    };
    
    setFieldErrors(errors);
    
    // ตรวจสอบว่ามี error หรือไม่
    return !Object.values(errors).some(field => field.error);
  };
  
  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ Text field
  const handleTextChange = (field, setter) => (event) => {
    const value = event.target.value;
    setter(value);
    
    // กำหนดให้ field นี้ถูก touched แล้ว
    setFormTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // ตรวจสอบความถูกต้องทันทีถ้า field ถูก touched หรือฟอร์มถูก submit แล้ว
    if (formTouched[field] || formSubmitted) {
      const validationResult = validateInput(field, value);
      setFieldErrors(prev => ({
        ...prev,
        [field]: validationResult
      }));
    }
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ Select field
  const handleSelectChange = (field, setter) => (event) => {
    const value = event.target.value;
    setter(value);
    
    // กำหนดให้ field นี้ถูก touched แล้ว
    setFormTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // ตรวจสอบความถูกต้องทันทีถ้า field ถูก touched หรือฟอร์มถูก submit แล้ว
    if (formTouched[field] || formSubmitted) {
      const validationResult = validateInput(field, value);
      setFieldErrors(prev => ({
        ...prev,
        [field]: validationResult
      }));
    }
  };

  // ฟังก์ชันสำหรับการออกจาก field (onBlur)
  const handleBlur = (field) => () => {
    // กำหนดให้ field นี้ถูก touched แล้ว
    setFormTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // ค้นหาค่าปัจจุบันของ field นี้
    const value = field === 'fname' ? searchFirstName : 
                  field === 'lname' ? searchLastName :
                  field === 'department' ? selectedDepartment :
                  field === 'position' ? selectedPositionDirector :
                  field === 'sport' ? selectedSport : '';
                  
    // ตรวจสอบความถูกต้องของ field นี้
    const validationResult = validateInput(field, value);
    setFieldErrors(prev => ({
      ...prev,
      [field]: validationResult
    }));
  };
  
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    
    try {
      let url = `http://localhost:5000/api/director/searchall`;
      const params = new URLSearchParams();
   
      params.append('department', selectedDepartment);
      params.append('position', selectedPositionDirector);
      params.append('sport_type', selectedSport);
      params.append('fname', searchFirstName.trim());
      params.append('lname', searchLastName.trim());
  
      const queryString = params.toString();
      const fullUrl = `${url}?${queryString}`;
   
      const response = await axios.get(fullUrl);
      setPendingUsers(response.data);
      setShowData(true);
      
      // แสดงข้อความตามผลลัพธ์การค้นหา
      if (response.data.length > 0) {
        setSnackbar({
          open: true,
          message: `พบข้อมูลกรรมการ ${response.data.length} รายการ`,
          severity: "success"
        });
      } else {
        setSnackbar({
          open: true,
          message: "ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา กรุณาตรวจสอบข้อมูลและลองอีกครั้ง",
          severity: "info"
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMessage = err.response?.data?.message || "ไม่สามารถดึงข้อมูลกรรมการได้ กรุณาลองใหม่อีกครั้ง";
      setError(errorMessage);
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // ฟังก์ชันสำหรับการค้นหา
  const handleSearch = () => {
    setFormSubmitted(true);
    
    // กำหนดให้ทุก field ถูก touched แล้ว
    setFormTouched({
      fname: true,
      lname: true,
      department: true,
      position: true,
      sport: true
    });
    
    // ตรวจสอบความถูกต้องของทุกฟิลด์
    if (!validateFields()) {
      setSnackbar({
        open: true,
        message: "กรุณาแก้ไขข้อมูลที่ไม่ถูกต้องก่อนทำการค้นหา",
        severity: "warning"
      });
      return;
    }
    
    // ถ้าทุกฟิลด์ถูกต้อง ให้ดำเนินการค้นหา
    fetchUsers();
  };
  
  useEffect(() => {
    fetchpositionDirector();
    fetchDepartments();
  }, []);
  
  // ตรวจสอบความถูกต้องทุกครั้งที่มีการเปลี่ยนแปลงข้อมูลและฟอร์มถูก touched หรือ submitted แล้ว
  useEffect(() => {
    if (formSubmitted || Object.values(formTouched).some(touched => touched)) {
      validateFields();
    }
  }, [
    searchFirstName, 
    searchLastName, 
    selectedDepartment, 
    selectedPositionDirector, 
    selectedSport
  ]);

  // รองรับการกดปุ่ม Enter ในช่องค้นหา
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // รีเซ็ตฟิลเตอร์ทั้งหมด
  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedPositionDirector("");
    setSelectedSport("");
    setSearchFirstName("");
    setSearchLastName("");
    setShowData(false);
    setPendingUsers([]);
    setError("");
    
    // รีเซ็ตสถานะการตรวจสอบ
    setFieldErrors({
      fname: { error: false, message: "" },
      lname: { error: false, message: "" },
      department: { error: false, message: "" },
      position: { error: false, message: "" },
      sport: { error: false, message: "" }
    });
    
    setFormTouched({
      fname: false,
      lname: false,
      department: false,
      position: false,
      sport: false
    });
    
    setFormSubmitted(false);
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  const getSportIcon = (sportValue) => {
    const sport = sports.find(s => s.value === sportValue);
    return sport ? sport.icon : "🏅";
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            ค้นหาข้อมูลกรรมการ
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            ค้นหาและพิมพ์บัตรประจำตัวกรรมการ
          </Typography>
          <Typography variant="subtitle2" color="error" sx={{ mt: 1 }}>
            *กรุณากรอกข้อมูลให้ครบทุกช่องเพื่อทำการค้นหา
          </Typography>
        </Box>
        
        <Card variant="outlined" sx={{ mb: 4, backgroundColor: "#f9f9f9" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }} color="primary">
              <SearchIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              ค้นหากรรมการ
            </Typography>
            
            <Grid container spacing={3}>
              {/* ค้นหาตามชื่อ */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  required
                  fullWidth
                  label="ชื่อ"
                  variant="outlined"
                  value={searchFirstName}
                  onChange={handleTextChange('fname', setSearchFirstName)}
                  onBlur={handleBlur('fname')}
                  placeholder="ค้นหาตามชื่อ"
                  onKeyPress={handleKeyPress}
                  error={fieldErrors.fname.error}
                  helperText={fieldErrors.fname.message}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              
              {/* ค้นหาตามนามสกุล */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  required
                  fullWidth
                  label="นามสกุล"
                  variant="outlined"
                  value={searchLastName}
                  onChange={handleTextChange('lname', setSearchLastName)}
                  onBlur={handleBlur('lname')}
                  placeholder="ค้นหาตามนามสกุล"
                  onKeyPress={handleKeyPress}
                  error={fieldErrors.lname.error}
                  helperText={fieldErrors.lname.message}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>
              
              {/* วิทยาเขต */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth required error={fieldErrors.department.error}>
                  <InputLabel>วิทยาเขต</InputLabel>
                  <Select
                    value={selectedDepartment}
                    onChange={handleSelectChange('department', setSelectedDepartment)}
                    onBlur={handleBlur('department')}
                    startAdornment={<SchoolIcon color="action" sx={{ mr: 1 }} />}
                    label="วิทยาเขต"
                  >
                    <MenuItem value="">เลือกวิทยาเขต</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.department.error && (
                    <FormHelperText error>{fieldErrors.department.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* ประเภทการคุม */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth required error={fieldErrors.position.error}>
                  <InputLabel>ประเภทการคุม</InputLabel>
                  <Select
                    value={selectedPositionDirector}
                    onChange={handleSelectChange('position', setSelectedPositionDirector)}
                    onBlur={handleBlur('position')}
                    startAdornment={<WorkIcon color="action" sx={{ mr: 1 }} />}
                    label="ประเภทการคุม"
                  >
                    <MenuItem value="">เลือกประเภทการคุม</MenuItem>
                    {Array.isArray(positiondirector)
                      ? positiondirector.map((pos) => (
                          <MenuItem key={pos.id} value={pos.name}>
                            {pos.name}
                          </MenuItem>
                        ))
                      : <MenuItem value=""><em>โหลดข้อมูล...</em></MenuItem>}
                  </Select>
                  {fieldErrors.position.error && (
                    <FormHelperText error>{fieldErrors.position.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* ประเภทกีฬา */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth required error={fieldErrors.sport.error}>
                  <InputLabel>ประเภทกีฬา</InputLabel>
                  <Select
                    name="sport_type"
                    value={selectedSport}
                    onChange={handleSelectChange('sport', setSelectedSport)}
                    onBlur={handleBlur('sport')}
                    startAdornment={<SportsSoccerIcon color="action" sx={{ mr: 1 }} />}
                    label="ประเภทกีฬา"
                  >
                    <MenuItem value="">เลือกประเภทกีฬา</MenuItem>
                    {sports.map(sport => (
                      <MenuItem key={sport.value} value={sport.value}>
                        {sport.icon} {sport.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.sport.error && (
                    <FormHelperText error>{fieldErrors.sport.message}</FormHelperText>
                  )}
                </FormControl>
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
                  label={`พบกรรมการ ${users.length} คน`} 
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
                      <TableCell>ตำแหน่ง</TableCell>
                      <TableCell>ประเภทกีฬาที่คุม</TableCell>
                      <TableCell align="center">ดำเนินการ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">ไม่พบข้อมูลกรรมการ</Typography>
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
                          <TableCell>
                            <Chip 
                              icon={<Typography>{getSportIcon(user.sport_type)}</Typography>}
                              label={user.sport_type || "-"} 
                              variant="outlined" 
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="พิมพ์บัตรประจำตัว">
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSearchDirector(user.registration_id)}
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 2,
                                }}
                                startIcon={<PrintIcon />}
                              >
                                พิมพ์บัตรประจำตัว
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

export default Searchdirector;