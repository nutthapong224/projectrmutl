import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Autocomplete, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Paper,
  Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
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
import { useNavigate } from 'react-router-dom';
import thLocale from 'date-fns/locale/th';
import { format } from 'date-fns';

const Addresultsport = () => {
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
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [prefix, setPrefix] = useState("");
  const [customPrefix, setCustomPrefix] = useState("");

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
  
  const medalTypes = [
    { value: 'gold', label: 'เหรียญทอง' },
    { value: 'silver', label: 'เหรียญเงิน' },
    { value: 'bronze', label: 'เหรียญทองแดง' },
    { value: 'none', label: 'ไม่มีเหรียญ' }
  ];
  
  const rounds = [
    { value: 'สายA', label: 'สายA' },
    { value: 'สายฺB', label: 'สายฺB' },
    { value: 'รอบก่อนรองชนะเลิศ', label: 'รอบก่อนรองชนะเลิศ' },
    { value: 'รอบรองชนะเลิศ', label: 'รอบรองชนะเลิศ' },
    { value: 'รอบชิงชนะเลิศ', label: 'รอบชิงชนะเลิศ' }
  ];

  const [selectedSport, setSelectedSport] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedMedal, setSelectedMedal] = useState('none');

  useEffect(() => {
    // ดึงข้อมูลแผนก/วิทยาเขต
    axios.get("http://localhost:5000/api/department/")
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });
  
    // ดึงข้อมูลประเภทกีฬาเมื่อเลือกกีฬา
    if (selectedSport) {
      setFormData(prev => ({ ...prev, sport_table: selectedSport }));
      axios.get(`http://localhost:5000/api/sports/category/${selectedSport}`)
        .then(response => setCategories(response.data))
        .catch(() => setCategories([]));
    } else {
      setCategories([]);
    }
  
    // อัปเดตค่า title ใน formData ทุกครั้งที่ prefix หรือ customPrefix เปลี่ยน
    setFormData(prev => ({
      ...prev,
      title: prefix === "อื่นๆ" ? customPrefix : prefix,
    }));
  
  }, [selectedSport, prefix, customPrefix]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle time change from TimePicker
  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
    if (newTime) {
      // Format time as HH:MM for storing in formData
      const timeString = format(newTime, 'HH:mm');
      setFormData(prev => ({ ...prev, match_time: timeString }));
    } else {
      setFormData(prev => ({ ...prev, match_time: '' }));
    }
  };

  const handleDateChange = (e) => {
    // ตรวจสอบให้แน่ใจว่ามีการจัดรูปแบบวันที่ก่อนที่จะเก็บในฟอร์ม
    const dateValue = e.target.value;
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
    console.log("Form Data:", formData); // Debugging log
  
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
  
    if (selectedMedal !== 'none' && !medalData.department) {
      alert("กรุณาเลือกวิทยาเขตก่อนบันทึกเหรียญรางวัล");
      return;
    }
  
    try {
      // บันทึกข้อมูลแมทช์
      const matchResponse = await axios.post('http://localhost:5000/api/matches/addresult', formData);
      
      // บันทึกข้อมูลเหรียญรางวัล (ถ้ามีการเลือกเหรียญ)
      if (selectedMedal !== 'none') {
        // ใช้ API incrementmedal แทน adduser เพื่อเพิ่มจำนวนเหรียญแบบ +1
        const medalResponse = await axios.put('http://localhost:5000/api/medal/incrementmedal', {
          department: medalData.department,
          medalType: selectedMedal // ส่งเฉพาะชื่อวิทยาเขตและประเภทเหรียญที่ต้องการเพิ่ม
        });
        console.log("Medal response:", medalResponse.data);
      }
      
      alert('ลงทะเบียนสำเร็จ!');
      
      // รีเซ็ตฟอร์ม
      setFormData({
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
      
      setMedalData({
        department: '',
        gold: 0,
        silver: 0,
        bronze: 0
      });
      
      setSelectedMedal('none');
      setSelectedTime(null);
      navigate("/admindashboard/managematchresult")
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน!');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={thLocale}>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}>
          เพิ่มข้อมูลผลการแข่งขัน
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
          
          {/* กลุ่มที่ 2: ข้อมูลทีม */}
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
                <FormControl fullWidth >
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
          
          {/* กลุ่มที่ 3: ประเภททีม */}
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
                <FormControl fullWidth >
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
          
          {/* กลุ่มที่ 4: คะแนนและรอบการแข่งขัน */}
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
              บันทึกผลการแข่งขัน
            </Button>
          </Box>
        </form>
      </Container>
    </LocalizationProvider>
  );
};

export default Addresultsport;