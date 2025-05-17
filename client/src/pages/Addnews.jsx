import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete,TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Container, Grid, Card, CardContent } from '@mui/material';
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

const Addnews = () => {
  const [formData, setFormData] = useState({
    title:"",
    description:"",

    status: 'ได้เข้าร่วมงานพุทธรักษาเกมส์',

  });

  const [profileImage, setProfileImage] = useState(null);

  const [departments, setDepartments] = useState([]);
   const [prefix, setPrefix] = useState("");
  const [customPrefix, setCustomPrefix] = useState("");
  const [postiondirector, setPositionDirector] = useState([]);
  
  const prefixes = ["นาย", "นาง", "นางสาว", "อื่นๆ"];

  const [selectedSport, setSelectedSport] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
 

      
  
    if (selectedSport) {
      setFormData(prev => ({ ...prev, sport_type: selectedSport }));
      // axios.get(`http://localhost:5000/api/sports/category/${selectedSport}`)
      //   .then(response => setCategories(response.data))
      //   .catch(() => setCategories([]));
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

  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileImage) {
      alert('กรุณาอัพโหลดรูปโปรไฟล์');
      return;
    }



    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('profile_image', profileImage);

    try {
      const response = await axios.post('http://localhost:5000/api/news/addplayer', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data); // Log the response for debugging
      alert('ลงทะเบียนสำเร็จ!');
      setFormData({
       title:"",
       description:""
      });
      setProfileImage(null);

      setSelectedSport('');
    } catch (error) {
      console.error(error); // Log any error for debugging
      alert('เกิดข้อผิดพลาดในการลงทะเบียน!');
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>

      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}>แบบฟอร์มลงทะเบียนกรรมการ</Typography>
      {selectedSport && (
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, mb: 3 }}>
          {sports.find(s => s.value === selectedSport)?.icon}
          <Typography variant="h6" sx={{ ml: 1 }}>

          </Typography>
        </Grid>
      )}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
       
          
        

       
   
<Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    name="title"
    label="ชื่อเรื่อง"
    value={formData.title}
    onChange={handleInputChange}
    required
  />
</Grid>

<Grid item xs={12}>
  <TextField
    fullWidth
    name="description"
    label="รายละเอียด"
    value={formData.description}
    onChange={handleInputChange}
    required
    multiline
    rows={10} // ปรับให้สูงขึ้น
    variant="outlined"
  />
</Grid>

      
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
        
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 3 }}>ลงทะเบียน</Button>
          </Grid>
        </Grid>
      </form>

    </Container>
  );
};

export default Addnews;