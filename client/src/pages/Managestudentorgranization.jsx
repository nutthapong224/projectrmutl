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
    TextField,
    Tooltip,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Import libraries for file export
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const Managestudentorgranization = () => {
    // States for user data and loading
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // States for notifications and dialogs
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [dialog, setDialog] = useState({ open: false, id: null, action: "" });

    // States for modals - Using Dialog instead of Modal
    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [medalModalOpen, setMedalModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    
    // States for filters
    const [departments, setDepartments] = useState([]);
    const [sportTypes, setSportTypes] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedSportType, setSelectedSportType] = useState("");
    const [selectedSport, setSelectedSport] = useState("");
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ category_id: "" });
    
    // States for sport categories
    const [sportTables, setSportTables] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("");
    
    // API URLs
    const apiBaseUrl = import.meta.env.VITE_API_URL_STUDENTORGANIZATION;
    const apiImage = import.meta.env.VITE_API_URL3;
    
    const sports = [
        { value: 'สโมสรนักศึกษา', label: 'สโมสรนักศึกษา' },
        { value: 'องค์การนักศึกษา', label: 'องค์การนักศึกษา' },
    ];
    
    // ฟังก์ชันสำหรับส่งออกเป็น CSV ที่รองรับภาษาไทย
    const exportToCSV = async () => {
        setLoading(true);
        try {
            // สร้าง URL สำหรับการ fetch ข้อมูลจาก API
            let url = `${apiBaseUrl}/search`;
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
                "สถานะ"
            ];

            // แปลงข้อมูลเป็นรูปแบบแถว
            const dataRows = dataToExport.map(user => [
                user.registration_id,
                user.title,
                user.fname,
                user.lname,
                user.position,
                user.department,
                user.status || "ไม่ระบุ"
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
            const fileName = `ข้อมูลผู้ประสานงาน_${formattedDate}.csv`;
            
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
            let url = `${apiBaseUrl}/search`;
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
                'วิทยาเขต': user.department,
                'สถานะ': user.status || "ไม่ระบุ"
            }));

            // สร้าง Workbook และ Worksheet
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'ข้อมูลผู้ประสานงาน');

            // สร้างชื่อไฟล์พร้อมวันที่
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const fileName = `ข้อมูลผู้ประสานงาน_${formattedDate}.xlsx`;

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
    
    // Fetch categories based on selected sport type
    const fetchCategoriesBySportType = async (sportType) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/category/${sportType}`);
            setCategories(response.data.categories);
        } catch (err) {
            setError("Failed to load categories.");
        }
    };

    // Delete handler
    const handleDelete = async (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) {
            try {
                await axios.delete(`http://localhost:5000/api/studentorgranization/player/${id}`);
                alert('ลบข้อมูลสำเร็จ!');
                window.location.reload();
            } catch (error) {
                console.error(error);
                alert('เกิดข้อผิดพลาดในการลบข้อมูล!');
            }
        }
    };
    
    const navigate = useNavigate();
    
    // Fetch pending users with search parameters
    const fetchPendingUsers = async () => {
        setLoading(true);
        setError("");
        try {
            let url = `${apiBaseUrl}/search`;
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

    // Filter handlers
    const handleResetFilters = () => {
        setSelectedDepartment("");
        setSelectedSportType("");
        setSelectedSport("");
        setFirstName("");
        setLastName("");
        setCategories([]);
    };

    // Modal and dialog handlers
    const openDialog = (id, action) => setDialog({ open: true, id, action });
    const closeDialog = () => setDialog({ open: false, id: null, action: "" });
    
    // Medal modal handlers
    const openMedalModal = (id) => {
        setSelectedUserId(id);
        setMedalModalOpen(true);
    };

    const closeMedalModal = () => {
        setMedalModalOpen(false);
        setSelectedStatus('');
    };

    // Document and image dialog handlers
    const openPdfDialog = (documentUrl) => {
        setPdfUrl(documentUrl);
        setPdfDialogOpen(true);
    };

    const closePdfDialog = () => {
        setPdfDialogOpen(false);
    };

    const openImageDialog = (imageUrl) => {
        setImageUrl(imageUrl);
        setImageDialogOpen(true);
    };

    const closeImageDialog = () => {
        setImageDialogOpen(false);
    };

    // Update status handler
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
            const response = await axios.put(`http://localhost:5000/api/studentorgranization/update/${selectedUserId}`, {
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

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    // Fetch departments data from API
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
    }, [selectedDepartment, selectedSport, selectedCategory, firstName, lastName]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Category selected:", value);
        setFormData(prev => ({ ...prev, [name]: value }));
        setSelectedCategory(value);
    };

    const handleClick = (id) => {
        navigate(`/admindashboard/updatestudentorgranization/${id}`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                จัดการข้อมูลผู้ประสานงาน
            </Typography>

            {/* Search Filters */}
            <Box sx={{ mb: 3, mt: 2 }}>
    <Grid container spacing={2} alignItems="center" mb={2}>
        <Grid item xs={12} sm={4}>
            <TextField
                fullWidth
                label="ชื่อ"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
        </Grid>
                  
        <Grid item xs={12} sm={4}>
            <TextField
                fullWidth
                label="นามสกุล"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
        </Grid>
        
        <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
                <InputLabel>วิทยาเขต</InputLabel>
                <Select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                    <MenuItem value=""><em>กรุณาเลือกวิทยาเขต</em></MenuItem>
                    {departments.map((dept) => (
                        <MenuItem key={dept.id} value={dept.name}>
                            {dept.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
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
    
    {/* ปุ่มที่จัดเรียงใหม่ในแถวเดียวกัน ชิดซ้าย และขนาดเล็กลง */}
    <Box sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: 'flex-start' }}>
        <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/admindashboard/addstudentorgranization")}
            sx={{ height: '40px' }}
        >
            เพิ่มข้อมูล
        </Button>
        
        <Button
            variant="contained"
            color="success"
            onClick={exportToCSV}
            startIcon={<FileDownloadIcon />}
            sx={{ height: '40px' }}
            disabled={loading}
        >
            ส่งออก CSV
        </Button>
        
        <Button
            variant="contained"
            color="primary"
            onClick={exportToXLSX}
            startIcon={<FileDownloadIcon />}
            sx={{ height: '40px' }}
            disabled={loading}
        >
            ส่งออก Excel
        </Button>
    </Box>
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
                                    <TableCell>สถานะ</TableCell>
                                    <TableCell>อัพเดทข้อมูลนักกีฬา</TableCell>
                                    <TableCell>อัพเดทสถานะการเข้าแข่งขัน</TableCell>
                                    <TableCell>ลบข้อมูล</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingUsers.length > 0 ? pendingUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.title} {user.fname} {user.lname}</TableCell>
                                        <TableCell>{user.position}</TableCell>
                                        <TableCell>{user.department}</TableCell>
                                        <TableCell style={{ cursor: "pointer" }}>
                                            <img 
                                                src={`http://localhost:5000${user.profile_image}`} 
                                                alt="Profile" 
                                                width={50} 
                                                onClick={() => openImageDialog(`http://localhost:5000${user.profile_image}`)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                onClick={() => openPdfDialog(`http://localhost:5000${user.document}`)}
                                            >
                                                ดูข้อมูลเอกสาร
                                            </Button>
                                        </TableCell>
                                        <TableCell>{user.status || "ไม่ระบุ"}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    backgroundColor: '#4CAF50',
                                                    '&:hover': {
                                                        backgroundColor: '#45a049',
                                                    },
                                                    marginRight: 2,
                                                }}
                                                onClick={() => handleClick(user.registration_id)}
                                            >
                                                อัพเดทข้อมูลผู้ใช้งาน
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                sx={{
                                                    backgroundColor: '#f39c12',
                                                    '&:hover': {
                                                        backgroundColor: '#e67e22',
                                                    },
                                                    marginRight: 2,
                                                }}
                                                onClick={() => openMedalModal(user.registration_id)}
                                            >
                                                อัพเดทสถานะ
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{
                                                    backgroundColor: '#e74c3c',
                                                    '&:hover': {
                                                        backgroundColor: '#c0392b',
                                                    },
                                                }}
                                                onClick={() => handleDelete(user.registration_id)}
                                            >
                                                ลบข้อมูล
                                            </Button>
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

            {/* Medal Modal */}
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

            {/* Image Dialog */}
            <Dialog open={imageDialogOpen} onClose={closeImageDialog} maxWidth="md">
                <DialogTitle>
                    รูปภาพ
                    <IconButton
                        onClick={closeImageDialog}
                        style={{ position: "absolute", right: 10, top: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <img
                        src={imageUrl}
                        alt="Profile"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </DialogContent>
            </Dialog>

            {/* PDF Dialog */}
            <Dialog open={pdfDialogOpen} onClose={closePdfDialog} fullWidth maxWidth="md">
                <DialogTitle>
                    เอกสาร
                    <IconButton
                        onClick={closePdfDialog}
                        style={{ position: "absolute", right: 10, top: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <iframe
                        src={`${pdfUrl}#zoom=80`}
                        width="100%"
                        height="2000px"
                        style={{ border: "none" }}
                    ></iframe>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default Managestudentorgranization;