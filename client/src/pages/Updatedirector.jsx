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
import { useNavigate, useParams } from 'react-router-dom';
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

const EnhancedUpdatedirector = () => {
  const { id } = useParams(); // Getting the 'id' from the URL parameters
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    fname: '',
    lname: '',
    phone_number: '',
    sport_type: '',
    position: '',
    department: '',
    status: 'ได้เข้าร่วมการแข่งขัน',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [prefix, setPrefix] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [postiondirector, setPositionDirector] = useState([]);

  const sports = [
    { value: 'ฟุตบอล', label: 'ฟุตบอล', icon: <img src={Football} alt="football" width="200" /> },
    { value: 'ฟุตซอล', label: 'ฟุตซอล', icon: <img src={Futsal} alt="football" width="200" /> },
    { value: 'บาสเก็ตบอล', label: 'บาสเก็ตบอล', icon: <img src={Basketball} alt="football" width="200" /> },
    { value: 'แบดมินตัน', label: 'แบดมินตัน', icon: <img src={Badminton} alt="football" width="200" /> },
    { value: 'เทเบิลเทนิส', label: 'เทเบิลเทนิส', icon: <img src={Tabletenis} alt="football" width="200" /> },
    { value: 'เซปักตะกร้อ', label: 'เซปักตะกร้อ', icon: <img src={Takraw} alt="football" width="200" /> },
    { value: 'วอลเลย์บอล', label: 'วอลเลย์บอล', icon: <img src={Volleyball} alt="football" width="200" /> },
    { value: 'ตะกร้อลอดห่วง', label: 'ตะกร้อลอดห่วง', icon: <img src={Hooptakraw} alt="football" width="200" /> },
    { value: 'e-sport', label: 'e-sport', icon: <img src={Esport} alt="football" width="200" /> },
    { value: 'เปตอง', label: 'เปตอง', icon: <img src={Petanque} alt="football" width="200" /> },
  ];

  const prefixes = ["นาย", "นาง", "นางสาว", "อื่นๆ"];

  // Initial data fetch: departments and player data
  useEffect(() => {
    // Fetch departments
    axios.get("http://localhost:5000/api/department/")
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });

    // Fetch position director data
    axios.get("http://localhost:5000/api/positiondirector")
      .then(response => {
        setPositionDirector(response.data);
      })
      .catch(error => {
        console.error("Error fetching position directors:", error);
      });

    // Fetch player data by ID - Only once when component mounts
    if (id) {
      axios.get(`http://localhost:5000/api/director/player/${id}`)
        .then(response => {
          const playerData = response.data;
          console.log("Fetched player data:", playerData); // Debug fetched data
          
          // Set prefix based on title
          const playerPrefix = playerData.title;
          if (prefixes.includes(playerPrefix)) {
            setPrefix(playerPrefix);
          } else {
            setPrefix("อื่นๆ");
            setCustomPrefix(playerPrefix);
          }
          
          // Set selectedSport directly
          setSelectedSport(playerData.sport_type);
          
          // Set form data fields
          setFormData({
            title: playerData.title,
            fname: playerData.fname,
            lname: playerData.lname,
            phone_number: playerData.phone_number,
            department: playerData.department,
            status: playerData.status,
            sport_type: playerData.sport_type,
            position: playerData.position,
          });
          
          // Set profile image and document file
          setProfileImage(playerData.profile_image);
          setDocumentFile(playerData.document);
        })
        .catch(error => {
          console.error("Error fetching player data:", error);
        });
    }
  }, [id]); // Only depend on ID

  // Effect for updating title when prefix changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      title: prefix === "อื่นๆ" ? customPrefix : prefix,
      sport_type: selectedSport || prev.sport_type,
    }));
  }, [prefix, customPrefix, selectedSport]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug log to see what's being submitted
    console.log("Form being submitted with data:", formData);
    console.log("Selected sport at submission time:", selectedSport);

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
      console.log(`Appending ${key}: ${formData[key]}`);
      data.append(key, formData[key]);
    });
    
    data.append('profile_image', profileImage);
    data.append('document', documentFile);

    try {
      const response = await axios.put(`http://localhost:5000/api/director/update-registration/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("Server response:", response.data);
      alert('อัพเดทข้อมูลสำเร็จ!');
      navigate("/admindashboard/manage/director");
    } catch (error) {
      console.error("Error updating player:", error);
      alert('เกิดข้อผิดพลาดในการอัพเดทข้อมูล!');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}>อัพเดทข้อมูลกรรมการ</Typography>
      
      {selectedSport && (
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, mb: 3 }}>
          {sports.find(s => s.value === selectedSport)?.icon}
          <Typography variant="h6" sx={{ ml: 1 }}></Typography>
        </Grid>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* ส่วนที่ 1: เลือกประเภทกีฬา */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#333' }}>เลือกประเภทกีฬา</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>เลือกกีฬาที่คุมการแข่งขัน</InputLabel>
                <Select 
                  name="sport_type"
                  value={selectedSport}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    console.log("Sport selected:", selectedValue); // Debug
                    setSelectedSport(selectedValue);
                    setFormData(prev => ({
                      ...prev,
                      sport_type: selectedValue
                    }));
                  }}
                >
                  <MenuItem value=""><em>เลือกกีฬาที่คุมการแข่งขัน</em></MenuItem>
                  {sports.map(sport => (
                    <MenuItem key={sport.value} value={sport.value}>{sport.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>เลือกตำแหน่งการทำงาน</InputLabel>
                <Select name="position" value={formData.position} onChange={handleInputChange}>
                  <MenuItem value=""><em>กรุณาเลือกตำแหน่งการทำงาน</em></MenuItem>
                  {postiondirector.map(dep => (
                    <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
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
              {profileImage && typeof profileImage === 'object' && <Typography sx={{ mt: 1 }}>{profileImage.name}</Typography>}
              {profileImage && typeof profileImage === 'string' && <Typography sx={{ mt: 1 }}>มีรูปโปรไฟล์อยู่แล้ว</Typography>}
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
              {documentFile && typeof documentFile === 'object' && <Typography sx={{ mt: 1 }}>{documentFile.name}</Typography>}
              {documentFile && typeof documentFile === 'string' && <Typography sx={{ mt: 1 }}>มีเอกสารอยู่แล้ว</Typography>}
            </Grid>
          </Grid>
        </Paper>

        {/* ปุ่มอัพเดทข้อมูล */}
        <Button 
          type="submit" 
          variant="contained" 
          color="secondary" 
          fullWidth 
          sx={{ mt: 3, p: 1.5, fontSize: '1.1rem' }}
        >
          อัพเดทข้อมูลกรรมการ
        </Button>
      </form>
    </Container>
  );
};

export default EnhancedUpdatedirector;