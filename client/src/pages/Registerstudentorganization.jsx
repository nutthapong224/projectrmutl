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

const Registerstudentorganization = () => {
  const [formData, setFormData] = useState({
    title: '',
    fname: '',
    lname: '',
    student_id: '',
    phone_number: '',
    department: '',
    faculty: '',
    major: '',
    status: 'ได้เข้าร่วมการแข่งขัน',
    position: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [prefix, setPrefix] = useState("");
  const [customPrefix, setCustomPrefix] = useState("");

  const organizations = [
    { value: 'สโมสรนักศึกษา', label: 'สโมสรนักศึกษา' },
    { value: 'องค์การนักศึกษา', label: 'องค์การนักศึกษา' },
  ];
  
  const prefixes = ["นาย", "นาง", "นางสาว", "อื่นๆ"];

  const [selectedOrganization, setSelectedOrganization] = useState('');

  useEffect(() => {
    // Fetch departments data
    axios.get("http://localhost:5000/api/department/")
      .then(response => {
        setDepartments(response.data);
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });
  
    // Update position in formData when selectedOrganization changes
    if (selectedOrganization) {
      setFormData(prev => ({ ...prev, position: selectedOrganization }));
    }
  
    // Update title in formData when prefix or customPrefix changes
    setFormData(prev => ({
      ...prev,
      title: prefix === "อื่นๆ" ? customPrefix : prefix,
    }));
  
  }, [selectedOrganization, prefix, customPrefix]);
  

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
      const response = await axios.post('http://localhost:5000/api/studentorgranization/addpending', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data);
      alert('ลงทะเบียนสำเร็จ!');
      // Reset form data
      setFormData({
        title: '',
        fname: '',
        lname: '',
        student_id: '',
        phone_number: '',
        department: '',
        faculty: '',
        major: '',
        status: 'ได้เข้าร่วมการแข่งขัน',
        position: '',
      });
      setProfileImage(null);
      setDocumentFile(null);
      setSelectedOrganization('');
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
        แบบฟอร์มลงทะเบียนผู้ประสานงาน
      </Typography>
      
      <form onSubmit={handleSubmit}>
        {/* ส่วนที่ 1: เลือกประเภทผู้ประสานงาน */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#333' }}>
            เลือกประเภทผู้ประสานงาน
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>เลือกประเภทผู้ประสานงาน</InputLabel>
                <Select 
                  name="position" 
                  value={selectedOrganization} 
                  onChange={(e) => setSelectedOrganization(e.target.value)}
                >
                  <MenuItem value=""><em>ประเภทผู้ประสานงาน</em></MenuItem>
                  {organizations.map(org => (
                    <MenuItem key={org.value} value={org.value}>{org.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
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
        <Button 
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

export default Registerstudentorganization;