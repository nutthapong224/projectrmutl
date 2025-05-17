import React, { useEffect, useState } from "react";
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
  Box,
  TextField,
} from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from "axios";
// Import libraries for file export
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const Approvedirector = () => {
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
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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

  // New states for name search
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchLastName, setSearchLastName] = useState("");

  const [sportTables, setSportTables] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  // API URLs
  const apiBaseUrl = import.meta.env.VITE_API_URL_APPROVEDIRECTOR;
  const apiImage = import.meta.env.VITE_API_URL3;
  const sports = [
    { value: "football", label: "ฟุตบอล" },
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

  // ฟังก์ชันสำหรับส่งออกเป็น CSV ที่รองรับภาษาไทย
  const exportToCSV = async () => {
    setLoading(true);
    try {
      // สร้าง URL สำหรับการ fetch ข้อมูลจาก API
      let url = `http://localhost:5000/api/director/searchpending`;
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
      if (searchFirstName) {
        params.append('fname', searchFirstName);
      }
      if (searchLastName) {
        params.append('lname', searchLastName);
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      
      // เรียกข้อมูลจาก API โดยตรงตามเงื่อนไขการค้นหาปัจจุบัน
      const response = await axios.get(fullUrl);
      const dataToExport = response.data;
      
      if (dataToExport.length === 0) {
        setSnackbar({
          open: true,
          message: "ไม่มีข้อมูลที่จะส่งออก",
          severity: "warning"
        });
        setLoading(false);
        return;
      }

      // กำหนดหัวตาราง CSV
      const headers = [
        "รหัสลงทะเบียน",
        "คำนำหน้า",
        "ชื่อ",
        "นามสกุล",
        "ประเภทการคุม",
        "กีฬา",
        "วิทยาเขต",
      ];

      // แปลงข้อมูลเป็นรูปแบบแถว
      const dataRows = dataToExport.map(user => [
        user.registration_id,
        user.title,
        user.fname,
        user.lname,
        user.position,
        user.sport_type,
        user.department
      ]);

      // จัดการ escape string สำหรับ CSV และรองรับภาษาไทย
      const escapeCSV = (data) => {
        if (data == null) return '';
        const str = String(data);
        // ตรวจสอบว่าข้อมูลต้องอยู่ในเครื่องหมายคำพูดหรือไม่
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          // แทนที่เครื่องหมายคำพูดด้วยสองเครื่องหมายคำพูดและครอบด้วยเครื่องหมายคำพูด
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      // สร้างเนื้อหา CSV ด้วยการ escape ที่เหมาะสมสำหรับภาษาไทย
      const csvRows = [
        headers.map(escapeCSV).join(','),
        ...dataRows.map(row => row.map(escapeCSV).join(','))
      ];
      const csvContent = csvRows.join('\n');

      // เพิ่ม BOM (Byte Order Mark) สำหรับการเข้ารหัส UTF-8 เพื่อแสดงภาษาไทยอย่างถูกต้อง
      const BOM = '\uFEFF';
      const csvContentWithBOM = BOM + csvContent;

      // สร้าง Blob ด้วยการเข้ารหัส UTF-8
      const blob = new Blob([csvContentWithBOM], { type: 'text/csv;charset=utf-8;' });
      
      // สร้างชื่อไฟล์พร้อมวันที่
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const fileName = `รายชื่อกรรมการรอการอนุมัติ_${formattedDate}.csv`;
      
      // บันทึกไฟล์
      saveAs(blob, fileName);

      setSnackbar({
        open: true,
        message: "ส่งออกข้อมูลเป็น CSV สำเร็จ!",
        severity: "success"
      });
    } catch (err) {
      console.error("Export error:", err);
      setSnackbar({
        open: true,
        message: "เกิดข้อผิดพลาดในการส่งออกข้อมูล",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // ฟังก์ชันสำหรับส่งออกเป็น Excel
  const exportToXLSX = async () => {
    setLoading(true);
    try {
      // สร้าง URL สำหรับการ fetch ข้อมูลจาก API
      let url = `http://localhost:5000/api/director/searchpending`;
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
      if (searchFirstName) {
        params.append('fname', searchFirstName);
      }
      if (searchLastName) {
        params.append('lname', searchLastName);
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      
      // เรียกข้อมูลจาก API โดยตรงตามเงื่อนไขการค้นหาปัจจุบัน
      const response = await axios.get(fullUrl);
      const dataToExport = response.data;
      
      if (dataToExport.length === 0) {
        setSnackbar({
          open: true,
          message: "ไม่มีข้อมูลที่จะส่งออก",
          severity: "warning"
        });
        setLoading(false);
        return;
      }

      // แปลงข้อมูลเป็นรูปแบบที่เหมาะสมสำหรับ Excel
      const formattedData = dataToExport.map(user => ({
        'รหัสลงทะเบียน': user.registration_id,
        'คำนำหน้า': user.title,
        'ชื่อ': user.fname,
        'นามสกุล': user.lname,
        'ประเภทการคุม': user.position,
        'กีฬา': user.sport_type,
        'วิทยาเขต': user.department
      }));

      // สร้าง Workbook และ Worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'รายชื่อกรรมการรอการอนุมัติ');

      // สร้างชื่อไฟล์พร้อมวันที่
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const fileName = `รายชื่อกรรมการรอการอนุมัติ_${formattedDate}.xlsx`;

      // แปลงไฟล์เป็น Excel Binary และบันทึก
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      
      // บันทึกไฟล์
      saveAs(blob, fileName);

      setSnackbar({
        open: true,
        message: "ส่งออกข้อมูลเป็น Excel สำเร็จ!",
        severity: "success"
      });
    } catch (err) {
      console.error("Export error:", err);
      setSnackbar({
        open: true,
        message: "เกิดข้อผิดพลาดในการส่งออกข้อมูล",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending users with search parameters
  const fetchPendingUsers = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:5000/api/director/searchpending`;
      const params = new URLSearchParams();
  
      if (selectedDepartment) {
        params.append('department', selectedDepartment);
        console.log("Using Department Filter:", selectedDepartment);
      } 
      if (selectedPositionDirector) {
        params.append('position', selectedPositionDirector);
        console.log("Using Position Filter:", selectedPositionDirector);
      }
      if (selectedSport) {
        params.append('sport_type', selectedSport);
        console.log("Using Sport Filter:", selectedSport);
      }
      // Add name search parameters
      if (searchFirstName) {
        params.append('fname', searchFirstName);
        console.log("Using First Name Filter:", searchFirstName);
      }
      if (searchLastName) {
        params.append('lname', searchLastName);
        console.log("Using Last Name Filter:", searchLastName);
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
  };

  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedSportType("");
    setSelectedPositionDirector("");
    setSelectedSport(""); // เพิ่มบรรทัดนี้เพื่อรีเซ็ตค่าประเภทกีฬา (รวมถึงฟุตบอล)
    setCategories([]);
    // Reset name search fields
    setSearchFirstName("");
    setSearchLastName("");
  };

  // Modal and dialog handlers
  const openDialog = (id, action) => setDialog({ open: true, id, action });
  const closeDialog = () => setDialog({ open: false, id: null, action: "" });

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
  
  const openImageModal = (imageUrl) => {
    setImageUrl(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => setImageModalOpen(false);

  const openPdfModal = (documentUrl) => {
    setPdfUrl(documentUrl);
    setPdfModalOpen(true);
  };

  const closePdfModal = () => setPdfModalOpen(false);
  
  // Effects
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/department");
      setDepartments(response.data);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    }
  };

  const fetchPositiondirector = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/positiondirector");
      setPositionDirector(response.data);
    } catch (err) {
      console.error("Failed to fetch position directors:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchPositiondirector();
    fetchPendingUsers();
  }, [selectedDepartment, selectedSport, selectedPositionDirector, searchFirstName, searchLastName]); // Added name search dependencies

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Category selected:", value);
    setFormData(prev => ({ ...prev, [name]: value }));
    setSelectedCategory(value);
  };
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        หน้าอนุมัติข้อมูลกรรมการ
      </Typography>

      {/* Search Filters */}
      <Box sx={{ mb: 3, mt: 2 }}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          {/* Name search fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ค้นหาตามชื่อ"
              variant="outlined"
              value={searchFirstName}
              onChange={(e) => setSearchFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ค้นหาตามนามสกุล"
              variant="outlined"
              value={searchLastName}
              onChange={(e) => setSearchLastName(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
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

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>ประเภทการคุม</InputLabel>
              <Select
                value={selectedPositionDirector}
                onChange={(e) => setSelectedPositionDirector(e.target.value)}
              >
                <MenuItem value=""><em>ทั้งหมด</em></MenuItem>
                {Array.isArray(positiondirector) ? positiondirector.map((pos) => (
                  <MenuItem key={pos.id} value={pos.name}>
                    {pos.name}
                  </MenuItem>
                )) : <MenuItem value=""><em>โหลดข้อมูล...</em></MenuItem>}
              </Select>
            </FormControl>
          </Grid>

          {/* เลือกกีฬา (Sport Selection) */}
          <Grid item xs={12} sm={4}>
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
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              fullWidth
              sx={{ height: '56px' }}
            >
              รีเซ็ตตัวกรอง
            </Button>
          </Grid>
          
          {/* ปุ่มส่งออก CSV */}
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="success"
              onClick={exportToCSV}
              fullWidth
              startIcon={<FileDownloadIcon />}
              sx={{ height: '56px' }}
              disabled={loading}
            >
              ส่งออก CSV
            </Button>
          </Grid>

          {/* ปุ่มส่งออก Excel */}
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={exportToXLSX}
              fullWidth
              startIcon={<FileDownloadIcon />}
              sx={{ height: '56px' }}
              disabled={loading}
            >
              ส่งออก Excel
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
                  <TableCell>ประเภทการคุม</TableCell>
                  <TableCell>กีฬา</TableCell>
                  <TableCell>วิทยาเขต</TableCell>
                  <TableCell>รูปภาพ</TableCell>
                  <TableCell>เอกสาร</TableCell>
          
                  <TableCell>ปุ่มการดำเนินการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingUsers.length > 0 ? pendingUsers.map((user) => (
                  <TableRow key={user.id || user.registration_id}>
                    <TableCell>{user.title} {user.fname} {user.lname}</TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell>{user.sport_type}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <img 
                        src={`http://localhost:5000${user.profile_image}`} 
                        alt="Profile" 
                        width={50} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => openImageModal(`http://localhost:5000${user.profile_image}`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => openPdfModal(`http://localhost:5000${user.document}`)}
                      >
                        ดูข้อมูลเอกสาร
                      </Button>
                    </TableCell>
                              <TableCell align="left" style={{ paddingLeft: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '8px', width: '100%' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => openDialog(user.registration_id, 'approve')}
                        >
                          อนุมัติ
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => openDialog(user.registration_id, 'reject')}
                        >
                          ปฏิเสธ
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">ไม่พบข้อมูลที่ค้นหา</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

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

      {/* Image Modal */}
      <Modal open={imageModalOpen} onClose={closeImageModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto'
        }}>
          <img src={imageUrl} alt="User Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button onClick={closeImageModal} variant="contained">ปิด</Button>
          </Box>
        </Box>
      </Modal>

      {/* PDF Modal */}
      <Modal open={pdfModalOpen} onClose={closePdfModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4
        }}>
          <embed src={pdfUrl} width="100%" height="100%" />
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button onClick={closePdfModal} variant="contained">ปิด</Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Approvedirector;