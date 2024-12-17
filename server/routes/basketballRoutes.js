const express = require("express");
const router = express.Router();
const { addUser, getUserById, upload ,searchPlayers} = require("../controllers/basketballControllers");

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

module.exports = router;