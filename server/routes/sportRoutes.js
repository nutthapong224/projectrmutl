const express = require('express');
const router = express.Router();
const {getCategoriesBySport,getAllSports,register,upload,addPendingUser,getPendingUsers, getSportsCategories,searchPendingUsers,getSportData, approvePendingUser,rejectPendingUser} = require('../controllers/sportController');

// Route สำหรับดึงข้อมูลประเภทกีฬาจากตาราง sports โดยใช้ sport_name

router.post(
  "/add",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  addPendingUser
);
router.post('/sports/registrations', upload.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]), register);

router.get('/category/:name', getCategoriesBySport  );
router.get('/sports/', getAllSports);
router.get('/pending', getPendingUsers);
router.post('/approve/:id', approvePendingUser);
router.get('/sportcategorie', getSportsCategories);
router.get('/searchpending', searchPendingUsers);
router.delete('/reject/:id', rejectPendingUser);
module.exports = router;
