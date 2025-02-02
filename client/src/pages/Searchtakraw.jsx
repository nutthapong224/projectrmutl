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

const Searchtakraw = () => {
  const [searchQuery, setSearchQuery] = useState({ fname: "", lname: "", department: "", sport_type: "" });
  const [departments, setDepartments] = useState([]);
  const [sportTypes, setSportTypes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");  // Error message state
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL_APPROVETAKRAW;


  // Fetch departments and sport types from API
  useEffect(() => {
    const fetchDepartmentsAndSportTypes = async () => {
      try {
        // Fetch departments and sport types in a single API call
        const filterResponse = await axios.get(`${apiBaseUrl}/getfilter`);
        
        if (filterResponse.data) {
          setDepartments(filterResponse.data.departments.map(dept => ({
            id: dept,
            name: dept
          })));
          setSportTypes(filterResponse.data.sportTypes.map(sport => ({
            sport_type: sport
          })));
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchDepartmentsAndSportTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    if (!searchQuery.fname || !searchQuery.lname || !searchQuery.department || !searchQuery.sport_type) {
      setErrorMessage("กรุณากรอกข้อมูลทั้งหมด");
      return; // Prevent search if fields are not filled
    }
  
    setLoading(true);
    setError(null);
    setErrorMessage("");  // Clear error message when searching
  
    try {
      const response = await axios.get(`${apiBaseUrl}/search`, {
        params: searchQuery,
      });
  
      const data = response.data;
  
      // If there are results, find the closest match
      if (data.length > 0) {
        // Function to calculate how closely a player matches the search query
        const getMatchScore = (player) => {
          let score = 0;
          if (player.fname.includes(searchQuery.fname)) score++;
          if (player.lname.includes(searchQuery.lname)) score++;
          if (player.department === searchQuery.department) score++;
          if (player.sport_type === searchQuery.sport_type) score++;
          return score;
        };
  
        // Sort players by match score (highest first)
        const sortedResults = data.sort((a, b) => getMatchScore(b) - getMatchScore(a));
  
        // Set only the closest match result
        setResults([sortedResults[0]]);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setError("Error searching players.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/playertakraw/${id}`);
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
        ระบบค้นหานักกีฬาเซปักตะกร้อ
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
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>ประเภทกีฬา</InputLabel>
            <Select
              value={searchQuery.sport_type}
              onChange={handleChange}
              label="ประเภทกีฬา"
              name="sport_type"
              sx={{ fontFamily: "'Kanit', sans-serif" }}
            >
              {sportTypes.map((sport) => (
                <MenuItem key={sport.sport_type} value={sport.sport_type}>
                  {sport.sport_type}
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
                <TableCell sx={{ fontFamily: "'Kanit', sans-serif" }}>ประเภทกีฬา</TableCell>
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
                  <TableCell sx={{ fontFamily: "'Kanit', sans-serif" }}>{player.sport_type}</TableCell>
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

export default Searchtakraw;
