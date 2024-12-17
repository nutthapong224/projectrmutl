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
    student_id,
    prefix,
    first_name,
    last_name,
    faculty,
    department,
    position,
    phone_number,
    join_year,
  } = req.body;

  const photo_url = req.files?.photo_url?.[0]?.filename || null;
  const id_proof_url = req.files?.id_proof_url?.[0]?.filename || null;

  const sql = `INSERT INTO studentorganization (student_id, prefix, first_name, last_name, faculty, department, position, phone_number, join_year, photo_url, id_proof_url, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  try {
    const [result] = await pool.query(sql, [
      student_id,
      prefix,
      first_name,
      last_name,
      faculty,
      department,
      position,
      phone_number,
      join_year,
      photo_url,
      id_proof_url,
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

// API to get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM studentorganization WHERE id = ?";

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
  const { first_name, last_name, department } = req.query;

  // Build SQL query dynamically based on provided parameters
  let sql = "SELECT * FROM studentorganization WHERE 1=1";
  const values = [];

  if (first_name) {
    sql += " AND first_name LIKE ?";
    values.push(`%${first_name}%`);
  }

  if (last_name) {
    sql += " AND last_name LIKE ?";
    values.push(`%${last_name}%`);
  }

  if (department) {
    sql += " AND department LIKE ?";
    values.push(`%${department}%`);
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

module.exports = {
  addUser,
  getUserById,
  upload,
  searchPlayers,
};
