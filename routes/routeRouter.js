const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const { addRoute, getRoutes, getRoute, updateRoute, getStopage, addStopage,updateStopage, deleteStopage, getStopages } = require('../controllers/routeController');
const router= express.Router();

router.route('/').post(protect,admin,addRoute).put(protect,admin,updateRoute).get(getRoute);
router.route('/routes').get(getRoutes);
router.route('/stopage').get(protect,getStopage).post(protect,admin,addStopage).put(updateStopage).delete(deleteStopage);
router.route('/stopages').get(protect,getStopages);


module.exports = router;