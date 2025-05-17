import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Grid,
  createTheme,
  ThemeProvider,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Theme with white background and clean look
const cleanTheme = createTheme({
  palette: {
    primary: {
      main: "#0D47A1",
    },
    secondary: {
      main: "#E3F2FD",
    },
    text: {
      primary: "#212121",
      secondary: "#616161",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Kanit", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
  },
});

// Styled table cell for headers
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  border: "1px solid #e0e0e0",
}));

// Styled table row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f9f9f9",
  },
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
  "& td, & th": {
    border: "1px solid #e0e0e0",
  },
}));

export default function MatchResults() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ category_id: "" });
  const [searchClicked, setSearchClicked] = useState(false);

  const sportMapping = {
    all: "ทั้งหมด", // เพิ่มตัวเลือก "ทั้งหมด"
    football: "ฟุตบอล",
    volleyball: "วอลเลย์บอล",
    badminton: "แบดมินตัน",
    basketball: "บาสเกตบอล",
    futsal: "ฟุตซอล",
    takraw: "เซปักตะกร้อ",
    hooptakraw: "เซปักตะกร้อลอดห่วง",
    tabletenis: "เทเบิลเทนิส",
    esport: "e-sport",
    petanque: "เปตอง",
  };

  const sports = Object.entries(sportMapping).map(([value, label]) => ({
    value,
    label,
  }));

  // ฟังก์ชันสำหรับแปลงรูปแบบวันที่เป็นรูปแบบไทย
  const formatThaiDate = (dateStr) => {
    if (!dateStr) return "-";
    
    try {
      const thaiMonths = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
      ];
      
      // รับวันที่ในรูปแบบ YYYY-MM-DD
      const parts = dateStr.split("-");
      if (parts.length !== 3) return dateStr;
      
      const year = parseInt(parts[0]); // ค.ศ.
      const month = parseInt(parts[1]) - 1; // เดือน (0-11)
      const day = parseInt(parts[2]); // วัน
      
      // แปลงเป็นรูปแบบ "วันที่ เดือนไทย พ.ศ."
      const thaiYear = year + 543; // แปลงจาก ค.ศ. เป็น พ.ศ.
      return `${day} ${thaiMonths[month]} ${thaiYear}`;
    } catch (error) {
      console.error("Date format error:", error);
      return dateStr;
    }
  };
  
  // ฟังก์ชันสำหรับแปลงรูปแบบเวลาเป็นรูปแบบไทย
  const formatThaiTime = (timeStr) => {
    if (!timeStr) return "-";
    
    try {
      // รับเวลาในรูปแบบ HH:MM:SS หรือ HH:MM
      const parts = timeStr.split(":");
      if (parts.length < 2) return timeStr;
      
      const hours = parts[0];
      const minutes = parts[1];
      
      // แปลงเป็นรูปแบบ "HH.MM น."
      return `${hours}.${minutes} น.`;
    } catch (error) {
      console.error("Time format error:", error);
      return timeStr;
    }
  };

  const fetchMatches = async () => {
    setLoading(true);
    setError("");
    try {
      let url = `http://localhost:5000/api/matches/searchpending`;
      const params = new URLSearchParams();
      
      // ส่งพารามิเตอร์ sport_table เฉพาะเมื่อไม่ได้เลือก "ทั้งหมด"
      if (selectedSport && selectedSport !== "all") {
        params.append("sport_table", selectedSport);
      }
      
      if (selectedCategory) params.append("category_id", selectedCategory);
      const fullUrl = params.toString() ? `${url}?${params}` : url;
      const response = await axios.get(fullUrl);
      
      // ถ้าผลลัพธ์เป็น Array ให้ใช้เลย แต่ถ้าไม่ใช่ ให้ตรวจสอบรูปแบบข้อมูลและแปลงให้เหมาะสม
      const matchData = Array.isArray(response.data) ? response.data : [];
      setMatches(matchData);
      setSearchClicked(true);
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลการแข่งขันได้");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSelectedCategory(value);
  };

  const handleResetFilters = () => {
    setSelectedSport("");
    setSelectedCategory("");
    setFormData({ category_id: "" });
    setSearchClicked(false);
    setMatches([]);
  };

  // เรียกหมวดหมู่เมื่อเลือกกีฬา (ยกเว้นเมื่อเลือก "ทั้งหมด")
  useEffect(() => {
    if (selectedSport && selectedSport !== "all") {
      axios
        .get(`http://localhost:5000/api/sports/category/${selectedSport}`)
        .then((res) => setCategories(res.data.categories || res.data))
        .catch(() => setCategories([]));
    } else {
      setCategories([]);
    }
  }, [selectedSport]);

  // ฟังก์ชันสำหรับจัดกลุ่มข้อมูลตามประเภทกีฬา
  const groupMatchesBySport = (matches) => {
    const grouped = {};
    
    matches.forEach(match => {
      const sportType = match.sport_table || 'unknown';
      if (!grouped[sportType]) {
        grouped[sportType] = [];
      }
      grouped[sportType].push(match);
    });
    
    return grouped;
  };
  
  // ฟังก์ชันสำหรับจัดกลุ่มข้อมูลตามประเภทย่อยของกีฬา (category)
  const groupMatchesByCategory = (matches) => {
    const grouped = {};
    
    matches.forEach(match => {
      const categoryKey = match.category_id || 'unknown';
      const categoryName = match.category_name || 'ไม่ระบุประเภท';
      
      if (!grouped[categoryKey]) {
        grouped[categoryKey] = {
          name: categoryName,
          matches: []
        };
      }
      grouped[categoryKey].matches.push(match);
    });
    
    return grouped;
  };
  
  // ฟังก์ชันแปลงรหัสประเภทกีฬาเป็นชื่อที่แสดงผล
  const getSportDisplayName = (sportCode) => {
    // ค้นหาชื่อที่แสดงผลจาก sportMapping
    for (const [code, name] of Object.entries(sportMapping)) {
      if (code === sportCode) {
        return name;
      }
    }
    return sportCode; // ถ้าไม่พบให้ใช้รหัสเดิม
  };
  
  // สร้างตารางสำหรับแสดงผลการแข่งขัน
  const renderMatchTable = (matches, sportTitle = null) => (
    <Box sx={{ mb: 4 }}>
      {sportTitle && (
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}>
          {sportTitle}
        </Typography>
      )}
      <TableContainer component={Paper} sx={{ boxShadow: 1, mb: 2 }}>
        <Table aria-label="match results table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">วันที่แข่ง</StyledTableCell>
              <StyledTableCell align="center">เวลาแข่ง</StyledTableCell>
              <StyledTableCell align="center">รอบการแข่งขัน</StyledTableCell>
              <StyledTableCell align="center">ทีมที่ 1</StyledTableCell>
              <StyledTableCell align="center">ผลการแข่งขัน</StyledTableCell>
              <StyledTableCell align="center">ทีมที่ 2</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.length > 0 ? (
              matches.map((match) => (
                <StyledTableRow key={match.registration_id}>
                  <TableCell align="center">{formatThaiDate(match.match_date)}</TableCell>
                  <TableCell align="center">{formatThaiTime(match.match_time)}</TableCell>
                  <TableCell align="center">{match.winner}</TableCell>
                  <TableCell align="center">
                    {match.team1} {match.typeteam1}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {match.team1score}-{match.team2score}
                  </TableCell>
                  <TableCell align="center">
                    {match.team2} {match.typeteam2}
                  </TableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">ไม่พบข้อมูลการแข่งขัน</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // แสดงผลการแข่งขันแบบตารางทั้งหมดจัดกลุ่มตามประเภทกีฬาและประเภทย่อย
  const renderAllMatchesTables = () => {
    const groupedMatches = groupMatchesBySport(matches);
    
    if (Object.keys(groupedMatches).length === 0) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4, p: 5, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="body1" color="text.secondary" align="center">
            ไม่พบข้อมูลการแข่งขัน
          </Typography>
        </Box>
      );
    }
    
    return Object.entries(groupedMatches).map(([sportType, sportMatches]) => {
      // จัดกลุ่มข้อมูลตามประเภทย่อย
      const categorizedMatches = groupMatchesByCategory(sportMatches);
      
      return (
        <Box key={sportType} sx={{ mb: 4 }}>
          <Paper sx={{ p: 3, boxShadow: 1 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}>
              {getSportDisplayName(sportType)}
            </Typography>
            
            {Object.entries(categorizedMatches).map(([categoryId, categoryData]) => (
              <Box key={categoryId} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: "text.secondary" }}>
                  {categoryData.name}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {/* แสดงตารางแทนการใช้ Card */}
                {renderMatchTable(categoryData.matches, null)}
              </Box>
            ))}
          </Paper>
        </Box>
      );
    });
  };

  return (
    <ThemeProvider theme={cleanTheme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pt: 4, pb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            ผลการแข่งขัน
          </Typography>

          <Paper sx={{ p: 3, mb: 3, boxShadow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="sport-select-label">เลือกกีฬา</InputLabel>
                  <Select
                    labelId="sport-select-label"
                    id="sport-select"
                    value={selectedSport}
                    label="เลือกกีฬา"
                    onChange={(e) => {
                      setSelectedSport(e.target.value);
                      // รีเซ็ตค่าหมวดหมู่เมื่อเปลี่ยนกีฬา
                      setSelectedCategory("");
                      setFormData((prev) => ({ ...prev, category_id: "" }));
                    }}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>กรุณาเลือกกีฬา</em>
                    </MenuItem>
                    {sports.map((sport) => (
                      <MenuItem key={sport.value} value={sport.value}>
                        {sport.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth disabled={!selectedSport || selectedSport === "all"}>
                  <InputLabel id="category-select-label">เลือกประเภทกีฬา</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    name="category_id"
                    value={formData.category_id}
                    label="เลือกประเภทกีฬา"
                    onChange={handleInputChange}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>กรุณาเลือกประเภทกีฬา</em>
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  onClick={fetchMatches}
                  sx={{ height: '40px' }}
                  disabled={!selectedSport}
                >
                  ค้นหา
                </Button>
              </Grid>

              <Grid item xs={12} md={3}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth 
                  onClick={handleResetFilters}
                  sx={{ height: '40px' }}
                >
                  รีเซ็ตตัวกรอง
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          ) : searchClicked ? (
            selectedSport === "all" ? (
              // แสดงผลแบบตารางเรียงตามประเภทกีฬาและประเภทย่อยเมื่อเลือก "ทั้งหมด"
              renderAllMatchesTables()
            ) : (
              // แสดงผลแบบตารางเมื่อเลือกกีฬาเฉพาะ
              renderMatchTable(matches)
            )
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4, p: 5, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="body1" color="text.secondary" align="center">
                กรุณาเลือกกีฬา ประเภทกีฬา และกดค้นหาเพื่อแสดงผลการแข่งขัน
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}