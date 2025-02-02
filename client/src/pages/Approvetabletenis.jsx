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
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import axios from "axios";

const Approvetabletenis = () => {
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
  const [sportTypes, setSportTypes] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSportType, setSelectedSportType] = useState("");

  // API URLs
  const apiBaseUrl = import.meta.env.VITE_API_URL_APPROVETABLETENIS;
  const apiImage = import.meta.env.VITE_API_URL3;

  // Fetch filter options from API
  const fetchFilters = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/getpendingfilter`);
      setDepartments(response.data.departments);
      setSportTypes(response.data.sportTypes);
    } catch (err) {
      console.error("Failed to fetch filters:", err);
      setError("Failed to load filter options");
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
      }
      if (selectedSportType) {
        params.append('sport_type', selectedSportType);
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : apiBaseUrl;

      const response = await axios.get(fullUrl);
      setPendingUsers(response.data);
    } catch (err) {
      setError(err.response?.data || "Failed to fetch pending users.");
    } finally {
      setLoading(false);
    }
  };

  // Handle approve user
  const handleApprove = async (id) => {
    try {
      await axios.post(`${apiBaseUrl}/approve/${id}`);
      setPendingUsers((prev) => prev.filter((user) => user.id !== id));
      setSnackbar({ open: true, message: "อนุมัติผู้ใช้สำเร็จ!", severity: "success" });
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "ไม่สามารถอนุมัติผู้ใช้ได้", 
        severity: "error" 
      });
    }
  };

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
  };

  // Modal and dialog handlers
  const openDialog = (id, action) => setDialog({ open: true, id, action });
  const closeDialog = () => setDialog({ open: false, id: null, action: "" });
  
  const confirmAction = () => {
    if (dialog.action === "approve") handleApprove(dialog.id);
    if (dialog.action === "reject") handleReject(dialog.id);
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
  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchPendingUsers();
  }, [selectedDepartment, selectedSportType]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        หน้าอนุมัติข้อมูลผู้สมัครเทเบิลเทนิส
      </Typography>

      {/* Search Filters */}
      <Box sx={{ mb: 3, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>วิทยาเขต</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                label="วิทยาเขต"
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>ประเภทกีฬา</InputLabel>
              <Select
                value={selectedSportType}
                onChange={handleSportTypeChange}
                label="ประเภทกีฬา"
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                {sportTypes.map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {sport}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
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
        </Grid>
      </Box>

      {/* Main Content */}
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          {pendingUsers.length === 0 ? (
            <Typography>ไม่พบผู้สมัคร</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ชื่อ</TableCell>
                    <TableCell>นามสกุล</TableCell>
                    <TableCell>รหัสนักศึกษา</TableCell>
                    <TableCell>วิทยาเขต</TableCell>
                    <TableCell>คณะ</TableCell>
                    <TableCell>สาขา</TableCell>
                    <TableCell>รูปถ่าย</TableCell>
                    <TableCell>เอกสาร</TableCell>
                    <TableCell>ปุ่มการทำงาน</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.prefix} {user.fname}</TableCell>
                      <TableCell>{user.lname}</TableCell>
                      <TableCell>{user.student_id}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.faculty}</TableCell>
                      <TableCell>{user.major}</TableCell>
                      <TableCell>
                        <Tooltip title={`คลิกเพื่อดูรูปของ ${user.fname} ${user.lname}`} arrow>
                          <img
                            src={`${apiImage}${user.profile_image}`}
                            alt={`${user.fname} ${user.lname}`}
                            width="50"
                            height="50"
                            style={{ cursor: "pointer" }}
                            onClick={() => openImageModal(`${apiImage}${user.profile_image}`)}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => openPdfModal(`${apiImage}${user.document}`)}
                        >
                          ดูข้อมูลเอกสาร
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          color="primary"
                          onClick={() => openDialog(user.id, "approve")}
                        >
                          อนุมัติ
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => openDialog(user.id, "reject")}
                        >
                          ปฏิเสธ
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Approve/Reject Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog}>
        <DialogTitle>ยืนยันการดำเนินการ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณต้องการ {dialog.action === "approve" ? "อนุมัติ" : "ปฏิเสธ"} ผู้ใช้นี้หรือไม่?
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
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "16px",
          boxShadow: 24,
        }}>
          <img src={imageUrl} alt="User Image" style={{ width: "100%", maxWidth: "600px" }} />
        </Box>
      </Modal>

      {/* PDF Modal */}
      <Modal open={pdfModalOpen} onClose={closePdfModal}>
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "16px",
          boxShadow: 24,
        }}>
          <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Approvetabletenis;
