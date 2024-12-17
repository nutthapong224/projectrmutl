const express = require("express");
const router = express.Router();
const {
  addUser,
  getUserById,
  upload,
  searchPlayers,
} = require("../controllers/studentorganizationControllers");

// Route to insert a new user
router.post(
  "/add",
  upload.fields([
    { name: "photo_url", maxCount: 1 },
    { name: "id_proof_url", maxCount: 1 },
  ]),
  addUser
);

// Route to search players
router.get("/search", searchPlayers);

// Route to get a user by ID
router.get("/:id", getUserById);

module.exports = router;