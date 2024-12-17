const pool = require("../config/db");
const multer = require("multer");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."));
  }
};

const upload = multer({ storage, fileFilter });

// API to insert a new record
const addUser = async (req, res) => {
  const {
    prefix,
    fname,
    lname,
    student_id,
    department,
    faculty,
    major,
    phone_number,
    sport_type,
    medal,
    status
  } = req.body;

  const profile_image = req.files?.profile_image?.[0]?.filename || null;
  const document = req.files?.document?.[0]?.filename || null;

  const sql = `INSERT INTO badminton (prefix, fname, lname, student_id, department, faculty, major, phone_number, sport_type, profile_image, document, created_at, updated_at, medal, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)`;

  try {
    const [result] = await pool.query(sql, [
      prefix,
      fname,
      lname,
      student_id,
      department,
      faculty,
      major,
      phone_number,
      sport_type,
      profile_image,
      document,
      medal, 
      status
    ]);

    res.status(201).send({
      message: "User added successfully.",
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding user.");
  }
};

const updateMedalAndStatus = async (req, res) => {
  const { id } = req.params;
  const { medal, status } = req.body;

  const sql = `
    UPDATE badminton 
    SET medal = ?, status = ?, updated_at = NOW() 
    WHERE id = ?
  `;

  try {
    const [result] = await pool.query(sql, [medal, status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("User not found.");
    }

    res.status(200).send({
      message: "Medal and status updated successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating medal and status.");
  }
};
// API to get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM badminton WHERE id = ?";

  try {
    const [results] = await pool.query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).send("User not found.");
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user.");
  }
};

const searchPlayers = async (req, res) => {
  const { fname, lname, department, sport_type } = req.query;

  // Build SQL query dynamically based on provided parameters
  let sql = "SELECT * FROM badminton WHERE 1=1";
  const values = [];

  if (fname) {
    sql += " AND fname LIKE ?";
    values.push(`%${fname}%`);
  }

  if (lname) {
    sql += " AND lname LIKE ?";
    values.push(`%${lname}%`);
  }

  if (department) {
    sql += " AND department LIKE ?";
    values.push(`%${department}%`);
  }

  if (sport_type) {
    sql += " AND sport_type LIKE ?";
    values.push(`%${sport_type}%`);
  }

  try {
    const [results] = await pool.query(sql, values);

    if (results.length === 0) {
      return res.status(404).send("No players found.");
    }

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching players.");
  }
};

const getAllUsers = async (req, res) => {
  const sql = "SELECT * FROM badminton";

  try {
    const [results] = await pool.query(sql);

    if (results.length === 0) {
      return res.status(404).send("No users found.");
    }

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users.");
  }
};


module.exports = {
  addUser,
  getUserById,
  upload,
  searchPlayers, 
  updateMedalAndStatus, // Export the new API 
  getAllUsers
};