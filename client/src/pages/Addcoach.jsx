import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Paper,
  Autocomplete,
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography, 
  Container, 
  Grid
} from '@mui/material';
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

const Registercoach = () => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    phone_number: '',
    sport_type: '',
    department: '',
    faculty: '',
    major: '',
    position: '',
    title: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [prefix, setPrefix] = useState("");
  const [customPrefix, setCustomPrefix] = useState("");
  const [postiondirector, setPositionDirector] = useState([]);
  
  const sports = [
    { value: 'ฟุตบอล', label: 'ฟุตบอล', icon: <img src={Football} alt="football" width="200" /> },
    { value: 'ฟุตซอล', label: 'ฟุตซอล', icon: <img src={Futsal} alt="futsal" width="200" /> },
    { value: 'บาสเก็ตบอล', label: 'บาสเก็ตบอล', icon: <img src={Basketball} alt="basketball" width="200" /> },
    { value: 'แบดมินตัน', label: 'แบดมินตัน', icon: <img src={Badminton} alt="badminton" width="200" /> },
    { value: 'เทเบิลเทนิส', label: 'เทเบิลเทนิส', icon: <img src={Tabletenis} alt="tabletennis" width="200" /> },
    { value: 'เซปักตะกร้อ', label: 'เซปักตะกร้อ', icon: <img src={Takraw} alt="takraw" width="200" /> },
    { value: 'วอลเลย์บอล', label: 'วอลเลย์บอล', icon: <img src={Volleyball} alt="volleyball" width="200" /> },
    { value: 'ตะกร้อลอดห่วง', label: 'ตะกร้อลอดห่วง', icon: <img src={Hooptakraw} alt="hooptakraw" width="200" /> },
    { value: 'e-sport', label: 'e-sport', icon: <img src={Esport} alt="esport" width="200" /> },
    { value: 'เปตอง', label: 'เปตอง', icon: <img src={Petanque} alt="petanque" width="200" /> },
  ];
  
  const prefixes = ["นาย", "นาง", "นางสาว", "อื่นๆ"];

  const [selectedSport, setSelectedSport] = useState('');

  useEffect(() => {
    // Fetch departments data
    axios.get("http://localhost:5000/api/department/")
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });
    
    // Fetch coach positions data  
    axios.get("http://localhost:5000/api/positioncoach")
      .then(response => {
        setPositionDirector(response.data);
      })
      .catch(error => {
        console.error("Error fetching positions:", error);
      });

    // Update sport_type in formData when selectedSport changes
    if (selectedSport) {
      setFormData(prev => ({ ...prev, sport_type: selectedSport }));
    }
  
    // Update title in formData when prefix or customPrefix changes
    setFormData(prev => ({
      ...prev,
      title: prefix === "อื่นๆ" ? customPrefix : prefix,
    }));
  
  }, [selectedSport, prefix, customPrefix]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      const response = await axios.post('http://localhost:5000/api/coach/addplayer', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data);
      alert('ลงทะเบียนสำเร็จ!');
      // Reset form data
      setFormData({
        fname: '',
        lname: '',
        phone_number: '',
        sport_type: '',
        department: '',
        faculty: '',
        major: '',
        position: '',
        title: '',
      });
      setProfileImage(null);
      setDocumentFile(null);
      setSelectedSport('');
      setPrefix("");
      setCustomPrefix("");
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการลงทะเบียน!');
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}>
        เพิ่มข้อมูลผู้คุมทีม
      </Typography>
      
      {selectedSport && (
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, mb: 3 }}>
          {sports.find(s => s.value === selectedSport)?.icon}
        </Grid>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* ส่วนที่ 1: เลือกประเภทกีฬา */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#333' }}>
            เลือกประเภทกีฬาที่จะคุมทีม
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>เลือกกีฬาที่คุมการแข่งขัน</InputLabel>
                <Select 
                  name="sport_type" 
                  value={selectedSport} 
                  onChange={(e) => setSelectedSport(e.target.value)}
                >
                  <MenuItem value=""><em>เลือกกีฬาที่คุมการแข่งขัน</em></MenuItem>
                  {sports.map(sport => (
                    <MenuItem key={sport.value} value={sport.value}>{sport.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        {/* ส่วนที่ 2: ข้อมูลส่วนตัว */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#333' }}>
            กรอกข้อมูลส่วนตัว
          </Typography>
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
                <Select 
                  name="department" 
                  value={formData.department} 
                  onChange={handleInputChange}
                >
                  <MenuItem value=""><em>กรุณาเลือกวิทยาเขต</em></MenuItem>
                  {departments.map(dep => (
                    <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>เลือกตำแหน่งการทำงาน</InputLabel>
                <Select 
                  name="position" 
                  value={formData.position} 
                  onChange={handleInputChange}
                >
                  <MenuItem value=""><em>กรุณาเลือกตำแหน่งการทำงาน</em></MenuItem>
                  {postiondirector.map(dep => (
                    <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        {/* ส่วนที่ 3: อัพโหลดไฟล์ */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#333' }}>
            อัพโหลดไฟล์
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ backgroundColor: '#f5f5f5', color: '#333', p: 1.5 }}
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
                <Typography sx={{ mt: 1 }}>{profileImage.name}</Typography>
              )}
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ backgroundColor: '#f5f5f5', color: '#333', p: 1.5 }}
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
                <Typography sx={{ mt: 1 }}>{documentFile.name}</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
        
        {/* ปุ่มลงทะเบียน */}
        <Button s
          type="submit" 
          variant="contained" 
          color="secondary" 
          fullWidth 
          sx={{ mt: 3, p: 1.5, fontSize: '1.1rem' }}
        >
          ลงทะเบียน
        </Button>
      </form>
    </Container>
  );
};

export default Registercoach;