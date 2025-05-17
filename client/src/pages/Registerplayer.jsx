import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper,Autocomplete,TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Football from "../assets/football.png"
import Badminton from "../assets/badminton.png"
import Tabletenis from "../assets/tabletenis.png"
import Futsal from "../assets/futsal.png"
import Basketball from "../assets/basketball.png"
import Takraw from "../assets/takraw.png"
import Hooptakraw from "../assets/hooptakraw.png"
import Volleyball from "../assets/volleyball.png"
import Esport from "../assets/esport.png"
import Petanque from "../assets/petanque.png"
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    title:'',
    fname: '',
    lname: '',
    student_id: '',
    phone_number: '',
    sport_table: '',
    category_id: '',
    department: '',
    faculty: '',
    major: '',
    status: 'ได้เข้าร่วมการแข่งขัน',
    typeteam:''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [departments, setDepartments] = useState([]);
   const [prefix, setPrefix] = useState("");
  const [customPrefix, setCustomPrefix] = useState("");
  const [selectedName, setSelectedName] = useState("");

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

  const names = [
   
    'ทีม A',
    'ทีม B',
   
   
  ];


  
  const prefixes = ["นาย", "นาง", "นางสาว", "อื่นๆ"];

  const [selectedSport, setSelectedSport] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/department/")
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });
  
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
  
  }, [selectedSport, prefix, customPrefix]); // ✅ รวม dependencies ไว้ในอันเดียว
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedName(value);
    setFormData(prev => ({
      ...prev,
      typeteam: value, // อัปเดตค่าใน formData
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileImage) {
      alert('กรุณาอัพโหลดรูปโปรไฟล์');
      return;
    }

    if (!documentFile) {
      alert('กรุณาอัพโหลดเอกสาร');
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('profile_image', profileImage);
    data.append('document', documentFile);

    try {
      const response = await axios.post('http://localhost:5000/api/sports/add', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data); // Log the response for debugging
      alert('ลงทะเบียนสำเร็จ!');
      setFormData({
        title:'',
        fname: '',
        lname: '',
        student_id: '',
        phone_number: '',
        sport_table: '',
        category_id: '',
        department: '',
        faculty: '',
        major: '',
        status: 'ได้เข้าร่วมการแข่งขัน',
        typeteam:''
      });
      setProfileImage(null);
      setDocumentFile(null);
      setSelectedSport('');
    } catch (error) {
      console.error(error); // Log any error for debugging
      alert('เกิดข้อผิดพลาดในการลงทะเบียน!');
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
    <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}>แบบฟอร์มลงทะเบียนนักกีฬา</Typography>
    <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3, color: 'red' }}>การเลือกประเภททีมถ้าไม่มีประเภททีม A B ไม่ต้องเลือกประเภท</Typography>
    {selectedSport && (
      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, mb: 3 }}>
        {sports.find(s => s.value === selectedSport)?.icon}
        <Typography variant="h6" sx={{ ml: 1 }}></Typography>
      </Grid>
    )}
    
    <form onSubmit={handleSubmit}>
      {/* ส่วนที่ 1: เลือกประเภทกีฬาและทีม */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#333' }}>เลือกประเภทกีฬาและทีม</Typography>
        <Grid container spacing={2}>
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
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>กรุณาเลือกประเภททีม</InputLabel>
              <Select name="typeteam" value={selectedName} onChange={handleChange} label="กรุณาเลือกประเภททีม">
                {names.map((name, index) => (
                  <MenuItem key={index} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
  
      {/* ส่วนที่ 2: กรอกข้อมูลส่วนตัว */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#333' }}>กรอกข้อมูลส่วนตัว</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <Autocomplete
                options={prefixes}
                value={prefix || null}
                onChange={(event, newValue) => {
                  setPrefix(newValue || "");
                  if (newValue !== "อื่นๆ") setCustomPrefix("");
                }}
                renderInput={(params) => <TextField {...params} label="คำนำหน้า" required />}
                disableClearable
                popupIcon={<ArrowDropDownIcon />}
              />
            </FormControl>
          </Grid>
  

               {prefix === "อื่นๆ" && (
                 <Grid item xs={12} sm={6}>
                   <TextField
                     label="กรอกคำนำหน้าของคุณ"
                     value={customPrefix}
                     onChange={(e) => setCustomPrefix(e.target.value)}
                     fullWidth
                     required
                   />
                 </Grid>
               )}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="fname"
              label="ชื่อ"
              value={formData.fname}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="lname"
              label="นามสกุล"
              value={formData.lname}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="student_id"
              label="รหัสนักศึกษา"
              value={formData.student_id}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="phone_number"
              label="เบอร์ศัพท์"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="faculty"
              label="คณะ"
              value={formData.faculty}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="major"
              label="สาขา"
              value={formData.major}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>เลือกวิทยาเขต</InputLabel>
              <Select name="department" value={formData.department} onChange={handleInputChange}>
                <MenuItem value=""><em>กรุณาเลือกวิทยาเขต</em></MenuItem>
                {departments.map(dep => (
                  <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
  
      {/* ส่วนที่ 3: อัพโหลดไฟล์ */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#333' }}>อัพโหลดไฟล์</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ backgroundColor: '#f5f5f5', color: '#333' }}
            >
              อัพโหลดรูปโปรไฟล์ (JPEG/PNG)
              <input
                type="file"
                hidden
                accept="image/jpeg, image/png"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
            </Button>
            {profileImage && <Typography sx={{ mt: 1 }}>{profileImage.name}</Typography>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ backgroundColor: '#f5f5f5', color: '#333' }}
            >
              อัพโหลดเอกสาร (PDF/JPEG/PNG)
              <input
                type="file"
                hidden
                accept="application/pdf, image/jpeg, image/png"
                onChange={(e) => setDocumentFile(e.target.files[0])}
              />
            </Button>
            {documentFile && <Typography sx={{ mt: 1 }}>{documentFile.name}</Typography>}
          </Grid>
        </Grid>
      </Paper>
  
      {/* ปุ่มลงทะเบียน */}
      <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 3, p: 1.5, fontSize: '1.1rem' }}>ลงทะเบียน</Button>
    </form>
  </Container>
  );
};

export default RegistrationForm;