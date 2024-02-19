const express =  require('express');
const router = express.Router();
const {payFare,getPassengers} = require('../controllers/passengerController');
const {protect} = require("../middlewares/authMiddleware");

router.route('/').get(getPassengers).post();
router.route("/pay").post(protect, payFare);

module.exports = router;