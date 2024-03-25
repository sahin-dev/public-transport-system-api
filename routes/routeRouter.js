const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const { addRoute, getRoutes, getRoute, updateRoute, getStopage, addStopage,updateStopage, deleteStopage, getStopages } = require('../controllers/routeController');
const router= express.Router();

router.route('/').post(addRoute).put(updateRoute).get(getRoute);
router.route('/routes').get(getRoutes);
router.route('/stopage').get(getStopage).post(addStopage).put(updateStopage).delete(deleteStopage);
router.route('/stopages').get(getStopages);


module.exports = router;