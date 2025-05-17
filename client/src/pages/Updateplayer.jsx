import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import { Paper, Autocomplete, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Container, Grid, Card, CardContent } from '@mui/material';
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
import { useNavigate } from 'react-router-dom';

const Updateplayer = () => {
  // Get the id from URL parameters
  const { id } = useParams();
  
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
  const navigate = useNavigate();
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
    // Fetch departments
    axios.get("http://localhost:5000/api/department/")
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });

    // Fetch player data by ID - Only once when component mounts
    if (id) {
      axios.get(`http://localhost:5000/api/players/player/${id}`)
        .then(response => {
          const playerData = response.data;
   
          
          // Set prefix based on title
          const playerPrefix = playerData.title;
          if (prefixes.includes(playerPrefix)) {
            setPrefix(playerPrefix);
          } else {
            setPrefix("อื่นๆ");
            setCustomPrefix(playerPrefix);
          }
          
          // Set selectedSport directly
          setSelectedSport(playerData.sport_table);
          
          // Set form data fields
          setFormData({
            title: playerData.title,
            fname: playerData.fname,
            lname: playerData.lname,
            student_id: playerData.student_id,
            phone_number: playerData.phone_number,
            sport_table: playerData.sport_table, // Set sport_table directly from playerData
            category_id: playerData.category_id,
            department: playerData.department,
            faculty: playerData.faculty,
            major: playerData.major,
            status: playerData.status || 'ได้เข้าร่วมการแข่งขัน',
            typeteam: playerData.typeteam
          });
          
          // Set profile image and document file state values
          if (playerData.profile_image) {
            setProfileImage(playerData.profile_image);
          }
          
          if (playerData.document) {
            setDocumentFile(playerData.document);
          }
          
          // Also set selectedName state
          setSelectedName(playerData.typeteam || "");
        })
        .catch(error => {
          console.error("Error fetching player data:", error);
        });
    }
  }, [id]); // Only depend on ID

  // Effect for fetching categories when selectedSport changes
  useEffect(() => {
    if (selectedSport) {

      // Update formData with the new selectedSport
      setFormData(prev => {
        const updated = { ...prev, sport_table: selectedSport };

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

  // Effect for updating title when prefix changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      title: prefix === "อื่นๆ" ? customPrefix : prefix,
    }));
  }, [prefix, customPrefix]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedName(value);
    setFormData(prev => ({
      ...prev,
      typeteam: value,
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
    Object.keys(formData).forEach(key => {
 
      data.append(key, formData[key]);
    });
    
    data.append('profile_image', profileImage);
    data.append('document', documentFile);

    try {
      const response = await axios.put(`http://localhost:5000/api/players/update-registration/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // console.log("Server response:", response.data);
      alert('อัพเดทข้อมูลสำเร็จ!');
      navigate("/admindashboard/manage/player");
    } catch (error) {
      // console.error("Error updating player:", error);
      // alert('เกิดข้อผิดพลาดในการอัพเดทข้อมูล!');
    }
  };


  // Update page title based on whether this is an update or new registration
  const pageTitle = id ? 'อัพเดทข้อมูลนักกีฬา' : 'ลงทะเบียนนักกีฬา';
  const submitButtonText = id ? 'อัพเดทข้อมูล' : 'ลงทะเบียน';

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}>{pageTitle}</Typography>
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
    
            {/* ช่องกรอกคำนำหน้าเองถ้าเลือก "อื่นๆ" */}
            {prefix === "อื่นๆ" && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="กรอกคำนำหน้าของคุณ"
                  value={customPrefix}
                  onChange={(e) => setCustomPrefix(e.target.value)}
                  fullWidth
                  margin="normal"
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
              {profileImage && (
                <Typography sx={{ mt: 1 }}>
                  {typeof profileImage === 'string' 
                    ? 'รูปโปรไฟล์ที่อัพโหลดไว้แล้ว' 
                    : profileImage.name}
                </Typography>
              )}
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
              {documentFile && (
                <Typography sx={{ mt: 1 }}>
                  {typeof documentFile === 'string' 
                    ? 'เอกสารที่อัพโหลดไว้แล้ว' 
                    : documentFile.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
    
        {/* ปุ่มลงทะเบียน/อัพเดท */}
        <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 3, p: 1.5, fontSize: '1.1rem' }}>
          {submitButtonText}
        </Button>
      </form>
    </Container>
  );
};

export default Updateplayer;