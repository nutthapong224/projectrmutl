const db = require("../config/db");
const multer = require("multer");

// 📂 ตั้งค่า Multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
  destination: "../uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).fields([
  { name: "profile_image" }, 
  { name: "document" }
]);

// 📝 API ลงทะเบียน
exports.registerUser = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(500).json({ error: "File upload failed" });

    const {
      fname,
      lname,
      student_id,
      phone_number,
      sport_table,
      category_id,
      department,
      faculty,
      major,
      status,
      
    } = req.body;

    const profile_image = req.files["profile_image"] ? req.files["profile_image"][0].filename : null;
    const document = req.files["document"] ? req.files["document"][0].filename : null;

    const query = `
      INSERT INTO registrations 
      (fname, lname, student_id, phone_number, sport_table, category_id, department, faculty, major, profile_image, document, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, 
      [fname, lname, student_id, phone_number, sport_table, category_id, 
       department, faculty, major, profile_image, document, status], 
      (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "ลงทะเบียนสำเร็จ!", registration_id: result.insertId });
      }
    );
  });
};



const updateRegistration = (req, res) => {
  const { id } = req.params; // Get the ID from the URL parameter
  const { fname, lname, student_id, phone_number, sport_table, category_id, department, faculty, major, status } = req.body;

  // Initialize variables for profile image and document
  let profileImage = null;
  let documentFile = null;

  // If files are provided, update profile image and document
  if (req.files) {
    if (req.files['profile_image']) {
      profileImage = path.basename(req.files['profile_image'][0].path); // New profile image file
    }
    if (req.files['document']) {
      documentFile = path.basename(req.files['document'][0].path); // New document file
    }
  }

  // Start building the SQL query for updating the registration
  let query = `
    UPDATE registrations 
    SET fname = ?, lname = ?, student_id = ?, phone_number = ?, sport_table = ?, category_id = ?, 
        department = ?, faculty = ?, major = ?, status = ?
  `;
  let values = [fname, lname, student_id, phone_number, sport_table, category_id, department, faculty, major, status];

  // Include profile image if it's provided
  if (profileImage) {
    query += ", profile_image = ?";
    values.push(profileImage);
  }

  // Include document if it's provided
  if (documentFile) {
    query += ", document = ?";
    values.push(documentFile);
  }

  // Add the condition for the ID
  query += " WHERE id = ?";
  values.push(id);

  // Execute the update query in the database
  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลการลงทะเบียน' });
    }

    // Check if any row was affected (i.e., if the registration with the given ID exists)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'ไม่พบการลงทะเบียนที่มี ID นี้' });
    }

    return res.status(200).json({ message: 'ข้อมูลการลงทะเบียนอัปเดตสำเร็จ' });
  });
};