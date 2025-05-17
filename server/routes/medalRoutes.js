const express = require('express');
const router = express.Router();
const {getCategoriesBySport,register,upload,addPendingUser,getPendingUsers, getSportsCategories,searchPendingUsers,getSportData, approvePendingUser,rejectPendingUser,updatestatuss,addUser,deleteUser,getplayerbyid,updateRegistration,searchUsersall,getAllMedal,incrementMedal} = require('../controllers/medalController');

// Route สำหรับดึงข้อมูลประเภทกีฬาจากตาราง sports โดยใช้ sport_name
router.post('/addresult',addUser);
  router.put('/update-registration/:id', updateRegistration);
  
router.get('/category/:name', getCategoriesBySport  );

router.get('/pending', getPendingUsers);
router.post('/approve/:id', approvePendingUser);
router.post('/adduser', addUser);
router.get('/sportcategorie', getSportsCategories);
router.get('/searchpending', searchPendingUsers);
router.get('/searchall', searchUsersall);
router.delete('/reject/:id', approvePendingUser);
router.delete('/medal/:id', deleteUser);
router.get('/medal/:id', getplayerbyid);
router.get('/medal', getAllMedal);
router.put('/update/:id', updatestatuss);
router.put('/incrementmedal',incrementMedal);
module.exports = router;
