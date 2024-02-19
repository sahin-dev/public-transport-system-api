const express = require('express');
const {getUser,loginUser, registerUser} = require('../controllers/userController');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware')

/* GET users listing. */
router.route('/').post(registerUser).get(protect,getUser)
router.post('/login',loginUser);


module.exports = router;
