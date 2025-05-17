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
import { useParams, useNavigate } from 'react-router-dom';

const UpdateMedalComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gold: '',
    silver: '',
    bronze: '',
    department: ''
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch medal data and departments when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch medal data
        const medalResponse = await axios.get(`http://localhost:5000/api/medal/medal/${id}`);
        
        // Fetch departments
        const departmentsResponse = await axios.get("http://localhost:5000/api/department/");
        
        setFormData({
          gold: medalResponse.data.gold || '',
          silver: medalResponse.data.silver || '',
          bronze: medalResponse.data.bronze || '',
          department: medalResponse.data.department || ''
        });
        
        setDepartments(departmentsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load medal data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/medal//update-registration/${id}`, formData);
      setSuccess(true);
      
      // Navigate to medal management page after successful update
      navigate("/directordashboard/manage/medal");
    } catch (error) {
      console.error("Error updating medal:", error);
      setError("Failed to update medal data. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading && !formData.department) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 3, color: '#333' }}>
            แก้ไขข้อมูลเหรียญ
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>อัปเดตข้อมูลเหรียญสำเร็จ!</Alert>
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'อัปเดตข้อมูล'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UpdateMedalComponent;