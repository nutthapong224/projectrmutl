
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
  const { fname, lname, student_id, phone_number, sport_table, category_id, department, faculty, major, status } = req.body;

  if (!req.files || !req.files['profile_image'] || !req.files['document']) {
    return res.status(400).json({ error: 'กรุณาอัพโหลดรูปโปรไฟล์และเอกสาร' });
  }

  const profileImage = path.basename(req.files['profile_image'][0].path);
  const documentFile = path.basename(req.files['document'][0].path);

  const query = `INSERT INTO registrations (fname, lname, student_id, phone_number, sport_table, category_id, department, faculty, major, status, profile_image, document)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [fname, lname, student_id, phone_number, sport_table, category_id, department, faculty, major, status, profileImage, documentFile];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
    }

    return res.status(200).json({ message: 'ลงทะเบียนสำเร็จ!', insertedId: results.insertId });
  });
};


// ดึงรายการกีฬาทั้งหมด
exports.getAllMedal = async (req, res) => {
  const sql = `SELECT * FROM medal_table`;

  try {
    const [result] = await pool.query(sql); // ใช้ await กับ destructuring
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
    student_id,
    department,
    faculty,
    major,
    phone_number,
    sport_table,
    category_id,
    status,
    title
  } = req.body;

  // ตรวจสอบว่ามีไฟล์ที่อัปโหลดหรือไม่ และดึงชื่อไฟล์
  const profile_image = req.files?.profile_image?.[0]?.filename || null;
  const document = req.files?.document?.[0]?.filename || null;

  // กำหนดเส้นทางไฟล์ที่อัปโหลด
  const profileImagePath = profile_image ? `/uploads/${profile_image}` : null;
  const documentPath = document ? `/uploads/${document}` : null;

  // คำสั่ง SQL สำหรับเพิ่มข้อมูลลงในตาราง pendingregistration
  const sql = `INSERT INTO pendingregistration 
               (fname, lname, student_id, department, faculty, major, phone_number, sport_table, category_id, profile_image, document, create_at, status,title) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?,?)`;

  try {
    const [result] = await pool.query(sql, [
      fname,
      lname,
      student_id,
      department,
      faculty,
      major,
      phone_number,
      sport_table,
      category_id,
      profileImagePath,
      documentPath,
      status,
      title
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
  FROM pendingregistration r
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
  const { sport_table, category_id, department, registration_id } = req.query;

  // สร้างตารางรวมจากกีฬาต่าง ๆ
  let sql = `SELECT registration_id,team1, team1score, team2, team2score, winner, 
                    r.category_id, r.sport_table, c.category_name
             FROM competition_results r
             JOIN (
                 SELECT 'football' AS sport, category_id, category_name FROM football
                 UNION ALL
                 SELECT 'volleyball', category_id, category_name FROM volleyball
                 UNION ALL
                 SELECT 'badminton', category_id, category_name FROM badminton
                 UNION ALL
                 SELECT 'basketball', category_id, category_name FROM basketball
                 UNION ALL
                 SELECT 'futsal', category_id, category_name FROM futsal
                 UNION ALL
                 SELECT 'takraw', category_id, category_name FROM takraw
                 UNION ALL
                 SELECT 'hooptakraw', category_id, category_name FROM hooptakraw
                 UNION ALL
                 SELECT 'tabletenis', category_id, category_name FROM tabletenis
                 UNION ALL
                 SELECT 'esport', category_id, category_name FROM esport
                 UNION ALL
                 SELECT 'petanque', category_id, category_name FROM petanque
             ) c
             ON r.sport_table = c.sport 
             AND r.category_id = c.category_id
             WHERE 1=1`; // 1=1 helps with dynamic filtering

  const params = [];

  if (registration_id) {
    sql += " AND r.registration_id = ?";
    params.push(registration_id);
  }
  if (sport_table) {
    sql += " AND r.sport_table = ?";
    params.push(sport_table);
  }
  if (category_id) {
    sql += " AND r.category_id = ?";
    params.push(category_id);
  }
  if (department) {
    sql += " AND r.department = ?";
    params.push(department);
  }

  try {
    // Execute query
    const [rows] = await pool.query(sql, params);

    // Return results
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving pending users.");
  }
};



exports.searchUsersall = async (req, res) => {
  const { sport_table, category_id, department,fname,lname } = req.query;

  // สร้างตารางรวมจากกีฬาต่าง ๆ
  let sql = `
      SELECT registration_id,team1,team1score,team2,team2score,winner,category_id, 
             sport_table,c.category_name
      FROM competition_results r
      JOIN (
          SELECT 'football' AS sport, category_id, category_name FROM football
          UNION ALL
          SELECT 'volleyball', category_id, category_name FROM volleyball
          UNION ALL
          SELECT 'badminton', category_id, category_name FROM badminton
          UNION ALL
          SELECT 'basketball', category_id, category_name FROM basketball
          UNION ALL
          SELECT 'futsal', category_id, category_name FROM futsal
          UNION ALL
          SELECT 'takraw', category_id, category_name FROM takraw
          UNION ALL
          SELECT 'hooptakraw', category_id, category_name FROM hooptakraw
          UNION ALL
          SELECT 'tabletenis', category_id, category_name FROM tabletenis
          UNION ALL
          SELECT 'esport', category_id, category_name FROM esport
          UNION ALL
          SELECT 'petanque', category_id, category_name FROM petanque
      ) c
      ON r.sport_table = c.sport AND r.category_id = c.category_id
      WHERE r.registration_id = ?;
    `;

  const params = [];

  if (sport_table) {
    sql += " AND r.sport_table = ?";
    params.push(sport_table);
  }
  if (category_id) {
    sql += " AND r.category_id = ?";
    params.push(category_id);
  }
  if (department) {
    sql += " AND r.department = ?";
    params.push(department);
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

    // Check if there are results

    // Return results
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving pending users.");
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
  FROM registrations r
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
    // ดึงข้อมูลจาก pendingregistration ตาม id
    const [pendingUser] = await pool.query(
      `SELECT 
        registration_id, fname, lname, student_id, phone_number, sport_table, 
        category_id, created_at, department, faculty, major, profile_image, 
        document, status, title
      FROM pendingregistration WHERE registration_id = ?`, // Changed 'id' to 'registration_id'
      [id]
    );
    if (pendingUser.length === 0) {
      return res.status(404).send("Pending user not found.");
    }

    const userData = pendingUser[0];

    // SQL สำหรับการแทรกข้อมูลในตาราง registration
    const insertSql = `INSERT INTO registration (fname, lname, student_id, phone_number, sport_table, category_id, created_at, department, faculty, major, profile_image, document, status, title)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

await pool.query(insertSql, [
userData.fname,
userData.lname,
userData.student_id,
userData.phone_number,
userData.sport_table,
userData.category_id,
userData.created_at,
userData.department,
userData.faculty,
userData.major,
userData.profile_image,
userData.document,
userData.status,
userData.title,
]);
    // ลบข้อมูลจาก pendingregistration
    await pool.query("DELETE FROM pendingregistration WHERE registration_id = ?", [id]);

    res.status(200).send({ message: "User approved and moved to registration." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error approving user.");
  }
};

exports.rejectPendingUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM pendingregistration WHERE id = ?", [id]);

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
    const [result] = await pool.query("DELETE FROM medal_table WHERE registration_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Pending user not found.");
    }

    res.status(200).send({ message: "User delete successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error delete user.");
  }
};

// exports.updatestatus = async (req, res) => {
//     const { id } = req.params; // Get user ID from the URL
//   const { status } = req.body; // Get the new status from the request body

//     if (!status) {
//         return res.status(400).json({ error: "Status is required" });
//     }

//     const query = "UPDATE registration SET status = ? WHERE registration_id = ?";
    
//     pool.query(query, [status, id], (err, result) => {
//         if (err) {
//             console.error("Error updating status:", err);
//             return res.status(500).json({ error: "Internal Server Error" });
//         }
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: "Registration ID not found" });
//         }
//         res.json({ message: "Status updated successfully" });
//     });
// };
exports.updatestatuss = async (req, res) => {
    const { id } = req.params;  // Use `id` instead of `registration_id`
    const { status } = req.body;
  
    
  
    try {
      const sql = "UPDATE medal_table SET status = ? WHERE registration_id = ?";
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
    gold,silver,bronze,department 
   } = req.body;
   const sql = `INSERT INTO medal_table
                (gold,silver,bronze,department,created_at) 
                VALUES (?, ?, ?, ?,NOW())`;
 
   try {
     const [result] = await pool.query(sql, [
      gold,silver,bronze,department 
     ]);
 
     res.status(201).send({
       message: "User added to pending successfully.",
       id: result.insertId,
   
     });
   } catch (err) {
     console.error(err);
     res.status(500).send("Error adding user to pending.");
   }
 };



 exports.getplayerbyid = async (req, res) => {
  try {
    const { id } = req.params; // รับค่า ID จาก request params

    let sql = `SELECT registration_id, gold, silver, bronze, department 
           FROM medal_table
           WHERE registration_id = ?`;

    // ใช้ promise-based query execution
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

exports.incrementMedal = async (req, res) => {
  try {
    const { department, medalType } = req.body;
    
    // ตรวจสอบข้อมูลที่ส่งมา
    if (!department || !medalType) {
      return res.status(400).json({ error: 'ต้องระบุ department และ medalType' });
    }
    
    // ตรวจสอบว่า medalType ถูกต้อง
    if (!['gold', 'silver', 'bronze'].includes(medalType)) {
      return res.status(400).json({ error: 'medalType ต้องเป็น gold, silver หรือ bronze เท่านั้น' });
    }
    
    // ตรวจสอบว่ามีข้อมูลวิทยาเขตนี้ในระบบหรือไม่
    const checkQuery = 'SELECT * FROM medal_table WHERE department = ?';
    const [rows] = await pool.query(checkQuery, [department]);
    
    if (rows.length === 0) {
      // ถ้ายังไม่มีข้อมูล สร้างข้อมูลใหม่
      const insertValues = {
        gold: medalType === 'gold' ? 1 : 0,
        silver: medalType === 'silver' ? 1 : 0,
        bronze: medalType === 'bronze' ? 1 : 0,
        department: department
      };
      
      const insertQuery = `
        INSERT INTO medal_table (gold, silver, bronze, department, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      
      const [insertResult] = await pool.query(
        insertQuery, 
        [insertValues.gold, insertValues.silver, insertValues.bronze, department]
      );
      
      return res.status(201).json({
        message: `สร้างข้อมูลใหม่และเพิ่มเหรียญ ${medalType} ให้กับ ${department} สำเร็จ`,
        id: insertResult.insertId
      });
    } else {
      // ถ้ามีข้อมูลอยู่แล้ว เพิ่มจำนวนเหรียญ
      const updateQuery = `
        UPDATE medal_table
        SET ${medalType} = ${medalType} + 1
        WHERE department = ?
      `;
      
      const [updateResult] = await pool.query(updateQuery, [department]);
      
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ error: 'ไม่สามารถอัปเดตข้อมูลได้' });
      }
      
      return res.status(200).json({
        message: `เพิ่มจำนวนเหรียญ ${medalType} ให้กับ ${department} สำเร็จ`,
        updatedRows: updateResult.affectedRows
      });
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มจำนวนเหรียญ' });
  }
};


exports.updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const {    
  gold,silver,bronze,department } = req.body;

    let query = `
      UPDATE medal_table
      SET gold = ?, silver = ?, bronze = ?, department = ?
    `;
    let values = [   
      gold,silver,bronze,department
     ];

   

    query += " WHERE registration_id = ?";
    values.push(id);

    const [results] = await pool.query(query, values);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'ไม่พบการลงทะเบียนที่มี ID นี้' });
    }

    return res.status(200).json({ message: 'ข้อมูลการลงทะเบียนอัปเดตสำเร็จ' });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลการลงทะเบียน' });
  }
};
