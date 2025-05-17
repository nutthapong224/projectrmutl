const express = require("express");
const router = express.Router();
const { getPositiondirector } = require("../controllers/positiondirector"); // Import the controller

// Route to fetch departments
router.get("/",  getPositiondirector);

module.exports = router;
