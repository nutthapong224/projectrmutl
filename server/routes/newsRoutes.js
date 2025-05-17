const express = require('express');
const router = express.Router();
const {upload,deleteUser,getplayerbyid,updateRegistration,addnews,getPendingUsers} = require('../controllers/newsControllers');

// Route สำหรับดึงข้อมูลประเภทกีฬาจากตาราง sports โดยใช้ sport_name


router.post('/addplayer', upload.fields([
  { name: 'profile_image', maxCount: 1 },

]), addnews);

  router.put('/update-registration/:id', upload.fields([
    { name: 'profile_image', maxCount: 1 }
  ]), updateRegistration);
  






router.delete('/player/:id', deleteUser);
router.get('/player/:id', getplayerbyid);
router.get('/searchall/', getPendingUsers);
module.exports = router;
