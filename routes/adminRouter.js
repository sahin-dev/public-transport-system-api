const express = require('express');
const {protect, admin} = require('../middlewares/authMiddleware')
const {getAllTransport, getAllUsers, getRequestsByResolve,
    getRequestsByType, addStopage, addRoute, approveTransport, 
    getAllTransportByStatus, getTickets, getTicketByUID, resolveRequest} = require('../controllers/adminController')
const router = express.Router();

router.route('/requests').get(protect, admin, getRequestsByResolve);
router.route('/requests/:type').get(protect, admin, getRequestsByType);
router.route('/request').put(protect, resolveRequest);
router.route('/users').get(protect,admin, getAllUsers);
router.route('/vehicles').get(protect,admin, getAllTransport).post(protect,admin,getAllTransportByStatus);
router.route('/tickets').get(protect, admin, getTickets);
router.route('/ticket/:uid').get(protect, admin, getTicketByUID);
router.route('/stopage').post(protect,admin, addStopage);
router.route('/route').post(protect, admin, addRoute);
router.route('/vehicle/approve').post(protect,admin,approveTransport);



module.exports = router;