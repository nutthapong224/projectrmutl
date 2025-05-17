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
  IconButton,
  Tooltip,
  Avatar,
  FormHelperText
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import SportsIcon from '@mui/icons-material/Sports';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from "react-router-dom";

const  Searchplayer = () => {
  const apiBaseUrl = import.meta.env.VITE_API_URL_APPROVEFOOTBAL;
  const [users, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showData, setShowData] = useState(false);

  // States for notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // States for filters
  const [departments, setDepartments] = useState([]);
  const [sportTypes, setSportTypes] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");
  const navigate = useNavigate();

  // Form validation states
  const [fieldErrors, setFieldErrors] = useState({
    firstName: false,
    lastName: false,
    department: false,
    sport: false,
    category: false
  });
  
  // Error messages for form fields
  const [errorMessages, setErrorMessages] = useState({
    firstName: "",
    lastName: "",
    department: "",
    sport: "",
    category: ""
  });
  
  // State to track if form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);

  const sports = [
    { value: "football", label: "ฟุตบอล", icon: "⚽" },
    { value: "futsal", label: "ฟุตซอล", icon: "⚽" },
    { value: "basketball", label: "บาสเก็ตบอล", icon: "🏀" },
    { value: "badminton", label: "แบดมินตัน", icon: "🏸" },
    { value: "tabletenis", label: "เทเบิลเทนิส", icon: "🏓" },
    { value: "takraw", label: "เซปักตะกร้อ", icon: "🥎" },
    { value: "volleyball", label: "วอลเลย์บอล", icon: "🏐" },
    { value: "hooptakraw", label: "ตะกร้อลอดห่วง", icon: "🥎" },
    { value: "esport", label: "e-sport", icon: "🎮" },
    { value: "petanque", label: "เปตอง", icon: "🥎" },
  ];

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      setSnackbar({
        open: true,
        message: "ไม่สามารถดึงข้อมูลวิทยาเขตได้",
        severity: "error"
      });
    }
  };
  
  const fetchCategoriesBySport = async (sportType) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/sports/category/${sportType}`);
      const categoryData = response.data.categories || response.data;
      setCategories(categoryData);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setCategories([]);
      setSnackbar({
        open: true,
        message: "ไม่สามารถดึงข้อมูลประเภทกีฬาได้",
        severity: "error"
      });
    }
  };

  // Validate all fields and show errors for each field
  const validateFields = () => {
    let isValid = true;
    const errors = {
      firstName: false,
      lastName: false,
      department: false,
      sport: false,
      category: false
    };
    
    const messages = {
      firstName: "",
      lastName: "",
      department: "",
      sport: "",
      category: ""
    };
    
    // Check if first name is provided
    if (searchFirstName.trim() === "") {
      errors.firstName = true;
      messages.firstName = "กรุณากรอกชื่อ";
      isValid = false;
    } else {
      // Validate firstName format (Thai characters only)
      const thaiRegex = /^[ก-๛\s]+$/;
      if (!thaiRegex.test(searchFirstName)) {
        errors.firstName = true;
        messages.firstName = "กรุณากรอกชื่อเป็นภาษาไทยเท่านั้น";
        isValid = false;
      }
    }

    // Check if last name is provided
    if (searchLastName.trim() === "") {
      errors.lastName = true;
      messages.lastName = "กรุณากรอกนามสกุล";
      isValid = false;
    } else {
      // Validate lastName format (Thai characters only)
      const thaiRegex = /^[ก-๛\s]+$/;
      if (!thaiRegex.test(searchLastName)) {
        errors.lastName = true;
        messages.lastName = "กรุณากรอกนามสกุลเป็นภาษาไทยเท่านั้น";
        isValid = false;
      }
    }

    // Check if department is selected
    if (!selectedDepartment) {
      errors.department = true;
      messages.department = "กรุณาเลือกวิทยาเขต";
      isValid = false;
    }

    // Check if sport is selected
    if (!selectedSport) {
      errors.sport = true;
      messages.sport = "กรุณาเลือกประเภทกีฬา";
      isValid = false;
    }

    // Check if category is selected
    if (!selectedCategory) {
      errors.category = true;
      messages.category = "กรุณาเลือกประเภท";
      isValid = false;
    }

    // Update field errors and messages
    setFieldErrors(errors);
    setErrorMessages(messages);
    
    return isValid;
  };

  const fetchUsers = async () => {
    setFormSubmitted(true);
    
    // Validate fields before proceeding
    if (!validateFields()) {
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:5000/api/players/searchall`;
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
      if (searchFirstName) {
        params.append('fname', searchFirstName.trim());
      }
      if (searchLastName) {
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
          message: `พบข้อมูลนักกีฬา ${response.data.length} รายการ`,
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
      const errorMessage = err.response?.data?.message || err.response?.data || "ไม่สามารถดึงข้อมูลนักกีฬาได้";
      setError(errorMessage);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchDirector = (id) => {
    return () => {
      navigate(`/player/${id}`);
    };
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedSport) {
      fetchCategoriesBySport(selectedSport);
      // Clear error if sport is selected
      if (formSubmitted) {
        setFieldErrors(prev => ({...prev, sport: false}));
        setErrorMessages(prev => ({...prev, sport: ""}));
      }
    } else {
      setCategories([]);
      setSelectedCategory("");
      // Set error if form has been submitted
      if (formSubmitted) {
        setFieldErrors(prev => ({...prev, sport: true}));
        setErrorMessages(prev => ({...prev, sport: "กรุณาเลือกประเภทกีฬา"}));
      }
    }
  }, [selectedSport, formSubmitted]);

  // Handle text field changes
  const handleTextChange = (field, setter) => (e) => {
    const value = e.target.value;
    setter(value);
    
    // Real-time validation if form has been submitted
    if (formSubmitted) {
      if (value.trim() === "") {
        setFieldErrors(prev => ({...prev, [field]: true}));
        setErrorMessages(prev => ({...prev, [field]: field === 'firstName' ? "กรุณากรอกชื่อ" : "กรุณากรอกนามสกุล"}));
      } else {
        const thaiRegex = /^[ก-๛\s]+$/;
        if (!thaiRegex.test(value)) {
          setFieldErrors(prev => ({...prev, [field]: true}));
          setErrorMessages(prev => ({...prev, [field]: field === 'firstName' ? "กรุณากรอกชื่อเป็นภาษาไทยเท่านั้น" : "กรุณากรอกนามสกุลเป็นภาษาไทยเท่านั้น"}));
        } else {
          setFieldErrors(prev => ({...prev, [field]: false}));
          setErrorMessages(prev => ({...prev, [field]: ""}));
        }
      }
    }
  };

  // Handle select field changes
  const handleSelectChange = (field, setter) => (e) => {
    const value = e.target.value;
    setter(value);
    
    // Clear error for this field if it has a value now
    if (formSubmitted) {
      if (value) {
        setFieldErrors(prev => ({...prev, [field]: false}));
        setErrorMessages(prev => ({...prev, [field]: ""}));
      } else {
        setFieldErrors(prev => ({...prev, [field]: true}));
        let errorMsg = "";
        if (field === 'department') errorMsg = "กรุณาเลือกวิทยาเขต";
        else if (field === 'sport') errorMsg = "กรุณาเลือกประเภทกีฬา";
        else if (field === 'category') errorMsg = "กรุณาเลือกประเภท";
        setErrorMessages(prev => ({...prev, [field]: errorMsg}));
      }
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedSport("");
    setSelectedCategory("");
    setSearchFirstName("");
    setSearchLastName("");
    setShowData(false);
    setPendingUsers([]);
    setError("");
    setSnackbar({ open: false, message: "", severity: "success" });
    setFieldErrors({
      firstName: false,
      lastName: false,
      department: false,
      sport: false,
      category: false
    });
    setErrorMessages({
      firstName: "",
      lastName: "",
      department: "",
      sport: "",
      category: ""
    });
    setFormSubmitted(false);
  };

  const getSportLabel = (sportValue) => {
    const sport = sports.find(s => s.value === sportValue);
    return sport ? sport.label : sportValue;
  };

  const getSportIcon = (sportValue) => {
    const sport = sports.find(s => s.value === sportValue);
    return sport ? sport.icon : "🏅";
  };

  // Check if search should be disabled
  const isSearchDisabled = loading;

  // Handle Enter key press in search fields
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            พิมพ์เกียรตินักกีฬา
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            ค้นหาและพิมพ์บัตรประจำตัวนักกีฬา
          </Typography>
        </Box>
        
        <Card variant="outlined" sx={{ mb: 4, backgroundColor: "#f9f9f9" }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }} color="primary">
              <SearchIcon sx={{ mr: 1, verticalAlign: "middle" }} />
              ค้นหานักกีฬา
            </Typography>
            
            <Grid container spacing={3}>
              {/* ค้นหาตามชื่อ */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="ชื่อ"
                  variant="outlined"
                  value={searchFirstName}
                  onChange={handleTextChange('firstName', setSearchFirstName)}
                  onKeyPress={handleKeyPress}
                  placeholder="ค้นหาตามชื่อ"
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  error={fieldErrors.firstName}
                  helperText={errorMessages.firstName}
                  required
                />
              </Grid>

              {/* ค้นหาตามนามสกุล */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="นามสกุล"
                  variant="outlined"
                  value={searchLastName}
                  onChange={handleTextChange('lastName', setSearchLastName)}
                  onKeyPress={handleKeyPress}
                  placeholder="ค้นหาตามนามสกุล"
                  InputProps={{
                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  error={fieldErrors.lastName}
                  helperText={errorMessages.lastName}
                  required
                />
              </Grid>

              {/* วิทยาเขต */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth error={fieldErrors.department} required>
                  <InputLabel>วิทยาเขต</InputLabel>
                  <Select
                    value={selectedDepartment}
                    onChange={handleSelectChange('department', setSelectedDepartment)}
                    startAdornment={<SchoolIcon color="action" sx={{ mr: 1 }} />}
                    label="วิทยาเขต"
                  >
                    <MenuItem value="">เลือกวิทยาเขต</MenuItem>
                    {departments.map((department) => (
                      <MenuItem key={department.id} value={department.name}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errorMessages.department && (
                    <FormHelperText>{errorMessages.department}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* กีฬา */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth error={fieldErrors.sport} required>
                  <InputLabel>กีฬา</InputLabel>
                  <Select
                    value={selectedSport}
                    onChange={handleSelectChange('sport', setSelectedSport)}
                    startAdornment={<SportsIcon color="action" sx={{ mr: 1 }} />}
                    label="กีฬา"
                  >
                    <MenuItem value="">เลือกประเภทกีฬา</MenuItem>
                    {sports.map((sport) => (
                      <MenuItem key={sport.value} value={sport.value}>
                        {sport.icon} {sport.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errorMessages.sport && (
                    <FormHelperText>{errorMessages.sport}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* ประเภทกีฬา */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth disabled={!selectedSport} error={fieldErrors.category} required>
                  <InputLabel>ประเภท</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={handleSelectChange('category', setSelectedCategory)}
                    label="ประเภท"
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
                  {errorMessages.category && (
                    <FormHelperText>{errorMessages.category}</FormHelperText>
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
                disabled={isSearchDisabled}
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
                  label={`พบนักกีฬา ${users.length} คน`} 
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
                      <TableCell>ประเภทกีฬา</TableCell>
                      <TableCell>ประเภท</TableCell>
                      <TableCell>วิทยาเขต</TableCell>
                      <TableCell align="center">พิมพ์</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">ไม่พบข้อมูลนักกีฬา</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user, index) => (
                        <TableRow 
                          key={user.id || index}
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
                              icon={<Typography>{getSportIcon(user.sport_table)}</Typography>}
                              label={getSportLabel(user.sport_table)} 
                              variant="outlined" 
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{user.category_name || "-"}</TableCell>
                          <TableCell>{user.department || "-"}</TableCell>
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
                                พิมพ์บัตร
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

export default Searchplayer;