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
  Card, 
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
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

const Addmedalsportwithdirector = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gold: '',
    silver: '',
    bronze: '',
    department: '',
  });
  
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedSport, setSelectedSport] = useState('');

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

  useEffect(() => {
    // Fetch departments when component mounts
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/department/");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("ไม่สามารถโหลดข้อมูลวิทยาเขตได้ กรุณาลองใหม่อีกครั้ง");
      }
    };

    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/medal/addresult', formData);
      setSuccess(true);
      setFormData({
        gold: '',
        silver: '',
        bronze: '',
        department: '',
      });
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate("/directordashboard/manage/medal");
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}>
            เพิ่มเหรียญกีฬา
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>ลงทะเบียนสำเร็จ!</Alert>
          )}

          {selectedSport && (
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              {sports.find(s => s.value === selectedSport)?.icon}
            </Grid>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>วิทยาเขต</InputLabel>
                  <Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <MenuItem value=""><em>กรุณาเลือกวิทยาเขต</em></MenuItem>
                    {departments.map(dep => (
                      <MenuItem key={dep.id} value={dep.name}>{dep.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="gold"
                  label="จำนวนเหรียญทอง"
                  type="number"
                  value={formData.gold}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="silver"
                  label="จำนวนเหรียญเงิน"
                  type="number"
                  value={formData.silver}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  name="bronze"
                  label="จำนวนเหรียญทองแดง"
                  type="number"
                  value={formData.bronze}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  onClick={handleCancel}
                  variant="outlined" 
                  color="primary" 
                  sx={{ width: '45%' }}
                  disabled={loading}
                >
                  ยกเลิก
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="secondary" 
                  sx={{ width: '45%' }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'ลงทะเบียน'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Addmedalsportwithdirector;