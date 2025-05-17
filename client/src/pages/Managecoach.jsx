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
    TextField,
    Tooltip,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Managecoach = () => {
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
    const [pdfTitle, setPdfTitle] = useState("");
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [imageTitle, setImageTitle] = useState("");
    const [medalModalOpen, setMedalModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    
    // States for filters
    const [departments, setDepartments] = useState([]);
    const [sportTypes, setSportTypes] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedSportType, setSelectedSportType] = useState("");
    const [selectedSport, setSelectedSport] = useState(""); 
    const [categories, setCategories] = useState([]);
    const [selectedPositionDirector, setSelectedPositionDirector] = useState(""); 
    const [formData, setFormData] = useState({ category_id: "" }); 
    
    // States for sport categories
    const [sportTables, setSportTables] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [positiondirector, setPositionDirector] = useState([]);
    
    // API URLs
    const apiBaseUrl = import.meta.env.VITE_API_URL_APPROVEDIRECTOR;
    const apiImage = import.meta.env.VITE_API_URL3;
    const sports = [
        { value: "ฟุตบอล", label: "ฟุตบอล" },
        { value: "ฟุตซอล", label: "ฟุตซอล" },
        { value: "บาสเก็ตบอล", label: "บาสเก็ตบอล" },
        { value: "แบดมินตัน", label: "แบดมินตัน"},
        { value: "เทเบิลเทนิส", label: "เทเบิลเทนิส" },
        { value: "เซปักตะกร้อ", label: "เซปักตะกร้อ" },
        { value: "วอลเลย์บอล", label: "วอลเลย์บอล" },
        { value: "ตะกร้อลอดห่วง", label: "ตะกร้อลอดห่วง" },
        { value: "esport", label: "e-sport" },
        { value: "เปตอง", label: "เปตอง" },
    ];
   
    // Fetch categories based on selected sport type
    const fetchCategoriesBySportType = async (sportType) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/category/${sportType}`);
            setCategories(response.data.categories);  // Assuming response contains categories array
        } catch (err) {
            setError("Failed to load categories.");
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) {
            try {
                await axios.delete(`http://localhost:5000/api/coach/player/${id}`);
                alert('ลบข้อมูลสำเร็จ!');
                // Optionally refresh the data or navigate after deletion
                window.location.reload(); // Refresh the page to update the list
            } catch (error) {
                console.error(error);
                alert('เกิดข้อผิดพลาดในการลบข้อมูล!');
            }
        }
    };
    
    const navigate = useNavigate();
    
    const fetchPendingUsers = async () => {
        setLoading(true);
        setError("");
        try {
            let url = `http://localhost:5000/api/coach/search`;
            const params = new URLSearchParams();
        
            if (selectedDepartment) {
                params.append('department', selectedDepartment);
                console.log("Using Department Filter:", selectedDepartment);
            } 
            if (selectedPositionDirector) {
                params.append('position', selectedPositionDirector);
            }
    
            if (selectedSport) {
                params.append('sport_type', selectedSport);
                console.log("Using Sport Filter:", selectedSport);
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

    // Export data to CSV
    const exportToCSV = () => {
        if (pendingUsers.length === 0) {
            setSnackbar({
                open: true,
                message: "ไม่มีข้อมูลที่จะส่งออก",
                severity: "warning"
            });
            return;
        }
        
        try {
            // Add BOM for UTF-8 encoding (helps Excel recognize Thai characters correctly)
            const BOM = "\uFEFF";
            
            // Define CSV headers
            const headers = [
                'ชื่อผู้สมัคร',
                'ประเภทผู้คุมทีม',
                'วิทยาเขต',
                'ประเภทกีฬา'
            ];
            
            // Convert data to CSV rows
            const csvRows = pendingUsers.map(user => [
                `${user.title} ${user.fname} ${user.lname}`,
                user.position,
                user.department,
                user.sport_type,
            ]);
            
            // Add headers to the beginning of the rows array
            csvRows.unshift(headers);
            
            // Convert each row to a comma-separated string and join with newlines
            const csvContent = BOM + csvRows.map(row => row.join(',')).join('\n');
            
            // Create a Blob with the CSV content
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            
            // Create a download link and trigger the download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            
            // Set filename with current date
            const date = new Date().toLocaleDateString('th-TH');
            link.setAttribute('download', `รายชื่อผู้คุมทีม_${date}.csv`);
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setSnackbar({
                open: true,
                message: "ส่งออกข้อมูลเป็น CSV สำเร็จ!",
                severity: "success"
            });
        } catch (error) {
            console.error("Error exporting CSV:", error);
            setSnackbar({
                open: true,
                message: "เกิดข้อผิดพลาดในการส่งออกข้อมูล",
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
        setSelectedPositionDirector("");
        setCategories([]); 
        setFirstName("");
        setSelectedSport("");
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

    const openImageModal = (imageUrl, userName) => {
        setImageUrl(imageUrl);
        setImageTitle(`รูปภาพของ ${userName}`);
        setImageModalOpen(true);
    };
    
    const closeImageModal = () => setImageModalOpen(false);

    const openPdfModal = (documentUrl, userName) => {
        setPdfUrl(documentUrl);
        setPdfTitle(`เอกสารของ ${userName}`);
        setPdfModalOpen(true);
    };

    const closePdfModal = () => setPdfModalOpen(false);

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
            const response = await axios.put(`http://localhost:5000/api/coach/update/${selectedUserId}`, {
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

    const sportMapping = {
        'สโมสรนักศึกษา': 'สโมสรนักศึกษา',
        'องค์การนักศึกษา': 'องค์การนักศึกษา',
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

    const fetchpositionDirector = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/positioncoach");
            setPositionDirector(response.data);
        } catch (err) {
            console.error("Failed to fetch positions:", err);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchPendingUsers();
        fetchpositionDirector();
    }, [selectedDepartment, selectedSport, selectedCategory, selectedPositionDirector, firstName, lastName]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Category selected:", value);
        setFormData(prev => ({ ...prev, [name]: value }));
        setSelectedCategory(value);
    };

    const handleClick = (id) => {
        navigate(`/admindashboard/updatecoach/${id}`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                จัดการข้อมูลผู้คุมทีม
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

            <Grid container spacing={2} mb={3}>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/admindashboard/addcoach")}
                    >
                        เพิ่มข้อมูล
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<DownloadIcon />}
                        onClick={exportToCSV}
                    >
                        ส่งออกเป็น CSV
                    </Button>
                </Grid>
            </Grid>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {error && <Typography color="error">{error}</Typography>}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ชื่อผู้สมัคร</TableCell>
                                    <TableCell>ประเภทผู้คุมทีม</TableCell>
                                    <TableCell>วิทยาเขต</TableCell>
                                    <TableCell>รูปภาพ</TableCell>
                                    <TableCell>เอกสาร</TableCell>
                                    <TableCell>ประเภทกีฬา</TableCell>
                                    <TableCell>อัพเดทข้อมูลนักกีฬา</TableCell>
                                    <TableCell>อัพเดทสถานะการเข้าแข่งขัน</TableCell>
                                    <TableCell>ลบข้อมูล</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.title} {user.fname} {user.lname}</TableCell>
                                        <TableCell>{user.position}</TableCell>
                                        <TableCell>{user.department}</TableCell>
                                        <TableCell>
                                            <img 
                                                src={`http://localhost:5000${user.profile_image}`} 
                                                alt="" 
                                                width={50} 
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => openImageModal(`http://localhost:5000${user.profile_image}`, `${user.title} ${user.fname} ${user.lname}`)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="คลิกเพื่อดูเอกสาร">
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => openPdfModal(`http://localhost:5000${user.document}`, `${user.title} ${user.fname} ${user.lname}`)}
                                                >
                                                    <PictureAsPdfIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{user.sport_type}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    backgroundColor: '#4CAF50',
                                                    '&:hover': {
                                                        backgroundColor: '#45a049',
                                                    },
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
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {/* Image Modal with improved styling */}
            <Modal 
                open={imageModalOpen} 
                onClose={closeImageModal}
                aria-labelledby="image-modal-title"
                aria-describedby="image-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        width: '100%', 
                        alignItems: 'center',
                        mb: 2 
                    }}>
                        <Typography id="image-modal-title" variant="h6" component="h2">
                            {imageTitle}
                        </Typography>
                        <IconButton onClick={closeImageModal} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ 
                        overflow: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        maxHeight: 'calc(90vh - 100px)'
                    }}>
                        <img 
                            src={imageUrl} 
                            alt="User Image" 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: 'calc(90vh - 100px)',
                                objectFit: 'contain'
                            }} 
                        />
                    </Box>
                </Box>
            </Modal>

            {/* PDF Modal with improved styling */}
            <Modal 
                open={pdfModalOpen} 
                onClose={closePdfModal}
                aria-labelledby="pdf-modal-title"
                aria-describedby="pdf-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    width: '90vw',
                    height: '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2
                    }}>
                        <Typography id="pdf-modal-title" variant="h6" component="h2">
                            {pdfTitle}
                        </Typography>
                        <IconButton onClick={closePdfModal} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <embed 
                            src={pdfUrl} 
                            type="application/pdf"
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                        />
                    </Box>
                </Box>
            </Modal>

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

            {/* Image Modal */}
            <Modal open={imageModalOpen} onClose={closeImageModal}>
                <Box>
                    <img src={imageUrl} alt="User Image" />
                </Box>
            </Modal>

            {/* PDF Modal */}
            <Modal open={pdfModalOpen} onClose={closePdfModal}>
                <Box>
                    <embed src={pdfUrl} width="100%" height="600px" />
                </Box>
            </Modal>
        </Container>
    );
};

export default Managecoach;
