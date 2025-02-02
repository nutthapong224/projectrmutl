const express = require("express");
const router = express.Router();
const { addUser, getUserById, upload ,searchPlayers, updateMedalAndStatus, getAllUsers, addPendingUser,getPendingStatus,updatePendingStatus ,getFilters,searchUserss} = require("../controllers/hooptakrawController");

// Route to insert a new user
router.post(
  "/add",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  addPendingUser
);

router.get("/search", searchPlayers);
router.get("/:id", getUserById); 
router.put("/:id/medal-status", updateMedalAndStatus); 
router.get("/", getAllUsers);

router.get("/getfilter", getFilters);
router.get("/getpendingfilter", getAllUsers);
router.get("/searchpending", searchUserss);
router.get("/status/:id", getPendingStatus); // ดึงสถานะของผู้ใช้ที่รออนุมัติ
router.put("/status/:id", updatePendingStatus); // อัปเดตสถานะของผู้ใช้ที่รออนุมัติ



module.exports = router;