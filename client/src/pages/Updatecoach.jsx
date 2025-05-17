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

const Updatedirector = () => {
  const { id } = useParams(); // Getting the 'id' from the URL parameters
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    phone_number: '',
    sport_type: '',
    department: '',
    faculty: '',
    major: '',
    position: '',
    title: ''
  });

  const [profileImage, setProfileImage] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [prefix, setPrefix] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [postiondirector, setPositionDirector] = useState([]);

  const sports = [
    { value: "ฟุตบอล", label: "ฟุตบอล" },
    { value: "ฟุตซอล", label: "ฟุตซอล" },
    { value: "บาสเก็ตบอล", label: "บาสเก็ตบอล" },
    { value: "แบดมินตัน", label: "แบดมินตัน" },
    { value: "เทเบิลเทนิส", label: "เทเบิลเทนิส" },
    { value: "เซปักตะกร้อ", label: "เซปักตะกร้อ" },
    { value: "วอลเลย์บอล", label: "วอลเลย์บอล" },
    { value: "ตะกร้อลอดห่วง", label: "ตะกร้อลอดห่วง" },
    { value: "e-sport", label: "e-sport" },
    { value: "เปตอง", label: "เปตอง" },
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

    // Fetch position data
    axios.get("http://localhost:5000/api/positioncoach")
      .then(response => {
        setPositionDirector(response.data);
      })
      .catch(error => {
        console.error("Error fetching positions:", error);
      });

    // Fetch player data by ID - Only once when component mounts
    if (id) {
      axios.get(`http://localhost:5000/api/coach/player/${id}`)
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
            fname: playerData.fname,
            lname: playerData.lname,
            phone_number: playerData.phone_number,
            sport_type: playerData.sport_type,
            department: playerData.department,
            faculty: playerData.faculty,
            major: playerData.major,
            position: playerData.position,
            title: playerData.title,
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
    }));
  }, [prefix, customPrefix]);

  // Effect for updating sport_type when selectedSport changes
  useEffect(() => {
    if (selectedSport) {
      setFormData(prev => ({
        ...prev,
        sport_type: selectedSport
      }));
    }
  }, [selectedSport]);

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
      const response = await axios.put(`http://localhost:5000/api/coach/update-registration/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("Server response:", response.data);
      alert('อัพเดทข้อมูลสำเร็จ!');
      navigate("/admindashboard/manage/coach");
    } catch (error) {
      console.error("Error updating player:", error);
      alert('เกิดข้อผิดพลาดในการอัพเดทข้อมูล!');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}>
        อัพเดทข้อมูลผู้คุมทีม
      </Typography>
      
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
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    console.log("Sport selected:", selectedValue);
                    setSelectedSport(selectedValue);
                  }}
                >
                  <MenuItem value=""><em>เลือกกีฬาที่คุมการแข่งขัน</em></MenuItem>
                  {sports.map(sport => (
                    <MenuItem key={sport.value} value={sport.value}>{sport.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>เลือกตำแหน่งผู้คุมทีม</InputLabel>
                <Select 
                  name="position" 
                  value={formData.position} 
                  onChange={handleInputChange}
                >
                  <MenuItem value=""><em>กรุณาเลือกตำแหน่งผู้คุมทีม</em></MenuItem>
                  {postiondirector.map(dep => (
                    <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
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
              {profileImage && typeof profileImage === 'object' && (
                <Typography sx={{ mt: 1 }}>{profileImage.name}</Typography>
              )}
              {profileImage && typeof profileImage === 'string' && (
                <Typography sx={{ mt: 1 }}>มีรูปโปรไฟล์อยู่แล้ว</Typography>
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
              {documentFile && typeof documentFile === 'object' && (
                <Typography sx={{ mt: 1 }}>{documentFile.name}</Typography>
              )}
              {documentFile && typeof documentFile === 'string' && (
                <Typography sx={{ mt: 1 }}>มีเอกสารอยู่แล้ว</Typography>
              )}
            </Grid>
          </Grid>
        </Paper>
        
        {/* ปุ่มอัพเดท */}
        <Button
          type="submit" 
          variant="contained" 
          color="secondary" 
          fullWidth 
          sx={{ mt: 3, p: 1.5, fontSize: '1.1rem' }}
        >
          อัพเดทข้อมูลผู้คุมทีม
        </Button>
      </form>
    </Container>
  );
};

export default Updatedirector;