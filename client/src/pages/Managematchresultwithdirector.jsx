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
import { useNavigate } from "react-router-dom";
const Managematchresult = () => {
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
    // States for filters
    const [departments, setDepartments] = useState([]);
    const [sportTypes, setSportTypes] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedSportType, setSelectedSportType] = useState("");
    const [selectedSport, setSelectedSport] = useState(""); // Corrected variable name
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({ category_id: "" }); // Added missing formData state
    // States for sport categories (this can be `sport_table` and `category_name`)
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
                await axios.delete(`http://localhost:5000/api/matches/player/${id}`);
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
            let url = `http://localhost:5000/api/matches/searchall`;
            const params = new URLSearchParams();


            if (selectedSport) {
                params.append('sport_table', selectedSport);
                console.log("Using Sport Filter:", selectedSport); // Log the sport filter
            }
            if (selectedCategory) {
                params.append('category_id', selectedCategory);
                console.log("Using Category Filter:", selectedCategory); // Log the category filter
            }

            const queryString = params.toString();
            const fullUrl = queryString ? `${url}?${queryString}` : url;
            console.log("Fetching data from:", fullUrl); // Log the full URL

            const response = await axios.get(fullUrl);
            setPendingUsers(response.data);
        } catch (err) {
            setError(err.response?.data || "Failed to fetch pending users.");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
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
        setSelectedSport("");
        setSelectedSportType("");
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
            const response = await axios.put(`http://localhost:5000/api/matches/update/${selectedUserId}`, {
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
            const response = await axios.get("http://localhost:5000/api/department"); // Make sure the API URL is correct
            setDepartments(response.data); // Assuming response.data is an array of { id, name }
        } catch (err) {
            console.error("Failed to fetch departments:", err);
        }
    };

    useEffect(() => {


        fetchDepartments();
        fetchPendingUsers();
        if (selectedSport) {
            axios.get(`http://localhost:5000/api/sports/category/${selectedSport}`)
                .then(response => setCategories(response.data.categories || response.data)) // ตรวจสอบโครงสร้าง response
                .catch(() => setCategories([]));
        } else {
            setCategories([]);
        }
        console.log("Selected Department:", selectedDepartment);
        console.log("Selected Sporttype:", selectedSport);
        console.log("Selected Category:", selectedCategory);
    }, [selectedDepartment, selectedSport, selectedCategory]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Category selected:", value); // Log the selected value
        setFormData(prev => ({ ...prev, [name]: value }));
        setSelectedCategory(value);  // Also update selectedCategory directly
    };

    const handleClick = (id) => {
        // Now using the id parameter passed when the function is called
        navigate(`/directordashboard/updatematchresult/${id}`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                จัดการข้อมูลผลการแข่งขัน
            </Typography>

            {/* Search Filters */}
            <Box sx={{ mb: 3, mt: 2 }}>
                <Grid container spacing={2} alignItems="center" mb={2}>

                   

                    {/* เลือกกีฬา (Sport Selection) */}
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

                    {/* เลือกประเภทกีฬา (Category Selection) */}
                    <Grid item xs={12} sm={4}>
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

            </Box>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/directordashboard/addteam")}
            >
                เพิ่มกีฬาการแข่งขัน
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/directordashboard/addresultsport")}
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
                          
                                    <TableCell>กีฬา</TableCell>
                                    <TableCell>ประเภทกีฬา</TableCell>
                                    <TableCell>ทีมที่1</TableCell>
                                    
                                    <TableCell>ผลการแข่งขัน</TableCell>
                                    <TableCell>ทีมที่2</TableCell>
                                    <TableCell>รอบการแข่งขัน</TableCell>
                                    <TableCell>อัพเดทสถานะการเข้าแข่งขัน</TableCell>
                                    <TableCell>ลบข้อมูล</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingUsers.map((user) => (
                                    <TableRow key={user.id}>
                            

                                        <TableCell>{sportMapping[user.sport_table] || user.sport_table}</TableCell>
                                        <TableCell>{user.category_name}</TableCell>
                            
                                        <TableCell>{user.team1} {user.typeteam1}</TableCell>
                                        <TableCell>{user.team1score}-{user.team2score}</TableCell>
                                        <TableCell>{user.team2} {user.typeteam2}</TableCell>
                                        <TableCell>{user.winner}</TableCell>
                                
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
                                                อัพเดทข้อมูลการแข่งขัน
                                            </Button>


                                        </TableCell>

                                        <TableCell>    <Button
                                            variant="contained"
                                            color="error"
                                            sx={{
                                                backgroundColor: '#e74c3c', // Change button color
                                                '&:hover': {
                                                    backgroundColor: '#c0392b', // Darker shade on hover
                                                },
                                            }}
                                            onClick={() => handleDelete(user.registration_id)}
                                        >
                                            ลบข้อมูล
                                        </Button></TableCell>
                                    </TableRow>
                                ))}
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

export default Managematchresult;
