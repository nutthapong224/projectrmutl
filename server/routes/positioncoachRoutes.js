const express = require("express");
const router = express.Router();
const { getPositioncoach } = require("../controllers/positionCoach"); // Import the controller

// Route to fetch departments
router.get("/", getPositioncoach);

module.exports = router;
