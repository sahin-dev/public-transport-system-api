const express = require('express')
const router = express.Router();
const {initPayment,paymentCancel, paymentFail, paymentSuccess,IPN} = require('../controllers/paymentController')
const {protect} = require('../middlewares/authMiddleware')


router.route('').get(protect,initPayment)
router.route('/success').post(protect,paymentSuccess)
router.route('/fail').post(protect,paymentFail)
router.route('/cancel').post(protect,paymentCancel)
router.route('/ipn').post(IPN)

module.exports = router