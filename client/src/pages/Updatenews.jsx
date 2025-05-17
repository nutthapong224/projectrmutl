import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Autocomplete, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate, useParams } from 'react-router-dom';

const Updatenews = () => {
  const { id } = useParams(); // Getting the 'id' from the URL parameters
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: ''

  });

  const [profileImage, setProfileImage] = useState(null);

  const [departments, setDepartments] = useState([]);
  const [prefix, setPrefix] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [categories, setCategories] = useState([]);
  const [postiondirector, setPositionDirector] = useState([]);
  const sports = [
    { value: "ฟุตบอล", label: "ฟุตบอล" },
    { value: "ฟุตซอล", label: "ฟุตซอล" },
    { value: "บาสเก็ตบอล", label: "บาสเก็ตบอล" },
    { value: "บาสเก็ตบอล", label: "แบดมินตัน" },
    { value: "เทเบิลเทนิส", label: "เทเบิลเทนิส" },
    { value: "เซปักตะกร้อ", label: "เซปักตะกร้อ" },
    { value: "วอลเลย์บอล", label: "วอลเลย์บอล" },
    { value: "ตะกร้อลอดห่วง", label: "ตะกร้อลอดห่วง" },
    { value: "esport", label: "e-sport" },
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
    axios.get("http://localhost:5000/api/positiondirector")
      .then(response => {
        setPositionDirector(response.data);
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });

    // Fetch player data by ID - Only once when component mounts
    if (id) {
      axios.get(`http://localhost:5000/api/news/player/${id}`)
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
            description:playerData.description
          });

          // Set profile image and document file
          setProfileImage(playerData.profile_image);

        })
        .catch(error => {
          console.error("Error fetching player data:", error);
        });
    }
  }, [id]); // Only depend on ID, not selectedSport

  // Effect for fetching categories when selectedSport changes
  useEffect(() => {
    if (selectedSport) {
      console.log("Fetching categories for sport:", selectedSport);
      // Update formData with the new selectedSport
      setFormData(prev => {
        const updated = { ...prev, sport_type: selectedSport };
        console.log("Updated formData sport_table:", updated.sport_type);
        return updated;
      });

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
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug log to see what's being submitted
    console.log("Form being submitted with data:", formData);
    console.log("Selected sport at submission time:", selectedSport);

 
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      console.log(`Appending ${key}: ${formData[key]}`);
      data.append(key, formData[key]);
    });

    data.append('profile_image', profileImage);


    try {
      const response = await axios.put(`http://localhost:5000/api/news/update-registration/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log("Server response:", response.data);
      alert('อัพเดทข้อมูลสำเร็จ!');
      // navigate("/admindashboard/manage/news");
    } catch (error) {
      console.error("Error updating player:", error);
      alert('เกิดข้อผิดพลาดในการอัพเดทข้อมูล!');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}> อัพเดทข้อมูลนักกีฬา</Typography>
      {selectedSport && (
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2, mb: 3 }}>
          {sports.find(s => s.value === selectedSport)?.icon}
          <Typography variant="h6" sx={{ ml: 1 }}></Typography>
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
                    {profileImage && typeof profileImage === 'object' && <Typography sx={{ mt: 1 }}>{profileImage.name}</Typography>}
                    {profileImage && typeof profileImage === 'string' && <Typography sx={{ mt: 1 }}>มีรูปโปรไฟล์อยู่แล้ว</Typography>}
                  </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 3 }}>อัพดพข้อมูล</Button>
          </Grid>
        </Grid>
      </form>


    </Container>
  );
};

export default Updatenews;
