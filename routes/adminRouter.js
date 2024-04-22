const express = require('express');
const {protect, admin} = require('../middlewares/authMiddleware')
const {getAllTransport, getAllUsers, getRequestsByResolve, addStopage, addRoute, approveTransport} = require('../controllers/adminController')
const router = express.Router();

router.route('/requests').get(protect, admin, getRequestsByResolve);
router.route('/users').get(protect,admin, getAllUsers);
router.route('/transports').get(protect,admin, getAllTransport);
router.route('/stopage').post(protect,admin, addStopage);
router.route('/route').post(protect, admin, addRoute);
router.route('/vehicle/approve').post(protect,admin,approveTransport);



module.exports = router;