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

const BadmintonForm = () => {
  const [formData, setFormData] = useState({
    prefix: "",
    fname: "",
    lname: "",
    student_id: "",
    department: "",
    faculty: "",
    major: "",
    phone_number: "",
    sport_type: [],
    profile_image: null,
    document: null,
  });

  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/department");
        setDepartments(response.data);
        // navigate("/searchbasketball"); // Navigate to /searchbadminton on success
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
        ? [...prevData.sport_type, name]
        : prevData.sport_type.filter((sport) => sport !== name);

      return {
        ...prevData,
        sport_type: updatedSportType,
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
      const response = await axios.post("http://localhost:5000/api/basketball/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data.message);
    } catch (err) {
      console.error(err);
      alert("Error adding user");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        แบบฟอร์มลงทะเบียนกีฬาบาสเกตบอล
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
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="นามสกุล"
              name="lname"
              value={formData.lname}
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
                  checked={formData.sport_type.includes("บาสเกตบอล ชาย")}
                  onChange={handleCheckboxChange}
                  name="บาสเกตบอล ชาย"
                  color="primary"
                />
              }
              label="บาสเกตบอล ชาย"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.sport_type.includes("บาสเกตบอล หญิง")}
                  onChange={handleCheckboxChange}
                  name="บาสเกตบอล หญิง"
                  color="primary"
                />
              }
              label="บาสเกตบอล หญิง"
            />
           
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body1">รูปนักศึกษา:</Typography>
            <input
              type="file"
              name="profile_image"
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">เอกสารยืนยัน (PDF):</Typography>
            <input
              type="file"
              name="document"
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

export default BadmintonForm;
