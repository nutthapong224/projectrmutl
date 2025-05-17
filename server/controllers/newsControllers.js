
const pool = require('../config/db'); // เชื่อมต่อฐานข้อมูล MySQL
const multer = require('multer');
const path = require('path');
const util = require("util");

const fs = require("fs");

const uploadsDir = path.join(__dirname, "../uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage to save files with unique names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp and random string, retaining the original file extension
    const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    const fileExtension = path.extname(file.originalname); // Get the file's extension
    const filename = `${uniqueSuffix}${fileExtension}`;
    cb(null, filename); // Set the unique filename
  },
});

// File filter to allow only specific file types (JPEG, PNG, PDF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."), false);
  }
};

// Multer setup for handling file uploads
exports.upload = multer({ storage, fileFilter });


exports.register = (req, res) => {
  const { fname, lname,  phone_number, sport_table, category_id, department, faculty, major } = req.body;

  if (!req.files || !req.files['profile_image'] || !req.files['document']) {
    return res.status(400).json({ error: 'กรุณาอัพโหลดรูปโปรไฟล์และเอกสาร' });
  }

  const profileImage = path.basename(req.files['profile_image'][0].path);
  const documentFile = path.basename(req.files['document'][0].path);

  const query = `INSERT INTO coach (fname, lname, phone_number, sport_table, category_id, department, faculty, major,  profile_image, document)
                   VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?)`;

  const values = [fname, lname,  phone_number, sport_table, category_id, department, faculty, major,  profileImage, documentFile];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }

    return res.status(200).json({ message: 'ลงทะเบียนสำเร็จ!', insertedId: results.insertId });
  });
};



exports.addnews = async (req, res) => {
  const {
  title,
  description,


  } = req.body;
  
  // ตรวจสอบว่ามีไฟล์ที่อัปโหลดหรือไม่ และดึงชื่อไฟล์
  const profile_image = req.files?.profile_image?.[0]?.filename || null;

  
  // กำหนดเส้นทางไฟล์ที่อัปโหลด
  const profileImagePath = profile_image ? `/uploads/${profile_image}` : null;

  
  // คำสั่ง SQL สำหรับเพิ่มข้อมูลลงในตาราง studentorganization
  const sql = `INSERT INTO news
  (title,description, profile_image, created_at) 
  VALUES (?,?,?,NOW())`;
  
  try {
    const [result] = await pool.query(sql, [

      title,
      description,
      profileImagePath,
     
   
    ]);

    res.status(201).send({
      message: "User added to pending successfully.",
      id: result.insertId,
      profile_image: profileImagePath

    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user to pending.");
  }
};

exports.getplayerbyid = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from request params

    let sql = "SELECT * FROM news WHERE id = ?"; // Fixed SQL query

    // Use promise-based query execution
    const [results] = await pool.query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Database Query Error:", error);
    res.status(500).json({ error: "Database query failed" });
  }
};





exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM news WHERE registration_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Pending user not found.");
    }

    res.status(200).send({ message: "User delete successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error delete user.");
  }
};




exports.updateRegistration = async (req, res) => {
    try {
      const { id } = req.params;
      const { title,description } = req.body;
  
      // ตรวจสอบว่ามีไฟล์ที่อัปโหลดหรือไม่ และดึงชื่อไฟล์
      const profile_image = req.files?.profile_image?.[0]?.filename || null;
  
      // กำหนดเส้นทางไฟล์ที่อัปโหลด
      const profileImagePath = profile_image ? `/uploads/${profile_image}` : null;
  
      let query = `
        UPDATE news
        SET title = ?, description = ?
      `;
  
      let values = [ title,description];
  
      if (profile_image) {
        query += ", profile_image = ?";
        values.push(profileImagePath);
      }
  
      query += " WHERE id = ?";
      values.push(id);
  
      const [results] = await pool.query(query, values);
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "ไม่พบการลงทะเบียนที่มี ID นี้" });
      }
  
      return res.status(200).json({ message: "ข้อมูลการลงทะเบียนอัปเดตสำเร็จ" });
    } catch (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลการลงทะเบียน" });
    }
  };


  exports.getPendingUsers = async (req, res) => {
    try {
      const [results] = await pool.query('SELECT * FROM news');
      return res.status(200).json(results);
    } catch (err) {
      return res.status(500).json({ message: 'Database query failed', error: err });
    }
  };