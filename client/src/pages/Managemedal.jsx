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
    Box
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Manageplayer = () => {
    // States for user data and loading
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // States for notifications and dialogs
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [dialog, setDialog] = useState({ open: false, id: null, action: "" });

    // API URLs
    const apiBaseUrl = import.meta.env.VITE_API_URL_UPDATEREGISTRATION;

    const navigate = useNavigate();

    const handleDelete = async (id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) {
            try {
                await axios.delete(`http://localhost:5000/api/medal/medal/${id}`);
                setSnackbar({ open: true, message: "ลบข้อมูลสำเร็จ!", severity: "success" });
                // รีโหลดข้อมูลแทนการรีโหลดหน้า
                fetchPendingUsers();
            } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: "เกิดข้อผิดพลาดในการลบข้อมูล!", severity: "error" });
            }
        }
    };

    const fetchPendingUsers = async () => {
        setLoading(true);
        setError("");
        try {
            let url = `http://localhost:5000/api/medal/medal/`;
            const response = await axios.get(url);
            
            // เรียงลำดับข้อมูลโดยเรียงจากเหรียญทองมากไปน้อย
            const sortedData = response.data.sort((a, b) => {
                // เรียงตามจำนวนเหรียญทอง (มากไปน้อย)
                if (parseInt(a.gold) !== parseInt(b.gold)) {
                    return parseInt(b.gold) - parseInt(a.gold);
                }
                // ถ้าเหรียญทองเท่ากัน ให้เรียงตามเหรียญเงิน
                if (parseInt(a.silver) !== parseInt(b.silver)) {
                    return parseInt(b.silver) - parseInt(a.silver);
                }
                // ถ้าเหรียญเงินเท่ากัน ให้เรียงตามเหรียญทองแดง
                return parseInt(b.bronze) - parseInt(a.bronze);
            });
            
            setPendingUsers(sortedData);
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

    // Modal and dialog handlers
    const openDialog = (id, action) => setDialog({ open: true, id, action });
    const closeDialog = () => setDialog({ open: false, id: null, action: "" });

    const confirmAction = () => {
        if (dialog.action === "approve") {
            handleApprove(dialog.id);
        } else if (dialog.action === "reject") {
            handleReject(dialog.id);
        }
        fetchPendingUsers(); // รีโหลดข้อมูลแทนการรีโหลดหน้า
        closeDialog();
    };

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

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleClick = (id) => {
        navigate(`/admindashboard/updatemedalplayer/${id}`);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    จัดการข้อมูลเหรียญการแข่งขัน
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/admindashboard/addmedal")}
                >
                    เพิ่มข้อมูล
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell align="center">ลำดับ</TableCell>
                                    <TableCell>มหาวิทยาลัย</TableCell>
                                    <TableCell align="center">เหรียญทอง</TableCell>
                                    <TableCell align="center">เหรียญเงิน</TableCell>
                                    <TableCell align="center">เหรียญทองแดง</TableCell>
                                    <TableCell align="center">รวม</TableCell>
                                    <TableCell align="center">อัพเดทข้อมูล</TableCell>
                                    <TableCell align="center">ลบข้อมูล</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pendingUsers.map((user, index) => {
                                    // คำนวณจำนวนเหรียญรวม
                                    const totalMedals = parseInt(user.gold || 0) + parseInt(user.silver || 0) + parseInt(user.bronze || 0);
                                    
                                    return (
                                        <TableRow 
                                            key={user.registration_id} 
                                            sx={{
                                                // ไฮไลท์ 3 อันดับแรก
                                                backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 
                                                                index === 1 ? 'rgba(192, 192, 192, 0.1)' : 
                                                                index === 2 ? 'rgba(205, 127, 50, 0.1)' : 'inherit',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                },
                                            }}
                                        >
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell>{user.department}</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#FFD700' }}>{user.gold}</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#C0C0C0' }}>{user.silver}</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold', color: '#CD7F32' }}>{user.bronze}</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>{totalMedals}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#4CAF50',
                                                        '&:hover': {
                                                            backgroundColor: '#45a049',
                                                        }
                                                    }}
                                                    onClick={() => handleClick(user.registration_id)}
                                                >
                                                    อัพเดทข้อมูล
                                                </Button>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
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
                                    );
                                })}
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
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    severity={snackbar.severity} 
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    variant="filled"
                    elevation={6}
                >
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
        </Container>
    );
};

export default Manageplayer;