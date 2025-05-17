const express = require('express');
const router = express.Router();
const {getCategoriesBySport,getAllSports,register,upload,addPendingUser,getPendingUsers, getSportsCategories,searchPendingUsers,getSportData, approvePendingUser,rejectPendingUser,updatestatuss,addUser,deleteUser,getplayerbyid,updateRegistration,searchUsers,searchUsersall} = require('../controllers/studentorganizationControllers');

// Route สำหรับดึงข้อมูลประเภทกีฬาจากตาราง sports โดยใช้ sport_name


router.post('/addplayer', upload.fields([
  { name: 'profile_image', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), addUser);
router.post('/addpending', upload.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]), addPendingUser);
  router.put('/update-registration/:id', upload.fields([
    { name: 'profile_image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]), updateRegistration);
  
router.get('/category/:name', getCategoriesBySport  );
router.get('/sports/', getAllSports);
router.get('/pending', getPendingUsers);
router.post('/approve/:id', approvePendingUser);
router.post('/adduser', addUser);
router.get('/sportcategorie', getSportsCategories);
router.get('/searchpending', searchPendingUsers);
router.get('/search', searchUsers);
router.get('/searchall', searchUsersall );
router.delete('/reject/:id', approvePendingUser);
router.delete('/player/:id', deleteUser);
router.get('/player/:id', getplayerbyid);
router.put('/update/:id', updatestatuss);
module.exports = router;
