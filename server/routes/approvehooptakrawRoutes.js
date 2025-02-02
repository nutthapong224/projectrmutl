const express = require("express");
const router = express.Router();
const {  upload , addPendingUser,rejectPendingUser,approvePendingUser,getpenddingAllUsers, getPendingFilters,searchPendingUsers, getPendingStatus, updatePendingStatus, searchUserss, getAllUsers,getFilters,searchPlayers, getUserById} = require("../controllers/hooptakrawController");

// Route to insert a new user
router.post(
  "/add",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  addPendingUser
);


router.delete("/reject/:id", rejectPendingUser);
router.post("/approve/:id", approvePendingUser);
router.get("/", getpenddingAllUsers);
router.get("/alluser", getAllUsers);
router.get("/getpendingfilter", getPendingFilters);
router.get("/search", searchPlayers);
router.get("/getfilter", getFilters);
router.get("/:id", getUserById);
router.get("/searchpending", searchPendingUsers);
router.get("/searchpendings", searchUserss);
router.get("/status/:id", getPendingStatus); // ดึงสถานะของผู้ใช้ที่รออนุมัติ
router.put("/status/:id", updatePendingStatus); // อัปเดตสถานะของผู้ใช้ที่รออนุมัติ

module.exports = router;