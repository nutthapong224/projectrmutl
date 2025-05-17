import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography, 
  Container, 
  Grid, 
  Paper,
  Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Football from "../assets/football.png";
import Badminton from "../assets/badminton.png";
import Tabletenis from "../assets/tabletenis.png";
import Futsal from "../assets/futsal.png";
import Basketball from "../assets/basketball.png";
import Takraw from "../assets/takraw.png";
import Hooptakraw from "../assets/hooptakraw.png";
import Volleyball from "../assets/volleyball.png";
import Esport from "../assets/esport.png";
import Petanque from "../assets/petanque.png";
import { useNavigate, useParams } from 'react-router-dom';
import thLocale from 'date-fns/locale/th';
import { format, parse } from 'date-fns';

const Updatematchresult = () => {
  const { id } = useParams(); // Getting the 'id' from the URL parameters
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    team1: '',
    team1score: '',
    team2: '',
    team2score: '',
    winner: '', 
    category_id: '',
    sport_table: '',
    typeteam1: 'ทีม A',
    typeteam2: 'ทีม A',
    match_date: '',
    match_time: ''
  });
  
  // เพิ่มสถานะสำหรับเหรียญรางวัล
  const [medalData, setMedalData] = useState({
    department: '',  // ใช้ department แทน campus
    gold: 0,
    silver: 0,
    bronze: 0
  });

  const [selectedTime, setSelectedTime] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedSport, setSelectedSport] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedMedal, setSelectedMedal] = useState('none');
  
  const sports = [
    { value: 'football', label: 'ฟุตบอล', icon: <img src={Football} alt="football" width="200" /> },
    { value: 'futsal', label: 'ฟุตซอล', icon: <img src={Futsal} alt="football" width="200" /> },
    { value: 'basketball', label: 'บาสเก็ตบอล', icon: <img src={Basketball} alt="football" width="200" /> },
    { value: 'badminton', label: 'แบดมินตัน', icon: <img src={Badminton} alt="football" width="200" /> },
    { value: 'tabletenis', label: 'เทเบิลเทนิส', icon: <img src={Tabletenis} alt="football" width="200" /> },
    { value: 'takraw', label: 'เซปักตะกร้อ', icon: <img src={Takraw} alt="football" width="200" /> },
    { value: 'volleyball', label: 'วอลเลย์บอล', icon: <img src={Volleyball} alt="football" width="200" /> },
    { value: 'hooptakraw', label: 'ตะกร้อลอดห่วง', icon: <img src={Hooptakraw} alt="football" width="200" /> },
    { value: 'esport', label: 'e-sport', icon: <img src={Esport} alt="football" width="200" /> },
    { value: 'petanque', label: 'เปตอง', icon: <img src={Petanque} alt="football" width="200" /> },
  ];

  const teamTypes = [
    { value: 'ทีม A', label: 'ทีม A' },
    { value: 'ทีม B', label: 'ทีม B' }
  ];
  
  const rounds = [
    { value: 'สายA', label: 'สายA' },
    { value: 'สายฺB', label: 'สายฺB' },
    { value: 'รอบก่อนรองชนะเลิศ', label: 'รอบก่อนรองชนะเลิศ' },
    { value: 'รอบรองชนะเลิศ', label: 'รอบรองชนะเลิศ' },
    { value: 'รอบชิงชนะเลิศ', label: 'รอบชิงชนะเลิศ' }
  ];
  
  const medalTypes = [
    { value: 'gold', label: 'เหรียญทอง' },
    { value: 'silver', label: 'เหรียญเงิน' },
    { value: 'bronze', label: 'เหรียญทองแดง' },
    { value: 'none', label: 'ไม่มีเหรียญ' }
  ];

  // Initial data fetch: departments and match data
  useEffect(() => {
    // Fetch departments
    axios.get("http://localhost:5000/api/department/")
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });

    // Fetch match data by ID - Only once when component mounts
    if (id) {
      axios.get(`http://localhost:5000/api/matches/player/${id}`)
        .then(response => {
          const matchData = response.data;
          console.log("Fetched match data:", matchData);
          
          // Set selectedSport directly
          setSelectedSport(matchData.sport_table);
          
          // Format match_date for the form input
          let formattedDate = '';
          if (matchData.match_date) {
            try {
              // Parse ISO date to format YYYY-MM-DD for input field
              formattedDate = matchData.match_date.split('T')[0];
              console.log("Formatted date:", formattedDate);
            } catch (error) {
              console.error("Error formatting date:", error);
              formattedDate = '';
            }
          }
          
          // Handle time value
          if (matchData.match_time) {
            try {
              // Strip any seconds from the time value if present
              const timeValue = matchData.match_time.substring(0, 5);
              
              // Create a date object with the time for TimePicker
              const today = new Date();
              const [hours, minutes] = timeValue.split(':').map(Number);
              today.setHours(hours, minutes, 0);
              
              setSelectedTime(today);
              
              // Set the time string directly in formData
              setFormData(prev => ({
                ...prev,
                match_time: timeValue
              }));
              
              console.log("Set time to:", timeValue, today);
            } catch (error) {
              console.error("Error parsing time:", error);
              setSelectedTime(null);
            }
          }
          
          // Set form data fields
          setFormData({
            team1: matchData.team1 || '',
            team1score: matchData.team1score || '',
            team2: matchData.team2 || '',
            team2score: matchData.team2score || '',
            winner: matchData.winner || '',
            category_id: matchData.category_id || '',
            sport_table: matchData.sport_table || '',
            typeteam1: matchData.typeteam1 || 'ทีม A',
            typeteam2: matchData.typeteam2 || 'ทีม A',
            match_date: formattedDate,
            match_time: matchData.match_time ? matchData.match_time.substring(0, 5) : '' // Format HH:MM
          });
          
          // Check if medal data exists and set it
          // This is typically would be in a separate API call, but simulating for now
          if (matchData.medal_department) {
            setMedalData({
              department: matchData.medal_department,
              gold: matchData.gold || 0,
              silver: matchData.silver || 0,
              bronze: matchData.bronze || 0
            });
            
            // Determine which medal type is active
            if (matchData.gold > 0) setSelectedMedal('gold');
            else if (matchData.silver > 0) setSelectedMedal('silver');
            else if (matchData.bronze > 0) setSelectedMedal('bronze');
            else setSelectedMedal('none');
          }
        })
        .catch(error => {
          console.error("Error fetching match data:", error);
        });
    }
  }, [id]); // Only depend on ID, not selectedSport

  // Effect for fetching categories when selectedSport changes
  useEffect(() => {
    if (selectedSport) {
      console.log("Fetching categories for sport:", selectedSport);
      // Update formData with the new selectedSport
      setFormData(prev => {
        const updated = { ...prev, sport_table: selectedSport };
        console.log("Updated formData sport_table:", updated.sport_table);
        return updated;
      });
      
      // Fetch categories for the selected sport
      axios.get(`http://localhost:5000/api/sports/category/${selectedSport}`)
        .then(response => setCategories(response.data))
        .catch(() => setCategories([]));
    } else {
      setCategories([]);
    }
  }, [selectedSport]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
    if (newTime) {
      // Format time as HH:MM for storing in formData
      const timeString = format(newTime, 'HH:mm');
      setFormData(prev => ({ ...prev, match_time: timeString }));
      console.log("Time changed to:", timeString);
    } else {
      setFormData(prev => ({ ...prev, match_time: '' }));
    }
  };

  const handleDateChange = (e) => {
    // Capture the date value
    const dateValue = e.target.value;
    console.log("Date changed to:", dateValue);
    setFormData(prev => ({ ...prev, match_date: dateValue }));
  };

  // จัดการการเปลี่ยนแปลงค่าแผนก/วิทยาเขต
  const handleDepartmentMedalChange = (e) => {
    setMedalData(prev => ({ ...prev, department: e.target.value }));
  };

  // จัดการการเปลี่ยนแปลงค่าเหรียญ
  const handleMedalChange = (e) => {
    const medal = e.target.value;
    setSelectedMedal(medal);
    
    // รีเซ็ตค่าเหรียญทั้งหมดก่อน
    const resetMedals = {
      gold: 0,
      silver: 0,
      bronze: 0
    };
    
    // เพิ่มค่าเหรียญตามที่เลือก
    if (medal !== 'none') {
      resetMedals[medal] = 1;
    }
    
    setMedalData(prev => ({
      ...prev,
      ...resetMedals
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug log to see what's being submitted
    console.log("Form being submitted with data:", formData);
    
    if (!formData.team1 || !formData.team2) {
      alert("Please select both teams before submitting.");
      return;
    }
  
    if (!formData.match_date) {
      alert("กรุณาระบุวันที่แข่งขัน");
      return;
    }
  
    if (!formData.match_time) {
      alert("กรุณาระบุเวลาแข่งขัน");
      return;
    }
    
    try {
      // อัปเดตข้อมูลแมตช์
      const response = await axios.put(`http://localhost:5000/api/matches/update-registration/${id}`, formData);
      console.log("Match update response:", response.data);
      
      // อัปเดตข้อมูลเหรียญรางวัล (ถ้ามีการเปลี่ยนแปลง)
      // โดยปกติคุณอาจต้องตรวจสอบว่ามีการเปลี่ยนแปลงเหรียญจากเดิมหรือไม่
      if (selectedMedal !== 'none' && medalData.department) {
        // อัปเดตเหรียญ - ในสถานการณ์จริงคุณอาจต้องมี API เฉพาะสำหรับการอัปเดตเหรียญของแมตช์นี้
        const medalResponse = await axios.put(`http://localhost:5000/api/medal/updatemedal/${id}`, {
          department: medalData.department,
          gold: selectedMedal === 'gold' ? 1 : 0,
          silver: selectedMedal === 'silver' ? 1 : 0,
          bronze: selectedMedal === 'bronze' ? 1 : 0
        });
        console.log("Medal update response:", medalResponse.data);
      }
      
      alert('อัพเดทข้อมูลสำเร็จ!');
      navigate("/admindashboard/managematchresult");
    } catch (error) {
      console.error("Error updating match:", error);
      alert('เกิดข้อผิดพลาดในการอัพเดทข้อมูล!');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={thLocale}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}>
          แก้ไขข้อมูลผลการแข่งขัน
        </Typography>
        
        {selectedSport && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, mb: 3 }}>
            {sports.find(s => s.value === selectedSport)?.icon}
          </Box>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* กลุ่มที่ 1: เลือกกีฬาและประเภทกีฬา */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
              ข้อมูลกีฬา
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
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
          </Paper>
          
          {/* กลุ่มที่ 2: ข้อมูลทีม1 */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
              ข้อมูลทีม1
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>เลือกทีมแรก</InputLabel>
                  <Select name="team1" value={formData.team1} onChange={handleInputChange}>
                    <MenuItem value=""><em>กรุณาเลือกทีมแรก</em></MenuItem>
                    {departments.map(dep => (
                      <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>ประเภททีมที่ 1</InputLabel>
                  <Select name="typeteam1" value={formData.typeteam1} onChange={handleInputChange}>
                    <MenuItem value=""><em>กรุณาเลือกประเภททีม</em></MenuItem>
                    {teamTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="team1score"
                  label="คะแนนทีมที่ 1"
                  value={formData.team1score}
                  onChange={handleInputChange}
                  type="number"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* กลุ่มที่ 3: ข้อมูลทีม2 */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
              ข้อมูลทีม2
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>เลือกทีมสอง</InputLabel>
                  <Select name="team2" value={formData.team2} onChange={handleInputChange}>
                    <MenuItem value=""><em>กรุณาเลือกทีมสอง</em></MenuItem>
                    {departments.map(dep => (
                      <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>ประเภททีมที่ 2</InputLabel>
                  <Select name="typeteam2" value={formData.typeteam2} onChange={handleInputChange}>
                    <MenuItem value=""><em>กรุณาเลือกประเภททีม</em></MenuItem>
                    {teamTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="team2score"
                  label="คะแนนทีมที่ 2"
                  value={formData.team2score}
                  onChange={handleInputChange}
                  type="number"
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* กลุ่มที่ 4: ผลการแข่งขัน */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
              ผลการแข่งขัน
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>รอบการแข่งขัน</InputLabel>
                  <Select 
                    name="winner" 
                    value={formData.winner} 
                    onChange={handleInputChange}
                  >
                    <MenuItem value=""><em>กรุณาเลือกรอบการแข่งขัน</em></MenuItem>
                    {rounds.map(round => (
                      <MenuItem key={round.value} value={round.label}>{round.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* วันที่การแข่งขัน */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  id="match_date"
                  name="match_date"
                  label="วันที่แข่งขัน"
                  type="date"
                  value={formData.match_date}
                  onChange={handleDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              {/* เวลาการแข่งขัน - ใช้ TimePicker */}
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="เวลาแข่งขัน"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  ampm={false} // แสดงเป็นรูปแบบ 24 ชั่วโมง
                  views={['hours', 'minutes']}
                  minutesStep={5}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: "ระบุเวลาแข่งขัน"
                    }
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Paper>
          
          {/* กลุ่มที่ 5: เหรียญรางวัล */}
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1, mb: 2 }}>
              ข้อมูลเหรียญรางวัล
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>วิทยาเขตที่ได้รับเหรียญ</InputLabel>
                  <Select 
                    value={medalData.department} 
                    onChange={handleDepartmentMedalChange}
                  >
                    <MenuItem value=""><em>กรุณาเลือกวิทยาเขต</em></MenuItem>
                    {departments.map(dep => (
                      <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>ประเภทเหรียญรางวัล</InputLabel>
                  <Select 
                    value={selectedMedal} 
                    onChange={handleMedalChange}
                  >
                    {medalTypes.map(type => (
                      <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
          
          {/* ปุ่มบันทึก */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="secondary" 
              fullWidth 
              sx={{ py: 1.5, fontSize: '1.1rem' }}
            >
              อัพเดทผลการแข่งขัน
            </Button>
          </Box>
        </form>
      </Container>
    </LocalizationProvider>
  );
};

export default Updatematchresult;