import React, { useState, useEffect } from "react";
import axios from "axios";  // Make sure axios is imported
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const Searchbadminton = () => {
  const [searchQuery, setSearchQuery] = useState({ fname: "", lname: "", department: "" });
  const [departments, setDepartments] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");  // Error message state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/department");
        setDepartments(response.data);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    if (!searchQuery.fname || !searchQuery.lname || !searchQuery.department) {
      setErrorMessage("กรุณากรอกข้อมูลทั้งหมด");
      return;  // Prevent search if fields are not filled
    }

    setLoading(true);
    setError(null);
    setErrorMessage("");  // Clear error message when searching

    try {
      const response = await axios.get("http://localhost:5000/api/badminton/search", {
        params: searchQuery,
      });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setError("Error searching players.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/playerbadminton/${id}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{ fontFamily: "'Kanit', sans-serif" }}
      >
        ระบบค้นหานักกีฬาแบดมินตัน
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="กรุณากรอกชื่อ"
            variant="outlined"
            fullWidth
            value={searchQuery.fname}
            onChange={handleChange}
            name="fname"
            sx={{ fontFamily: "'Kanit', sans-serif" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="กรุณากรอกนามสกุล"
            variant="outlined"
            fullWidth
            value={searchQuery.lname}
            onChange={handleChange}
            name="lname"
            sx={{ fontFamily: "'Kanit', sans-serif" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>วิทยาเขต</InputLabel>
            <Select
              value={searchQuery.department}
              onChange={handleChange}
              label="วิทยาเขต"
              name="department"
              sx={{ fontFamily: "'Kanit', sans-serif" }}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        fullWidth
        sx={{ fontFamily: "'Kanit', sans-serif" }}
      >
        ค้นหา
      </Button>

      {/* Display error message if fields are not filled */}
      {errorMessage && (
        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 2, fontFamily: "'Kanit', sans-serif", color: "red" }}
        >
          {errorMessage}
        </Typography>
      )}

      {loading ? (
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          กำลังค้นหา...
        </Typography>
      ) : results.length > 0 ? (
        <TableContainer component={Paper} elevation={3} sx={{ overflowX: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: "'Kanit', sans-serif" }}>ชื่อ-นามสกุล</TableCell>
                <TableCell sx={{ fontFamily: "'Kanit', sans-serif" }}>วิทยาเขต</TableCell>
                <TableCell sx={{ fontFamily: "'Kanit', sans-serif" }}>แสดงข้อมูล</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((player) => (
                <TableRow key={player.id}>
                  <TableCell sx={{ fontFamily: "'Kanit', sans-serif" }}>
                    {player.prefix} {player.fname} {player.lname}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "'Kanit', sans-serif" }}>{player.department}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewDetails(player.id)}
                      sx={{ fontFamily: "'Kanit', sans-serif" }}
                    >
                      แสดงข้อมูล
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 2, fontFamily: "'Kanit', sans-serif" }}
        >
          ไม่พบข้อมูลที่ต้องการค้นหา
        </Typography>
      )}
    </Container>
  );
};

export default Searchbadminton;
