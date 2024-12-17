const express = require("express");
const router = express.Router();
const { addUser, getUserById, upload ,searchPlayers, updateMedalAndStatus, getAllUsers} = require("../controllers/badmintonControllers");

// Route to insert a new user
router.post(
  "/add",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  addUser
);

router.get("/search", searchPlayers);
// Route to get a user by ID
router.get("/:id", getUserById); 
router.put("/:id/medal-status", updateMedalAndStatus); 
router.get("/", getAllUsers);
module.exports = router;