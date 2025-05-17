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
    IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Managenews = () => {
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
    const [medalModalOpen, setMedalModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState("");
    
    // Add state for image dialog
    const [open2, setOpen2] = useState(false);
    const [currentImage, setCurrentImage] = useState("");
    
    // States for filters
    const [departments, setDepartments] = useState([]);
    const [sportTypes, setSportTypes] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedSportType, setSelectedSportType] = useState("");
    const [selectedSport, setSelectedSport] = useState(""); // Corrected variable name
    const [categories, setCategories] = useState([]);
    const [selectedPositionDirector, setSelectedPositionDirector] = useState(""); // Fixed variable name
    const [formData, setFormData] = useState({ category_id: "" }); // Added missing formData state
    // States for sport categories (this can be `sport_table` and `category_name`)
    const [sportTables, setSportTables] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCategory, setSelectedCategory] = useState("");
    const [positiondirector, setPositionDirector] = useState([]);
    
    // API URLs
    const apiBaseUrl = import.meta.env.VITE_API_URL_NEWS;
    const apiImage = import.meta.env.VITE_API_URL3;
    const sports = [
        { value: "ฟุตบอล", label: "ฟุตบอล" },
        { value: "ฟุตซอล", label: "ฟุตซอล" },
        { value: "บาสเก็ตบอล", label: "บาสเก็ตบอล" },
        { value: "บาสเก็ตบอล", label: "แบดมินตัน"},
        { value: "เทเบิลเทนิส", label: "เทเบิลเทนิส" },
        { value: "เซปักตะกร้อ", label: "เซปักตะกร้อ" },
        { value: "วอลเลย์บอล", label: "วอลเลย์บอล" },
        { value: "ตะกร้อลอดห่วง", label: "ตะกร้อลอดห่วง" },
        { value: "esport", label: "e-sport" },
        { value: "เปตอง", label: "เปตอง" },
    ];
   
    // Function to handle image click
    const handleImageClick = (imageUrl) => {
        setCurrentImage(imageUrl);
        setOpen2(true);
    };
    
    // Fetch categories based on selected sport type
    const fetchCategoriesBySportType = async (sportType) => {
        try {
            const response = await axios.get(`${apiBaseUrl}/category/${sportType}`);
            setCategories(response.data.categories);  // Assuming response contains categories array
        } catch (err) {
            setError("Failed to load categories.");
        }
    };

    // Fetch pending users with search parameters
    const handleDelete = async (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) {
            try {
                await axios.delete(`http://localhost:5000/api/news/player/${id}`);
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
            let url = `http://localhost:5000/api/news/searchall/`;
            const params = new URLSearchParams();
        
            if (selectedDepartment) {
                params.append('department', selectedDepartment);
                console.log("Using Department Filter:", selectedDepartment);
            } 
            if (selectedPositionDirector) { // Fixed variable name
                params.append('position', selectedPositionDirector); // Fixed variable name
            }
      
            if (selectedSport) {
                params.append('sport_type', selectedSport);
                console.log("Using Sport Filter:", selectedSport);
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
        setSelectedPositionDirector(""); // Fixed variable name
        setCategories([]); // Reset categories when filters are reset
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
            return; // หยุดการทำงานถ้าไม่ได้เลือกสถานะ
        }

        if (!selectedUserId) {
            setSnackbar({
                open: true,
                message: "กรุณาเลือกผู้ใช้ที่ต้องการอัพเดท",
                severity: "warning",
            });
            return; // หยุดการทำงานถ้าไม่ได้เลือกผู้ใช้
        }

        try {
            // ตรวจสอบว่า selectedUserId เป็นตัวแปรที่มีค่าหรือไม่
            const response = await axios.put(`http://localhost:5000/api/news/update/${selectedUserId}`, {
                status: selectedStatus
            });

            setSnackbar({
                open: true,
                message: "อัพเดทสถานะสำเร็จ!",
                severity: "success",
            });

            closeMedalModal();
            fetchPendingUsers(); // รีโหลดข้อมูลหลังจากอัปเดต

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
        // Log the id and action for confirmation
        console.log("Confirming action:", dialog.action, "on ID:", dialog.id);

        if (dialog.action === "approve") {
            // Confirm approval action
            handleApprove(dialog.id);
        } else if (dialog.action === "reject") {
            // Confirm rejection action
            handleReject(dialog.id);
        }
        window.location.reload();
        // Close the dialog after confirming the action
        closeDialog();
    };

    const openImageModal = (imageUrl) => {
        setImageUrl(imageUrl);
        setImageModalOpen(true);
    };
    
    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };
    
    const closeImageModal = () => setImageModalOpen(false);

    const openPdfModal = (documentUrl) => {
        setPdfUrl(documentUrl);
        setPdfModalOpen(true);
    };

    const closePdfModal = () => setPdfModalOpen(false);
    
    const sportMapping = {
        'สโมสรนักศึกษา': 'สโมสรนักศึกษา',
        'องค์การนักศึกษา': 'องค์การนักศึกษา',
    };
    
    // Effects
    const fetchDepartments = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/department"); // Make sure the API URL is correct
            setDepartments(response.data); // Assuming response.data is an array of { id, name }
        } catch (err) {
            console.error("Failed to fetch departments:", err);
        }
    };

    const fetchpositionDirector = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/positiondirector"); // Make sure the API URL is correct
            setPositionDirector(response.data); // Assuming response.data is an array of { id, name }
        } catch (err) {
            console.error("Failed to fetch departments:", err);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchPendingUsers();
        fetchpositionDirector();
      
    }, [selectedDepartment, selectedSport, selectedCategory, selectedPositionDirector]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Category selected:", value); // Log the selected value
        setFormData(prev => ({ ...prev, [name]: value }));
        setSelectedCategory(value);  // Also update selectedCategory directly
    };

    const handleClick = (id) => {
        // Now using the id parameter passed when the function is called
        navigate(`/admindashboard/updatenews/${id}`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                จัดการข้อมูลผู้ประสานงาน
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/admindashboard/addnews")}
            >
                เพิ่มข้อมูล
            </Button>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {error && <Typography color="error">{error}</Typography>}
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>หัวข้อ</TableCell>
                                    <TableCell>รายละเอียด</TableCell>
                                    <TableCell>รูปภาพ</TableCell>
                                    <TableCell>อัพเดทสถานะการเข้าแข่งขัน</TableCell>
                                    <TableCell>ลบข้อมูล</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.title}</TableCell>
                                        <TableCell>{user.description}</TableCell>
                                        <TableCell style={{ cursor: "pointer" }}>
                                            <img 
                                                src={`http://localhost:5000${user.profile_image}`} 
                                                alt="" 
                                                width={50} 
                                                onClick={() => handleImageClick(`http://localhost:5000${user.profile_image}`)}
                                            />
                                        </TableCell>
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
                                                onClick={() => handleClick(user.id)}
                                            >
                                                อัพเดทข้อมูลผู้ใช้งาน
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
            
            {/* Image Dialog - Added based on Manageplayer implementation */}
            <Dialog open={open2} onClose={() => setOpen2(false)}>
                <DialogTitle>
                    รูปภาพ
                    <IconButton
                        onClick={() => setOpen2(false)}
                        style={{ position: "absolute", right: 10, top: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <img
                        src={currentImage}
                        alt="Profile Enlarged"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </DialogContent>
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

export default Managenews;