const express = require("express");
const router = express.Router();
const { getDepartments } = require("../controllers/departmentControllers"); // Import the controller

// Route to fetch departments
router.get("/", getDepartments);

module.exports = router;
