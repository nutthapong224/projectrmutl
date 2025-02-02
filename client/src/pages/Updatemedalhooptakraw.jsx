import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Modal, Box, Typography, FormControl, InputLabel, Select, MenuItem,
  DialogActions, Tooltip, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL_APPROVEHOOPTAKRAW;
const apiImage = import.meta.env.VITE_API_URL3;

const Updatemedalhooptakraw = () => {
  const [users, setUsers] = useState([]);
  const [medalModalOpen, setMedalModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedUserId, setSelectedUserId] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [departments, setDepartments] = useState([]);
  const [sportTypes, setSportTypes] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSportType, setSelectedSportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/alluser`);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Invalid data format received:", response.data);
        setError("Invalid data format received from server");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    }
  };

  // Initial load of users and filters
  useEffect(() => {
    fetchUsers();
    fetchFilters();
  }, []);

  // Fetch filter options
  const fetchFilters = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/getfilter`);
      setDepartments(response.data.departments);
      setSportTypes(response.data.sportTypes);
    } catch (err) {
      console.error("Failed to fetch filters:", err);
      setError("Failed to load filter options");
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `${apiBaseUrl}/searchpendings`;
      const params = new URLSearchParams();
      
      if (selectedDepartment) {
        params.append('department', selectedDepartment);
      }
      if (selectedSportType) {
        params.append('sport_type', selectedSportType);
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const response = await axios.get(fullUrl);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setError("Invalid response format from search");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search users");
      setSnackbar({
        open: true,
        message: 'เกิดข้อผิดพลาดในการค้นหา',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset filters and reload all users
  const handleReset = () => {
    setSelectedDepartment("");
    setSelectedSportType("");
    fetchUsers();
  };

  const openMedalModal = (id) => {
    setSelectedUserId(id);
    setMedalModalOpen(true);
  };

  const closeMedalModal = () => {
    setMedalModalOpen(false);
    setSelectedStatus('');
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`${apiBaseUrl}/status/${selectedUserId}`, {
        status: selectedStatus
      });
      
      setSnackbar({ 
        open: true, 
        message: 'อัพเดทสถานะสำเร็จ!', 
        severity: 'success' 
      });
      
      closeMedalModal();
      fetchUsers(); // Refresh the user list after update
      
    } catch (err) {
      console.error("Error updating status:", err);
      setSnackbar({ 
        open: true, 
        message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ', 
        severity: 'error' 
      });
    }
  };

  return (
    <div>
      {/* Search Filters */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>ค้นหา</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>วิทยาเขต</InputLabel>
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              label="ภาควิชา"
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>ประเภทกีฬา</InputLabel>
            <Select
              value={selectedSportType}
              onChange={(e) => setSelectedSportType(e.target.value)}
              label="ประเภทกีฬา"
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              {sportTypes.map((sport) => (
                <MenuItem key={sport} value={sport}>{sport}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            onClick={handleSearch}
            disabled={loading}
          >
            ค้นหา
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleReset}
            disabled={loading}
          >
            รีเซ็ต
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>
        )}
      </Box>

      {/* Table Component */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ชื่อ</TableCell>
              <TableCell>นามสกุล</TableCell>
              <TableCell>รหัสนักศึกษา</TableCell>
              <TableCell>ภาควิชา</TableCell>
              <TableCell>คณะ</TableCell>
              <TableCell>สาขาวิชา</TableCell>
              <TableCell>รูปภาพ</TableCell>
              <TableCell>สถานะปัจจุบัน</TableCell>
              <TableCell>ปุ่มการทำงาน</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">กำลังโหลดข้อมูล...</TableCell>
              </TableRow>
            ) : users.length > 0 ? (
              users.map((user) => (
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
                        style={{ width: 50, cursor: 'pointer' }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell>{user.status || '-'}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => openMedalModal(user.id)}
                    >
                      อัพเดทสถานะ
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">ไม่มีข้อมูลผู้ใช้</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Update Modal */}
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
              onChange={handleStatusChange}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Updatemedalhooptakraw;