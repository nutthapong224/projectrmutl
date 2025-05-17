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
    CircularProgress,
    Alert,
    Box
} from "@mui/material";
import axios from "axios";

const Tablemedal = () => {
    // States for user data and loading
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    จัดการข้อมูลเหรียญการแข่งขัน
                </Typography>
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
                                            <TableCell align="center">{user.gold}</TableCell>
                                            <TableCell align="center">{user.silver}</TableCell>
                                            <TableCell align="center">{user.bronze}</TableCell>
                                            <TableCell align="center">{totalMedals}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Container>
    );
};

export default Tablemedal;