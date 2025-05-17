import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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
  IconButton,
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
import axios from "axios";
// Import libraries for file export
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const Approvestudentorganization = () => {
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
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // States for filters
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSport, setSelectedSport] = useState(""); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // API base URL
  const apiBaseUrl = "http://localhost:5000/api/studentorgranization";

  const sports = [
    { value: 'สโมสรนักศึกษา', label: 'สโมสรนักศึกษา' },
    { value: 'องค์การนักศึกษา', label: 'องค์การนักศึกษา' },
  ];

  // ฟังก์ชันสำหรับส่งออกเป็น CSV ที่รองรับภาษาไทย
  const exportToCSV = async () => {
    setLoading(true);
    try {
      // สร้าง URL สำหรับการ fetch ข้อมูลจาก API
      let url = `http://localhost:5000/api/studentorgranization/searchpending`;
      const params = new URLSearchParams();

      if (selectedDepartment) {
        params.append('department', selectedDepartment);
      }
      if (selectedSport) {
        params.append('position', selectedSport);
      }
      if (firstName) {
        params.append('fname', firstName);
      }
      if (lastName) {
        params.append('lname', lastName);
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
        "ประเภทผู้ประสานงาน",
        "วิทยาเขต",
      ];

      // แปลงข้อมูลเป็นรูปแบบแถว
      const dataRows = dataToExport.map(user => [
        user.registration_id,
        user.title,
        user.fname,
        user.lname,
        user.position,
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
      const fileName = `รายชื่อผู้ประสานงานรอการอนุมัติ_${formattedDate}.csv`;
      
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
      let url = `http://localhost:5000/api/studentorgranization/searchpending`;
      const params = new URLSearchParams();

      if (selectedDepartment) {
        params.append('department', selectedDepartment);
      }
      if (selectedSport) {
        params.append('position', selectedSport);
      }
      if (firstName) {
        params.append('fname', firstName);
      }
      if (lastName) {
        params.append('lname', lastName);
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
        'ประเภทผู้ประสานงาน': user.position,
        'วิทยาเขต': user.department
      }));

      // สร้าง Workbook และ Worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'รายชื่อผู้ประสานงานรอการอนุมัติ');

      // สร้างชื่อไฟล์พร้อมวันที่
      const date = new Date();
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const fileName = `รายชื่อผู้ประสานงานรอการอนุมัติ_${formattedDate}.xlsx`;

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
      let url = `http://localhost:5000/api/studentorgranization/searchpending`;
      const params = new URLSearchParams();
  
      if (selectedDepartment) {
        params.append('department', selectedDepartment);
      }
      if (selectedSport) {
        params.append('position', selectedSport);
      }
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

  // Handle opening PDF directly from table
  const openPdfFromTable = (user) => {
    if (user && user.document) {
      const documentUrl = `http://localhost:5000${user.document}`;
      setPdfUrl(documentUrl);
      setPdfModalOpen(true);
    } else {
      setSnackbar({
        open: true,
        message: "ไม่พบเอกสารสำหรับผู้ใช้นี้",
        severity: "warning"
      });
    }
  };

  // Filter handlers
  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedSport("");
    setFirstName("");
    setLastName("");
  };

  // Modal and dialog handlers
  const openDialog = (id, action) => setDialog({ open: true, id, action });
  const closeDialog = () => setDialog({ open: false, id: null, action: "" });

  const confirmAction = () => {
    if (dialog.action === "approve") {
      handleApprove(dialog.id);
    } else if (dialog.action === "reject") {
      handleReject(dialog.id);
    }
    window.location.reload();
    closeDialog();
  };
  
  const openDocumentDialog = (user) => {
    setSelectedUser(user);
    setDocumentDialogOpen(true);
  };

  const closeDocumentDialog = () => {
    setDocumentDialogOpen(false);
    setSelectedUser(null);
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

  useEffect(() => {
    fetchDepartments();
    fetchPendingUsers();
  }, [selectedDepartment, selectedSport, firstName, lastName]);
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        หน้าอนุมัติข้อมูลผู้ประสานงาน
      </Typography>

      {/* Search Filters */}
      <Box sx={{ mb: 3, mt: 2 }}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          {/* First Name Filter */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="ชื่อ"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>

          {/* Last Name Filter */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="นามสกุล"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
   
          <Grid item xs={12} sm={3}>
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

          {/* เลือกประเภทผู้ประสานงาน */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>เลือกประเภทผู้ประสานงาน</InputLabel>
              <Select value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
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
                  <TableCell>ประเภทผู้ประสานงาน</TableCell>
                  <TableCell>วิทยาเขต</TableCell>
                  <TableCell>รูปภาพ</TableCell>
                  <TableCell>เอกสาร</TableCell>
                  <TableCell>ปุ่มดำเนินการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingUsers.length > 0 ? pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.title} {user.fname} {user.lname}</TableCell>
                    <TableCell>{user.position}</TableCell>
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
                        onClick={() => openPdfFromTable(user)}
                        fullWidth
                      >
                        ดูเอกสาร
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="contained" 
                        color="success" 
                        size="small" 
                        sx={{ mr: 1 }}
                        onClick={() => openDialog(user.registration_id, 'approve')}
                      >
                        อนุมัติ
                      </Button>
                      <Button 
                        variant="contained" 
                        color="error" 
                        size="small"
                        onClick={() => openDialog(user.registration_id, 'reject')}
                      >
                        ปฏิเสธ
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">ไม่พบข้อมูลที่ค้นหา</TableCell>
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

      {/* Document Dialog */}
      <Dialog 
        open={documentDialogOpen} 
        onClose={closeDocumentDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          เอกสารของ {selectedUser?.title} {selectedUser?.fname} {selectedUser?.lname}
          <IconButton 
            onClick={closeDocumentDialog} 
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={2}>
              {selectedUser.document && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>เอกสารประกอบการสมัคร</Typography>
                  <Button 
                    variant="contained" 
                    onClick={() => openPdfModal(`http://localhost:5000${selectedUser.document}`)}
                    fullWidth
                  >
                    ดูเอกสาร
                  </Button>
                </Grid>
              )}
              
              {!selectedUser.document && (
                <Grid item xs={12}>
                  <Typography>ไม่พบเอกสารของผู้ใช้นี้</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDocumentDialog} color="primary">
            ปิด
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Modal */}
      <Modal 
        open={imageModalOpen} 
        onClose={closeImageModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box 
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            maxWidth: '90%',
            maxHeight: '90%',
            outline: 'none',
            position: 'relative',
            borderRadius: 1,
          }}
        >
          <IconButton
            onClick={closeImageModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <img 
            src={imageUrl} 
            alt="User Image" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: 'calc(90vh - 40px)',
              display: 'block'
            }} 
          />
        </Box>
      </Modal>
 
      {/* PDF Modal */}
      <Modal 
        open={pdfModalOpen} 
        onClose={closePdfModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box 
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            width: '90%',
            height: '90%',
            outline: 'none',
            position: 'relative',
            borderRadius: 1,
          }}
        >
          <IconButton
            onClick={closePdfModal}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              zIndex: 1,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <iframe 
            src={pdfUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            title="Document Preview"
          />
        </Box>
      </Modal>
    </Container>
  );
};

export default Approvestudentorganization;