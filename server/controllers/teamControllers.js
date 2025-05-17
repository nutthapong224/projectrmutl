const express = require('express');
const db = require("../config/db");
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


const teamController = {
    getAllTeams: async (req, res) => {
        try {
            const [rows] = await db.promise().query(
                'SELECT * FROM Team JOIN Campus ON Team.campus_id = Campus.campus_id'
            );
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getTeamById: async (req, res) => {
        try {
            const [rows] = await db.promise().query(
                'SELECT * FROM Team WHERE team_id = ?',
                [req.params.id]
            );
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Team not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createTeam: async (req, res) => {
        try {
            const { campus_id, sport_type_id, team_name } = req.body;
            const [result] = await db.promise().query(
                'INSERT INTO Team (campus_id, sport_type_id, team_name) VALUES (?, ?, ?)',
                [campus_id, sport_type_id, team_name]
            );
            res.status(201).json({
                id: result.insertId,
                message: 'Team created successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateTeam: async (req, res) => {
        try {
            const { campus_id, sport_type_id, team_name } = req.body;
            const [result] = await db.promise().query(
                'UPDATE Team SET campus_id = ?, sport_type_id = ?, team_name = ? WHERE team_id = ?',
                [campus_id, sport_type_id, team_name, req.params.id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Team not found' });
            }
            res.json({ message: 'Team updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteTeam: async (req, res) => {
        try {
            const [result] = await db.promise().query(
                'DELETE FROM Team WHERE team_id = ?',
                [req.params.id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Team not found' });
            }
            res.json({ message: 'Team deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = teamController;
