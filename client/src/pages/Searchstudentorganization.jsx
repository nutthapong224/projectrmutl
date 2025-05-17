import React, { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import {
  Container,
  Typography,
  Table,
  TextField,
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
  FormHelperText
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from "react-router-dom";

const Searchstudentorganization = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL_ESPORT;
  const [users, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showData, setShowData] = useState(false);

  // States for notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // States for filters
  const [departments, setDepartments] = useState([]);
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  
  // States for field validation
  const [fieldErrors, setFieldErrors] = useState({
    fname: false,
    lname: false,
    department: false,
    position: false
  });
  
  // State to track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const navigate = useNavigate();

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

  // Validate fields before search - Modified to require all fields
  const validateFields = () => {
    const errors = {
      fname: searchFirstName.trim() === "",
      lname: searchLastName.trim() === "",
      department: selectedDepartment === "",
      position: selectedSport === ""
    };
    
    setFieldErrors(errors);
    
    // Return true only if all fields are filled
    return !Object.values(errors).some(error => error);
  };
  
  const fetchUsers = async () => {
    setFormSubmitted(true);
    
    // Validate fields
    if (!validateFields()) {
      setSnackbar({
        open: true,
        message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
        severity: "warning"
      });
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:5000/api/studentorgranization/searchall`;
      const params = new URLSearchParams();
   
      if (selectedDepartment) {
        params.append('department', selectedDepartment);
      }
      if (selectedSport) {
        params.append('position', selectedSport);
      }
      if (searchFirstName.trim()) {
        params.append('fname', searchFirstName.trim());
      }
      if (searchLastName.trim()) {
        params.append('lname', searchLastName.trim());
      }
  
      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;
   
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

  // Handle Enter key press in search fields
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  // Reset all filters and hide data
  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedSport("");
    setSearchFirstName("");
    setSearchLastName("");
    setShowData(false);
    setPendingUsers([]);
    setError("");
    setFieldErrors({
      fname: false,
      lname: false,
      department: false,
      position: false
    });
    setFormSubmitted(false);
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  const handleSearchDirector = (id) => {
    return () => {
      navigate(`/studentorgranization/${id}`);
    };
  };

  // Function to handle text field changes
  const handleTextChange = (field, setter) => (event) => {
    setter(event.target.value);
    // Clear error for this field if it has a value now
    if (formSubmitted && event.target.value.trim() !== "") {
      setFieldErrors(prev => ({...prev, [field]: false}));
    }
  };

  // Function to handle select field changes
  const handleSelectChange = (field, setter) => (event) => {
    setter(event.target.value);
    // Clear error for this field if it has a value now
    if (formSubmitted && event.target.value !== "") {
      setFieldErrors(prev => ({...prev, [field]: false}));
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            พิมพ์บัตรประจำตัวผู้ประสานงาน
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            ค้นหาและพิมพ์บัตรประจำตัวผู้ประสานงาน
          </Typography>
        </Box>
        
        <Card variant="outlined" sx={{ mb: 4, backgroundColor: "#f9f9f9" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }} color="primary">
              <SearchIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              ค้นหาผู้ประสานงาน
            </Typography>
            
            <Grid container spacing={3}>
              {/* ค้นหาตามชื่อ */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="ชื่อ *"
                  variant="outlined"
                  value={searchFirstName}
                  onChange={handleTextChange('fname', setSearchFirstName)}
                  placeholder="ค้นหาตามชื่อ"
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  error={formSubmitted && fieldErrors.fname}
                  helperText={formSubmitted && fieldErrors.fname ? "กรุณากรอกชื่อ" : ""}
                  required
                />
              </Grid>
              
              {/* ค้นหาตามนามสกุล */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="นามสกุล *"
                  variant="outlined"
                  value={searchLastName}
                  onChange={handleTextChange('lname', setSearchLastName)}
                  placeholder="ค้นหาตามนามสกุล"
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  error={formSubmitted && fieldErrors.lname}
                  helperText={formSubmitted && fieldErrors.lname ? "กรุณากรอกนามสกุล" : ""}
                  required
                />
              </Grid>
              
              {/* วิทยาเขต */}
              <Grid item xs={12} sm={6} md={3}>
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
              <Grid item xs={12} sm={6} md={3}>
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
                                {user.fname} {user.lname}
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
                          <TableCell>{user.department || user.fname}</TableCell>
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

export default Searchstudentorganization;