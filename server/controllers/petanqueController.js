const express = require('express');
const pool = require("../config/db");
const multer = require("multer");

const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Save files to the uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter configuration
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."), false);
  }
};

// Multer setup for handling file uploads
const upload = multer({ storage, fileFilter  });

// Router initialization
const router = express.Router();

// Serve static files from uploads folder
router.use("/uploads", express.static(uploadsDir));

// Add pending user with files (handling both profile image and document)
const addPendingUser = async (req, res) => {
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

    status,
  } = req.body;

  // Check if files exist and extract filenames
  const profile_image = req.files?.profile_image?.[0]?.filename || null;
  const document = req.files?.document?.[0]?.filename || null;

  // Generate file paths for the uploaded files
  const profileImagePath = profile_image ? `/uploads/${profile_image}` : null;
  const documentPath = document ? `/uploads/${document}` : null;

  // SQL query to add pending user
  const sql = `INSERT INTO pendingpetanque (prefix, fname, lname, student_id, department, faculty, major, phone_number, sport_type, profile_image, document, created_at,status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(),?)`;

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
      profileImagePath,
      documentPath,
   
      status,
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
// API to get all pending users

const getPendingFilters = async (req, res) => {
  try {
    const [departments] = await pool.query("SELECT DISTINCT department FROM pendingpetanque WHERE department IS NOT NULL");
    const [sportTypes] = await pool.query("SELECT DISTINCT sport_type FROM pendingpetanque WHERE sport_type IS NOT NULL");

    res.status(200).json({
      departments: departments.map(row => row.department),
      sportTypes: sportTypes.map(row => row.sport_type),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching filters.");
  }
};

const getFilters = async (req, res) => {
  try {
    const [departments] = await pool.query("SELECT DISTINCT department FROM petanque WHERE department IS NOT NULL");
    const [sportTypes] = await pool.query("SELECT DISTINCT sport_type FROM petanque WHERE sport_type IS NOT NULL");

    res.status(200).json({
      departments: departments.map(row => row.department),
      sportTypes: sportTypes.map(row => row.sport_type),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching filters.");
  }
};

const updatePendingStatus = async (req, res) => {
  const { id } = req.params; // Get user ID from the URL
  const { status } = req.body; // Get the new status from the request body

  try {

    const sql = "UPDATE petanque SET status = ?, updated_at = NOW() WHERE id = ?";

    // Execute the query and get the result
    const [result] = await pool.query(sql, [status, id]);

    // If no rows were affected, the user with the given ID was not found
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Pending user not found." });
    }

    // Return success response if the update was successful
    res.status(200).send({ message: "Status updated successfully." });
  } catch (err) {
    // Log the error and send a server error response
    console.error(err);
    res.status(500).send({ message: "Error updating status." });
  }
};




const getPendingStatus = async (req, res) => {
  try {
    const sql = "SELECT id, fname, lname, status FROM pendingpetanque";
    const [results] = await pool.query(sql);

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching pending status.");
  }
};

const searchPendingUsers = async (req, res) => {
  const { department, sport_type } = req.query;

  let sql = "SELECT * FROM pendingepetanque WHERE 1=1";
  const values = [];

  if (department) {
    sql += " AND department = ?";
    values.push(department);
  }

  if (sport_type) {
    sql += " AND sport_type = ?";
    values.push(sport_type);
  }

  try {
    const [results] = await pool.query(sql, values);

    if (results.length === 0) {
      return res.status(404).send("No pending users found.");
    }

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching pending users.");
  }
};

const searchUserss = async (req, res) => {
  const { department, sport_type } = req.query;

  let sql = "SELECT * FROM petanque WHERE 1=1";
  const values = [];

  if (department) {
    sql += " AND department = ?";
    values.push(department);
  }

  if (sport_type) {
    sql += " AND sport_type = ?";
    values.push(sport_type);
  }

  try {
    const [results] = await pool.query(sql, values);

    if (results.length === 0) {
      return res.status(404).send("No pending users found.");
    }

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching pending users.");
  }
};
const getpenddingAllUsers = async (req, res) => {
  const sql = "SELECT * FROM pendingpetanque";

  try {
    const [results] = await pool.query(sql);

    // if (results.length === 0) {
    //   return res.status(404).send("No users found.");
    // }

    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users.");
  }
};

// API for admin to approve a pending user
const approvePendingUser = async (req, res) => {
  const { id } = req.params;

  try {

    const [pendingUser] = await pool.query(
      "SELECT * FROM pendingpetanque WHERE id = ?",
      [id]
    );

    if (pendingUser.length === 0) {
      return res.status(404).send("Pending user not found.");
    }

    const userData = pendingUser[0];


    const insertSql = `INSERT INTO petanque (prefix, fname, lname, student_id, department, faculty, major, phone_number, sport_type, profile_image, document, created_at, status)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
    await pool.query(insertSql, [
      userData.prefix,
      userData.fname,
      userData.lname,
      userData.student_id,
      userData.department,
      userData.faculty,
      userData.major,
      userData.phone_number,
      userData.sport_type,
      userData.profile_image,
      userData.document,
      userData.created_at,

      userData.status,
    ]);


    await pool.query("DELETE FROM pendingpetanque WHERE id = ?", [id]);

    res.status(200).send({ message: "User approved and moved to petanque." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error approving user.");
  }
};

// API for admin to reject a pending user
const rejectPendingUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query("DELETE FROM pendingpetanque WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Pending user not found.");
    }

    res.status(200).send({ message: "User rejected successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error rejecting user.");
  }
};

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

    status
  } = req.body;

  const profile_image = req.files?.profile_image?.[0]?.filename || null;
  const document = req.files?.document?.[0]?.filename || null;

  const sql = `INSERT INTO petanque (prefix, fname, lname, student_id, department, faculty, major, phone_number, sport_type, profile_image, document, created_at, updated_at, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(),?)`;

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
    UPDATE petanque 
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
  const sql = "SELECT * FROM petanque WHERE id = ?";

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
  let sql = "SELECT * FROM petanque WHERE 1=1";
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
  const sql = "SELECT * FROM petanque";

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
  addPendingUser,
  searchPlayers, 
  updateMedalAndStatus, // Export the new API 
  getpenddingAllUsers,
  approvePendingUser,
  rejectPendingUser,
  getAllUsers,
  getPendingFilters, 
  searchPendingUsers,
  updatePendingStatus,
   getPendingStatus, 
   getFilters,
   searchUserss
   

};