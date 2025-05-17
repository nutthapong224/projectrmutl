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
    IconButton,
    Box,
    TextField
} from "@mui/material";
import axios from "axios";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
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

const Manageplayer = () => {
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
    const [searchFirstName, setSearchFirstName] = useState("");
    const [searchLastName, setSearchLastName] = useState("");
    
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
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    
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

    const [open2, setOpen2] = useState(false);
    const [open, setOpen] = useState(false);
    
    const openPdfModal = (url) => {
        setPdfUrl(url);
        setOpen(true);
    };
    
    const handleImageClick = () => {
        setOpen2(true);
    };
    
    const fetchFilters = async () => {
        try {
            // const response = await axios.get(`${apiBaseUrl}/getpendingfilter`);
            // setDepartments(response.data.departments);
            // setSportTypes(response.data.sportTypes);

            // Fetch sport tables from the new API endpoint
            // const sportResponse = await axios.get(`${apiBaseUrl}/sportcategorie`);
            // setSportTables(sportResponse.data.sportTables);  // Assuming response has sportTables array
            // setSportTypes(sportResponse.data.sportTypes);  // Assuming response has sportTypes array
        } catch (err) {
            console.error("Failed to fetch filters:", err);
            setError("Failed to load filter options");
        }
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
                await axios.delete(`http://localhost:5000/api/players/player/${id}`);
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
            let url = `http://localhost:5000/api/players/searchpending/`;
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
        setSearchFirstName("");
        setSearchLastName("");
        setSelectedDepartment("");
        setSelectedSport("");
        setFirstName("");
        setLastName("");
        setSelectedCategory("");
        setCategories([]);
        setFormData({ category_id: "" });
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
            const response = await axios.put(`http://localhost:5000/api/players/update/${selectedUserId}`, {
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
    }, [selectedDepartment, selectedSport, selectedCategory, firstName, lastName]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("Category selected:", value); // Log the selected value
        setFormData(prev => ({ ...prev, [name]: value }));
        setSelectedCategory(value);  // Also update selectedCategory directly
    };

    const handleClick = (id) => {
        // Now using the id parameter passed when the function is called
        navigate(`/admindashboard/updateplayer/${id}`);
    };

    // ฟังก์ชันสำหรับส่งออกเป็น CSV
    const exportToCSV = async () => {
        setLoading(true);
        try {
            // สร้าง URL สำหรับการ fetch ข้อมูลจาก API
            let url = `http://localhost:5000/api/players/searchpending`;
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
                "รหัส",
                "คำนำหน้า",
                "ชื่อ",
                "นามสกุล",
                "เบอร์โทร",
                "กีฬา",
                "ประเภทกีฬา",
                "ประเภททีม",
                "วิทยาเขต",
                "สถานะ"
            ];

            // แปลงข้อมูลเป็นรูปแบบแถว
            const dataRows = dataToExport.map(user => [
                user.student_id,
                user.title,
                user.fname,
                user.lname,
                user.phone_number,
                sportMapping[user.sport_table] || user.sport_table,
                user.category_name,
                user.typeteam || "-",
                user.department,
                user.status
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
            const fileName = `รายชื่อนักกีฬา_${formattedDate}.csv`;
            
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
            let url = `http://localhost:5000/api/players/searchpending`;
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
                'รหัส': user.student_id,
                'คำนำหน้า': user.title,
                'ชื่อ': user.fname,
                'นามสกุล': user.lname,
                'เบอร์โทร': user.phone_number,
                'กีฬา': sportMapping[user.sport_table] || user.sport_table,
                'ประเภทกีฬา': user.category_name,
                'ประเภททีม': user.typeteam || "-",
                'วิทยาเขต': user.department,
                'สถานะ': user.status
            }));

            // สร้าง Workbook และ Worksheet
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'รายชื่อนักกีฬา');

            // สร้างชื่อไฟล์พร้อมวันที่
            const date = new Date();
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const fileName = `รายชื่อนักกีฬา_${formattedDate}.xlsx`;

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

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                จัดการข้อมูลนักกีฬา
            </Typography>

            {/* Search Filters */}
            <Box sx={{ mb: 3, mt: 2 }}>
                <Grid container spacing={2} alignItems="center" mb={2}>
                    {/* ค้นหาตามชื่อ */}
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
                    
                    {/* เลือกวิทยาเขต */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>วิทยาเขต</InputLabel>
                            <Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.name}>{dept.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    {/* เลือกกีฬา */}
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
                    
                    {/* เลือกประเภทกีฬา */}
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth required>
                            <InputLabel>เลือกประเภทกีฬา</InputLabel>
                            <Select name="category_id" value={formData.category_id || ""} onChange={handleInputChange}>
                                <MenuItem value=""><em>กรุณาเลือกประเภทกีฬา</em></MenuItem>
                                {categories.map(cat => (
                                    <MenuItem key={cat.category_id} value={cat.category_id}>{cat.category_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    {/* ปุ่มรีเซ็ตตัวกรอง */}
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

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/admindashboard/addplayer")}
                >
                    เพิ่มข้อมูล
                </Button>
                
                {/* ปุ่มส่งออก CSV */}
                <Button
                    variant="contained"
                    color="success"
                    onClick={exportToCSV}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    ส่งออก CSV
                </Button>
                
                {/* ปุ่มส่งออก Excel */}
                <Button
                    variant="contained"
                    color="info"
                    onClick={exportToXLSX}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    ส่งออก Excel
                </Button>
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
                                    <TableCell>เอกสาร</TableCell>
                                    <TableCell>สถานะ</TableCell>

                                    <TableCell>อัพเดทข้อมูลนักกีฬา</TableCell>
                                    <TableCell>อัพเดทสถานะการเข้าแข่งขัน</TableCell>
                                    <TableCell>ลบข้อมูล</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.title} {user.fname} {user.lname}</TableCell>

                                        <TableCell>{sportMapping[user.sport_table] || user.sport_table}</TableCell>
                                        <TableCell>{user.category_name}{user.typeteam}</TableCell>
                                        <TableCell>{user.department}</TableCell>

                                    
                                                        <TableCell onClick={() => setOpen2(true)} style={{ cursor: "pointer" }}>
                                            <img src={`http://localhost:5000${user.profile_image}`} alt="" width={50}  onClick={handleImageClick} />
                                          </TableCell>
                                                            <TableCell>
                                                                                <Button
                                                                                  variant="contained"
                                                                                  onClick={() => openPdfModal(`http://localhost:5000${user.document}`)}
                                                                                >
                                                                                  ดูข้อมูลเอกสาร
                                                                                </Button>
                                                                              </TableCell>
                                        <TableCell>{user.status}</TableCell>
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
                                        <TableCell> <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{
                                                backgroundColor: '#f39c12', // Change button color
                                                '&:hover': {
                                                    backgroundColor: '#e67e22', // Darker shade on hover
                                                },
                                                marginRight: 2, // Add space between buttons
                                            }}
                                            onClick={() => openMedalModal(user.registration_id)}
                                        >
                                            อัพเดทสถานะ
                                        </Button></TableCell>
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

                                        <Dialog open={open2} onClose={() => setOpen2(false)}>
  <img
    src={`http://localhost:5000${user.profile_image}`}
    alt="Profile Enlarged"
    style={{ maxWidth: "100%", height: "auto" }}
  />
</Dialog>

<Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
  <DialogTitle>
    เอกสาร
    <IconButton
      onClick={() => setOpen(false)}
      style={{ position: "absolute", right: 10, top: 10 }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    <iframe
      src={`${pdfUrl}#zoom=80`} // Set zoom level (100 = default, 120 = 20% zoom-in)
      width="100%"
      height="2000px" // Keep height reasonable
      style={{ border: "none" }}
    ></iframe>
  </DialogContent>
</Dialog> {/* This was missing */}

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
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

export default Manageplayer;
