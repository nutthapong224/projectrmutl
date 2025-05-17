import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
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
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import axios from "axios";
import Football from "../assets/football.png";
import Futsal from "../assets/futsal.png";
import Basketball from "../assets/basketball.png";
import Badminton from "../assets/badminton.png";
import Tabletenis from "../assets/tabletenis.png";
import Takraw from "../assets/takraw.png";
import Volleyball from "../assets/volleyball.png";
import Hooptakraw from "../assets/hooptakraw.png";
import Esport from "../assets/esport.png";
import Petanque from "../assets/petanque.png";

const Approvefootball = () => {
  // States for user data and loading
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // States for notifications and dialogs
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dialog, setDialog] = useState({ open: false, id: null, action: "" });

  // States for modals
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [medalModalOpen, setMedalModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  
  // States for filters
  const [departments, setDepartments] = useState([]);
  const [sportTypes, setSportTypes] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSportType, setSelectedSportType] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ category_id: "" });
  
  // States for name and surname filters
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // States for sport categories
  const [sportTables, setSportTables] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // API URLs
  const apiBaseUrl = import.meta.env.VITE_API_URL_UPDATEREGISTRATION;
  const apiImage = import.meta.env.VITE_API_URL3;
  const sports = [
    { value: "football", label: "ฟุตบอล", icon: Football },
    { value: "futsal", label: "ฟุตซอล", icon: Futsal },
    { value: "basketball", label: "บาสเก็ตบอล", icon: Basketball },
    { value: "badminton", label: "แบดมินตัน", icon: Badminton },
    { value: "tabletenis", label: "เทเบิลเทนิส", icon: Tabletenis },
    { value: "takraw", label: "เซปักตะกร้อ", icon: Takraw },
    { value: "volleyball", label: "วอลเลย์บอล", icon: Volleyball },
    { value: "hooptakraw", label: "ตะกร้อลอดห่วง", icon: Hooptakraw },
    { value: "esport", label: "e-sport", icon: Esport },
    { value: "petanque", label: "เปตอง", icon: Petanque },
  ];
  
  // Handle image click to show dialog
  const handleImageClick = (imageUrl) => {
    setCurrentImage(imageUrl);
    setImageDialogOpen(true);
  };
  
  // Fetch filter options from API
  const fetchFilters = async () => {
    try {
      // const response = await axios.get(`${apiBaseUrl}/getpendingfilter`);
      // setDepartments(response.data.departments);
      // setSportTypes(response.data.sportTypes);

      // Fetch sport tables from the new API endpoint
      // const sportResponse = await axios.get(`${apiBaseUrl}/sportcategorie`);
      // setSportTables(sportResponse.data.sportTables);
      // setSportTypes(sportResponse.data.sportTypes);
    } catch (err) {
      console.error("Failed to fetch filters:", err);
      setError("Failed to load filter options");
    }
  };

  // Fetch categories based on selected sport type
  const fetchCategoriesBySportType = async (sportType) => {
    try {
      const response = await axios.get(`${apiBaseUrl}/category/${sportType}`);
      setCategories(response.data.categories);
    } catch (err) {
      setError("Failed to load categories.");
    }
  };

  // Fetch pending users with search parameters
  const fetchPendingUsers = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `${apiBaseUrl}/searchpending`;
      const params = new URLSearchParams();
  
      if (selectedDepartment) {
        params.append('department', selectedDepartment);
        console.log("Using Department Filter:", selectedDepartment);
      }
      if (selectedSport) {
        params.append('sport_table', selectedSport);
        console.log("Using Sport Filter:", selectedSport);
      }
      if (selectedCategory) {
        params.append('category_id', selectedCategory);
        console.log("Using Category Filter:", selectedCategory);
      }
      if (firstName) {
        params.append('fname', firstName);
        console.log("Using First Name Filter:", firstName);
      }
      if (lastName) {
        params.append('lname', lastName);
        console.log("Using Last Name Filter:", lastName);
      }
  
      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      console.log("Fetching data from:", fullUrl);
  
      const response = await axios.get(fullUrl);
      setPendingUsers(response.data);
    } catch (err) {
      setError(err.response?.data || "Failed to fetch pending users.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle approve user
  const handleApprove = async (id) => {
    if (!id) {
      console.error("Invalid ID:", id);
      setSnackbar({
        open: true,
        message: "ไม่สามารถอนุมัติผู้ใช้ได้ (Invalid ID)",
        severity: "error",
      });
      return;
    }
    
    try {
      await axios.post(`${apiBaseUrl}/approve/${id}`);
      setPendingUsers((prev) => prev.filter((user) => user.id !== id)); 
      setSnackbar({ open: true, message: "อนุมัติผู้ใช้สำเร็จ!", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "ไม่สามารถอนุมัติผู้ใช้ได้",
        severity: "error",
      });
    }
  }

  // Handle reject user
  const handleReject = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/reject/${id}`);
      setPendingUsers((prev) => prev.filter((user) => user.id !== id));
      setSnackbar({ open: true, message: "ปฏิเสธผู้ใช้สำเร็จ!", severity: "success" });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "ไม่สามารถปฏิเสธผู้ใช้ได้",
        severity: "error"
      });
    }
  };

  // Filter handlers
  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleSportTypeChange = (event) => {
    setSelectedSportType(event.target.value);
    // Fetch categories when sport type changes
    fetchCategoriesBySportType(event.target.value);
  };

  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedSportType("");
    setSelectedSport("");
    setCategories([]);
    setFormData({ category_id: "" });
    setSelectedCategory("");
    setFirstName("");
    setLastName("");
  };

  // Modal and dialog handlers
  const openDialog = (id, action) => setDialog({ open: true, id, action });
  const closeDialog = () => setDialog({ open: false, id: null, action: "" });
  
  const openMedalModal = (id) => {
    setSelectedUserId(id);
    setMedalModalOpen(true);
  };

  const closeMedalModal = () => {
    setMedalModalOpen(false);
    setSelectedStatus('');
  };
    
  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      setSnackbar({
        open: true,
        message: "กรุณาเลือกสถานะก่อนอัพเดท",
        severity: "warning",
      });
      return;
    }
  
    if (!selectedUserId) {
      setSnackbar({
        open: true,
        message: "กรุณาเลือกผู้ใช้ที่ต้องการอัพเดท",
        severity: "warning",
      });
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/api/players/update/${selectedUserId}`, {
        status: selectedStatus
      });
  
      setSnackbar({
        open: true,
        message: "อัพเดทสถานะสำเร็จ!",
        severity: "success",
      });
  
      closeMedalModal();
      fetchPendingUsers();
  
    } catch (err) {
      console.error("Error updating status:", err);
      setSnackbar({
        open: true,
        message: "เกิดข้อผิดพลาดในการอัพเดทสถานะ",
        severity: "error",
      });
    }
  };
  
  const confirmAction = () => {
    console.log("Confirming action:", dialog.action, "on ID:", dialog.id);
  
    if (dialog.action === "approve") {
      handleApprove(dialog.id);
    } else if (dialog.action === "reject") {
      handleReject(dialog.id);
    }
    window.location.reload();
    closeDialog();
  };
  
  const openPdfModal = (documentUrl) => {
    setPdfUrl(documentUrl);
    setPdfModalOpen(true);
  };

  const closePdfModal = () => setPdfModalOpen(false);
  
  const sportMapping = {
    'football': 'ฟุตบอล',
    'volleyball': 'วอลเลย์บอล',
    'badminton': 'แบดมินตัน',
    'basketball': 'บาสเกตบอล',
    'futsal': 'ฟุตซอล',
    'takraw': 'เซปักตะกร้อ',
    'hooptakraw': 'เซปักตะกร้อลอดห่วง',
    'tabletenis': 'เทเบิลเทนิส',
    'esport': 'e-sport',
    'petanque': 'เปตอง'
  };
  
  // Effects
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchPendingUsers();
    if (selectedSport) {
      axios.get(`http://localhost:5000/api/sports/category/${selectedSport}`)
        .then(response => setCategories(response.data.categories || response.data))
        .catch(() => setCategories([]));
    } else {
      setCategories([]);
    }

  }, [selectedDepartment, selectedSport, selectedCategory, firstName, lastName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Category selected:", value);
    setFormData(prev => ({ ...prev, [name]: value }));
    setSelectedCategory(value);
  };
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        หน้าสถานะการแข่งขัน
      </Typography>

      {/* Search Filters */}
      <Box sx={{ mb: 3, mt: 2 }}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          {/* ช่องค้นหาชื่อ */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="ชื่อ"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          
          {/* ช่องค้นหานามสกุล */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="นามสกุล"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
          
          {/* ช่องเลือกวิทยาเขต */}
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>วิทยาเขต</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* เลือกกีฬา (Sport Selection) */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>เลือกกีฬา</InputLabel>
              <Select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
                <MenuItem value=""><em>กรุณาเลือกกีฬา</em></MenuItem>
                {sports.map(sport => (
                  <MenuItem key={sport.value} value={sport.value}>{sport.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* เลือกประเภทกีฬา (Category Selection) */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>เลือกประเภทกีฬา</InputLabel>
              <Select name="category_id" value={formData.category_id} onChange={handleInputChange}>
                <MenuItem value=""><em>กรุณาเลือกประเภทกีฬา</em></MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.category_id} value={cat.category_id}>{cat.category_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* ปุ่มค้นหาและรีเซ็ต */}
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              onClick={fetchPendingUsers}
              fullWidth
              sx={{ height: '56px' }}
              color="primary"
            >
              ค้นหา
            </Button>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              fullWidth
              sx={{ height: '56px' }}
            >
              รีเซ็ตตัวกรอง
            </Button>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {error && <Typography color="error">{error}</Typography>}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ชื่อผู้สมัคร</TableCell>
                  <TableCell>กีฬา</TableCell>
                  <TableCell>ประเภทกีฬา</TableCell>
                  <TableCell>วิทยาเขต</TableCell>
                  <TableCell>รูปภาพ</TableCell>
                  <TableCell>สถานะ</TableCell>
                  <TableCell>การดำเนินการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.title} {user.fname} {user.lname}</TableCell>
                    <TableCell>{sportMapping[user.sport_table] || user.sport_table}</TableCell>
                    <TableCell>{user.category_name}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <img 
                        src={`http://localhost:5000${user.profile_image}`} 
                        alt="" width={50} 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => handleImageClick(`http://localhost:5000${user.profile_image}`)}
                      />
                    </TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => openMedalModal(user.registration_id)}
                      >
                        อัพเดทสถานะ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      
      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="md">
        <DialogContent>
          <img
            src={currentImage}
            alt="Profile Enlarged"
            style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>
      
      <Modal open={medalModalOpen} onClose={closeMedalModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 400,
          borderRadius: 2,
        }}>
          <Typography variant="h6" component="h2" gutterBottom>
            อัพเดทสถานะ
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>สถานะ</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="สถานะ"
            >
              <MenuItem value="ชนะเลิศ">ชนะเลิศ</MenuItem>
              <MenuItem value="รองชนะเลิศอันดับที่ 1">รองชนะเลิศอันดับที่ 1</MenuItem>
              <MenuItem value="รองชนะเลิศอันดับที่ 2">รองชนะเลิศอันดับที่ 2</MenuItem>
            </Select>
          </FormControl>
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={closeMedalModal}>ยกเลิก</Button>
            <Button 
              onClick={handleUpdateStatus} 
              variant="contained" 
              color="primary"
              disabled={!selectedStatus}
            >
              ยืนยัน
            </Button>
          </DialogActions>
        </Box>
      </Modal>
      
      {/* Snackbar for success/error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Approve/Reject Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog}>
        <DialogTitle>ยืนยันการดำเนินการ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณแน่ใจหรือไม่ว่าจะ {dialog.action === 'approve' ? 'อนุมัติ' : 'ปฏิเสธ'} ผู้สมัครนี้?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>ยกเลิก</Button>
          <Button onClick={confirmAction} color="primary">
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      {/* PDF Modal */}
      <Modal open={pdfModalOpen} onClose={closePdfModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          width: '80%',
          height: '80%',
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <IconButton onClick={closePdfModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <iframe
            src={`${pdfUrl}#zoom=80`}
            width="100%"
            height="95%"
            style={{ border: "none" }}
          ></iframe>
        </Box>
      </Modal>
    </Container>
  );
};

export default Approvefootball;