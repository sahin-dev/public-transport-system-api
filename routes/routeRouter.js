const express = require('express');
const { protect, admin } = require('../middlewares/authMiddleware');
const { addRoute, getRoutes, getRoute, updateRoute } = require('../controllers/routeController');
const router= express.Router();

router.route('/').post(addRoute).get(getRoutes);
router.route('/route').get(getRoute).post(updateRoute);

module.exports = router;