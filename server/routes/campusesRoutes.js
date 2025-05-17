const express = require("express");
const router = express.Router();
const { getAllCampuses, addCampus, deleteCampus } = require("../controllers/campusController")

router.get("/", getAllCampuses);
router.post("/", addCampus);
router.delete("/:id", deleteCampus);

module.exports = router;
