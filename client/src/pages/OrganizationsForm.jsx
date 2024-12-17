import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Box,
  Container,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const OrganizationForm = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    prefix: "",
    first_name: "",
    last_name: "",
    faculty: "",
    department: "",
    position: [],
    phone_number: "",
    join_year: "",
    photo_url: null,
    id_proof_url: null,
  });

  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/department");
        setDepartments(response.data);
    
      } catch (err) {
        console.error("ส่งข้อมูลผิดพลาด", err);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => {
      const updatedSportType = checked
        ? [...prevData.position, name]
        : prevData.position.filter((sport) => sport !== name);

      return {
        ...prevData,
        position: updatedSportType,
      };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
  
    for (const key in formData) {
      data.append(key, formData[key]);
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/studentorgranization/add",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
      navigate("/searchstudentorganization"); // Navigate on success
    } catch (err) {
      console.error(err);
      alert("Error adding user");
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        แบบฟอร์มลงทะเบียนองค์การนักศึกษา
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="คำนำหน้า"
              name="prefix"
              value={formData.prefix}
              onChange={handleChange}
              required
            >
              <MenuItem value="นาย">นาย</MenuItem>
              <MenuItem value="นาง">นาง</MenuItem>
              <MenuItem value="นางสาว">นางสาว</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ชื่อ"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="นามสกุล"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="รหัสนักศึกษา"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ปีที่เคยเข้าร่วม"
              name="join_year"
              value={formData.join_year}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="วิทยาเขค"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.name}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="คณะ"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="สาขา"
              name="major"
              value={formData.major}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="เบอร์โทรศัพท์"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Checkbox สำหรับเลือกประเภทกีฬาแบตมินตัน */}
          <Grid item xs={12}>
            <Typography variant="body1">ประเภทกีฬาแบตมินตัน:</Typography>  
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.position.includes("สโมสรนักศึกษา")}
                  onChange={handleCheckboxChange}
                  name="สโมสรนักศึกษา"
                  color="primary"
                />
              }
              label="สโมสรนักศึกษา"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.position.includes("สภานักศึกษา")}
                  onChange={handleCheckboxChange}
                  name="สภานักศึกษา"
                  color="primary"
                />
              }
              label="สภานักศึกษา"
            />
           
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">รูปนักศึกษา:</Typography>
            <input
              type="file"
              name="photo_url"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">เอกสารยืนยัน (PDF):</Typography>
            <input
              type="file"
              name="id_proof_url"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="center">
              <Button type="submit" variant="contained" color="primary">
                ส่งข้อมูล
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default  OrganizationForm;
