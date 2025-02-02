 express = require('express');
const { adminLoginController , adminRegisterController} = require('../controllers/adminControllers');
const { authenticateAdmin } = require('../middlewares/authenticateAdmin'); 

const router = express.Router();

// Admin login route
router.post('/login', adminLoginController);
router.post('/register', adminRegisterController);


module.exports = router;
