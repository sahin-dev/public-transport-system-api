const express = require('express');
const {getUser,loginUser,addMoney, registerUser,getUserProfile, purchaseTicket, getAllTransport} = require('../controllers/userController');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware')

/* GET users listing. */
router.route('/').post(registerUser).get(protect,getUser)
router.post('/login',loginUser);
router.route('/profile').get(protect,getUserProfile)
router.route('/addmoney').post(protect,addMoney)
router.route('/purchase').post(protect, purchaseTicket)
router.route('/vehicles').get(protect , getAllTransport);


module.exports = router;
