
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

exports.getCategoriesBySport = async (req, res) => {
  const sportNameInEnglish = req.params.name;  // รับชื่อกีฬาภาษาอังกฤษจาก URL (เช่น football, volleyball)

  // สร้าง object สำหรับแปลงชื่อกีฬาอังกฤษเป็นชื่อกีฬาไทย
  const sportNameMapping = {
    'football': 'ฟุตบอล',
    'volleyball': 'วอลเลย์บอล',
    'badminton': 'แบดมินตัน',
    'basketball': 'บาสเกตบอล',
    'futsal': 'ฟุตซอล',
    'takraw': 'เซปักตะกร้อ',
    'hooptakraw': "เซปักตะกร้อลอดห่วง",
    'tabletenis': "เทเบิลเทนิส",
    "esport": "e-sport",
    "petanque": "เปตอง"
    // เพิ่มกีฬาชื่ออื่นๆ ที่นี่
  };

  // หา sport_name ภาษาไทยจากการแปลง
  const sportNameInThai = sportNameMapping[sportNameInEnglish] || sportNameInEnglish;

  // สร้าง query สำหรับค้นหาข้อมูลประเภทกีฬาจากตารางที่ตรงกับชื่อกีฬา
  const query = `
      SELECT c.category_id, c.category_name
      FROM ${sportNameInEnglish} c  -- ใช้ชื่อกีฬาเป็นชื่อตารางภาษาอังกฤษ
      JOIN sports s ON s.sport_name = ?  -- เชื่อมโยง sport_name ในตาราง sports
      WHERE c.category_name IS NOT NULL`;  // ตรวจสอบว่า category_name มีค่าไม่เป็น NULL

  try {


    // ใช้ pool.query() ด้วย Promise
    const [results] = await pool.query(query, [sportNameInThai]);

    if (results.length === 0) {

      return res.status(404).json({ error: 'No categories found for the specified sport' });
    }

    // ส่งผลลัพธ์กลับไปยัง client พร้อม category_id และ category_name ของกีฬาที่ค้นหา
    res.json(results);
  } catch (err) {
    // จัดการข้อผิดพลาด
    console.error('Database error: ', err);
    return res.status(500).json({ error: 'Database error' });
  }
};

exports.register = (req, res) => {
  const { fname, lname,  phone_number, sport_table, category_id, department, faculty, major, status } = req.body;

  if (!req.files || !req.files['profile_image'] || !req.files['document']) {
    return res.status(400).json({ error: 'กรุณาอัพโหลดรูปโปรไฟล์และเอกสาร' });
  }

  const profileImage = path.basename(req.files['profile_image'][0].path);
  const documentFile = path.basename(req.files['document'][0].path);

  const query = `INSERT INTO coach (fname, lname, phone_number, sport_table, category_id, department, faculty, major, status, profile_image, document)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [fname, lname,  phone_number, sport_table, category_id, department, faculty, major, status, profileImage, documentFile];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }

    return res.status(200).json({ message: 'ลงทะเบียนสำเร็จ!', insertedId: results.insertId });
  });
};


// ดึงรายการกีฬาทั้งหมด
exports.getAllSports = async (req, res) => {
  const sql = `
    SELECT r.registration_id, r.fname, r.lname, r.sport_table, c.category_name, r.status
    FROM pendingcoach r
    JOIN (
        SELECT 'football' AS sport, category_id, category_name FROM football
        UNION ALL
        SELECT 'badminton', category_id, category_name FROM badminton
        UNION ALL
        SELECT 'basketball', category_id, category_name FROM basketball
    ) c
    ON r.sport_table = c.sport AND r.category_id = c.category_id;
  `;

  try {
    const [result] = await pool.query(sql); // Use await and destructuring
    res.json(result);
  } catch (err) {
    console.error("Error fetching data: ", err);
    res.status(500).send("Error fetching data");
  }
};

exports.addPendingUser = async (req, res) => {
    const {
      fname,
      lname,
      phone_number,
      sport_type,
      department,
      faculty,
      major,
      position,
      title,
    } = req.body;
  
    // ตรวจสอบว่ามีไฟล์ที่อัปโหลดหรือไม่ และดึงชื่อไฟล์
    const profile_image = req.files?.profile_image?.[0]?.filename || null;
    const document = req.files?.document?.[0]?.filename || null;
  
    // กำหนดเส้นทางไฟล์ที่อัปโหลด
    const profileImagePath = profile_image ? `/uploads/${profile_image}` : null;
    const documentPath = document ? `/uploads/${document}` : null;
  
    // คำสั่ง SQL สำหรับเพิ่มข้อมูลลงในตาราง pendingcoach
    const sql = `INSERT INTO pendingcoach 
      (fname, lname, phone_number, sport_type, created_at, department, faculty, major, position, title, profile_image, document) 
      VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)`; 
  
    try {
      const [result] = await pool.query(sql, [
        fname,
        lname,
        phone_number,
        sport_type,
        department,
        faculty,
        major,
        position,
        title,
        profileImagePath, // Make sure these values are included
        documentPath,
      ]);
  
      res.status(201).send({
        message: "User added to pending successfully.",
        id: result.insertId,
        profile_image: profileImagePath,
        document: documentPath,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error adding user to pending.");
    }
  };

exports.getPendingUsers = async (req, res) => {
  const sql = `
  SELECT r.registration_id, r.fname, r.lname, r.sport_table, c.category_name, r.status
  FROM pendingcoach r
  JOIN (
      SELECT 'football' AS sport, category_id, category_name FROM football
      UNION ALL
      SELECT 'badminton', category_id, category_name FROM badminton
      UNION ALL
      SELECT 'basketball', category_id, category_name FROM basketball
  ) c
  ON r.sport_table = c.sport AND r.category_id = c.category_id;
`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching data: ", err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(result);
    }
  });
};


exports.searchPendingUsers = async (req, res) => {
  const { position, department ,sport_type,fname,lname} = req.query;
  
  let sql = "SELECT * FROM pendingcoach WHERE 1=1";
  const params = [];
  
  if (position) {
    sql += " AND position = ?";
    params.push(position);
  }
  
  if (department) {
    sql += " AND department = ?";
    params.push(department);
  }
  if (sport_type) {
    sql += " AND sport_type = ?";
    params.push(sport_type);
  }  if (fname) {
    sql += " AND fname LIKE ?";
    params.push(`%${fname}%`);
}
if (lname) {
    sql += " AND lname LIKE ?";
    params.push(`%${lname}%`);
}
  
  
  
  console.log("Executing SQL:", sql);
  console.log("With parameters:", params);
  
  try {
    // Execute query
    const [rows] = await pool.query(sql, params);
    
    console.log("Query returned", rows.length, "rows");
    
    // Return results
    res.status(200).json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Error retrieving pending users.");
  }
};
exports.searchUsers = async (req, res) => {
  const { position, department, sport_type, fname, lname, include_deleted } = req.query;
  
  // Start with base query that excludes deleted users by default
  let sql = "SELECT * FROM coach WHERE 1=1";
  const params = [];
  
  // Handle soft delete filtering
  if (include_deleted === 'true') {
    // If include_deleted is true, return all users (both deleted and non-deleted)
  } else if (include_deleted === 'only') {
    // If include_deleted is 'only', return only deleted users
    sql += " AND is_deleted = 1";
  } else {
    // By default, exclude deleted users
    sql += " AND is_deleted = 0";
  }
  
  // Add other search filters
  if (position) {
    sql += " AND position = ?";
    params.push(position);
  }
  
  if (department) {
    sql += " AND department = ?";
    params.push(department);
  }
  
  if (sport_type) {
    sql += " AND sport_type = ?";
    params.push(sport_type);
  }
  
  if (fname) {
    sql += " AND fname LIKE ?";
    params.push(`%${fname}%`);
  }
  
  if (lname) {
    sql += " AND lname LIKE ?";
    params.push(`%${lname}%`);
  }
  
  console.log("Executing SQL:", sql);
  console.log("With parameters:", params);
  
  try {
    // Execute query
    const [rows] = await pool.query(sql, params);
    
    console.log("Query returned", rows.length, "rows");
    
    // Return results
    res.status(200).json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Error retrieving users.");
  }
};

exports.getSportsCategories = async (req, res) => {
  const sql = `
    SELECT DISTINCT s.sport_table, c.category_id, c.category_name
    FROM sports AS s
    JOIN categories AS c ON s.sport_table = c.sport_table
    ORDER BY s.sport_table, c.category_name
  `;

  try {
    const [rows] = await pool.query(sql);

    // จัดกลุ่ม category ตาม sport_table
    const groupedData = rows.reduce((acc, row) => {
      if (!acc[row.sport_table]) {
        acc[row.sport_table] = [];
      }
      acc[row.sport_table].push({ category_id: row.category_id, category_name: row.category_name });
      return acc;
    }, {});

    res.status(200).json(groupedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving sports and categories.");
  }
};

// exports.searchPendingUsers = async (req, res) => {
//   const { sport_table, category_id, department } = req.query;

//   let sql = "SELECT * FROM pendingregistration WHERE 1=1";
//   const params = [];

//   if (sport_table) {
//     sql += " AND sport_table = ?";
//     params.push(sport_table);
//   }
//   if (category_id) {
//     sql += " AND category_id = ?";
//     params.push(category_id);
//   }
//   if (department) {
//     sql += " AND department = ?";
//     params.push(department);
//   }

//   try {
//     const [rows] = await pool.query(sql, params);
//     res.status(200).json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error retrieving pending users.");
//   }
// };


const getSportData = async (sport) => {
  const sql = `
  SELECT 
      r.registration_id, 
      r.fname, 
      r.lname, 
      r.sport_table, 
      c.category_name, 
      r.department, 
      r.faculty, 
      r.status
  FROM coach r
  JOIN (
      SELECT 'football' AS sport, category_id, category_name FROM football
      UNION ALL
      SELECT 'badminton', category_id, category_name FROM badminton
      UNION ALL
      SELECT 'basketball', category_id, category_name FROM basketball
  ) c
  ON r.sport_table = c.sport AND r.category_id = c.category_id;
`;

  pool.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching data: ", err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(result);
    }
  });
};


exports.approvePendingUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      // ดึงข้อมูลจาก pendingcoach ตาม id
      const [pendingUser] = await pool.query(
        `SELECT 
         fname, lname, phone_number, sport_type, created_at, department, faculty, major, profile_image, document, position, title
        FROM pendingcoach WHERE registration_id = ?`, 
        [id]
      );
  
      if (pendingUser.length === 0) {
        return res.status(404).send("Pending user not found.");
      }
  
      const userData = pendingUser[0];
  
      // SQL สำหรับการแทรกข้อมูลในตาราง coach
      const insertSql = `INSERT INTO coach 
       (fname, lname, phone_number, sport_type, created_at, department, faculty, major, profile_image, document, position, title) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
      await pool.query(insertSql, [
        userData.fname,
        userData.lname,
        userData.phone_number,
        userData.sport_type,
        userData.created_at, 
        userData.department,
        userData.faculty,
        userData.major,
        userData.profile_image,
        userData.document,
        userData.position,
        userData.title,
      ]);
  
      // ลบข้อมูลจาก pendingcoach
      await pool.query("DELETE FROM pendingcoach WHERE registration_id = ?", [id]);
  
      res.status(200).send({ message: "User approved and moved to registration." });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error approving user.");
    }
  };
  

exports.rejectPendingUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM pendingcoach WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Pending user not found.");
    }

    res.status(200).send({ message: "User rejected successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rejecting user.");
  }
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Use UPDATE instead of DELETE for soft delete
    // Set is_deleted to 1 and record when the user was deleted
    const [result] = await pool.query(
      "UPDATE coach SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE registration_id = ? AND is_deleted = 0",
      [id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).send("Pending user not found or already deleted.");
    }
    
    res.status(200).send({ message: "User deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user.");
  }
};

exports.updatestatuss = async (req, res) => {
    const { id } = req.params;  // Use `id` instead of `registration_id`
    const { status } = req.body;
  
    console.log("Received ID:", id);
    console.log("New Status:", status);
  
    try {
      const sql = "UPDATE coach SET status = ? WHERE registration_id = ?";
      const [result] = await pool.query(sql, [status, id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Pending user not found." });
      }
  
      res.status(200).send({ message: "Status updated successfully." });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).send({ message: "Error updating status." });
    }
  };


 exports.addUser= async (req, res) => {
    const {
        fname,
        lname,
        phone_number,
        sport_type,
        department,
        faculty,
        major,
        position,
        title,
      } = req.body;
    
      // ตรวจสอบว่ามีไฟล์ที่อัปโหลดหรือไม่ และดึงชื่อไฟล์
      const profile_image = req.files?.profile_image?.[0]?.filename || null;
      const document = req.files?.document?.[0]?.filename || null;
    
      // กำหนดเส้นทางไฟล์ที่อัปโหลด
      const profileImagePath = profile_image ? `/uploads/${profile_image}` : null;
      const documentPath = document ? `/uploads/${document}` : null;
    
      // คำสั่ง SQL สำหรับเพิ่มข้อมูลลงในตาราง pendingcoach
      const sql = `INSERT INTO coach 
        (fname, lname, phone_number, sport_type, created_at, department, faculty, major, position, title, profile_image, document) 
        VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)`; 
    
      try {
        const [result] = await pool.query(sql, [
          fname,
          lname,
          phone_number,
          sport_type,
          department,
          faculty,
          major,
          position,
          title,
          profileImagePath, // Make sure these values are included
          documentPath,
        ]);
    
        res.status(201).send({
          message: "User added to pending successfully.",
          id: result.insertId,
          profile_image: profileImagePath,
          document: documentPath,
        });
      } catch (err) {
        console.error(err);
        res.status(500).send("Error adding user to pending.");
      }
}



exports.getplayerbyid = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from request params

    let sql = "SELECT * FROM coach WHERE registration_id = ?"; // Fixed SQL query

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




exports.updateRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const { fname, lname, phone_number, sport_type, department, faculty, major, position, title } = req.body;

        const profile_image = req.files?.profile_image?.[0]?.filename || null;
        const document = req.files?.document?.[0]?.filename || null;

        const profileImagePath = profile_image ? `/uploads/${profile_image}` : null;
        const documentPath = document ? `/uploads/${document}` : null;

        let updates = [
            "fname = ?", "lname = ?", "phone_number = ?", "sport_type = ?", 
            "department = ?", "faculty = ?", "major = ?", "position = ?", "title = ?"
        ];
        
        let values = [fname, lname, phone_number, sport_type, department, faculty, major, position, title];

        if (profile_image) {
            updates.push("profile_image = ?");
            values.push(profileImagePath);
        }

        if (document) {
            updates.push("document = ?");
            values.push(documentPath);
        }

        values.push(id);

        const query = `UPDATE coach SET ${updates.join(", ")} WHERE registration_id = ?`;

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

exports.searchUsersallvalue = async (req, res) => {
    const { position, department ,sport_type, fname,lname} = req.query;
    
    let sql = "SELECT * FROM coach WHERE 1=1";
    const params = [];
    
    if (position) {
      sql += " AND position = ?";
      params.push(position);
    }
    
    if (department) {
      sql += " AND department = ?";
      params.push(department);
    }
    if (sport_type) {
      sql += " AND sport_type = ?";
      params.push(sport_type);
    }
    if (fname) {
        sql += " AND fname LIKE ?";
        params.push(`%${fname}%`);
    }
    if (lname) {
        sql += " AND lname LIKE ?";
        params.push(`%${lname}%`);
    }
      
    
    

    
    try {
      // Execute query
      const [rows] = await pool.query(sql, params);
      
      console.log("Query returned", rows.length, "rows");
      
      // Return results
      res.status(200).json(rows);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).send("Error retrieving pending users.");
    }
    };

