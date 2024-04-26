const express = require('express')
const {getTickets,getTicketByUID,checkTicket, getMyVehicle} = require('../controllers/supervisorController')
const {protect} = require('../middlewares/authMiddleware')
const router = express.Router()

router.route('/tickets').get(protect,getTickets)
router.route('/ticket/:uid').get(protect,getTicketByUID)
router.route('/check').post(protect,checkTicket)
router.route('/vehicle').get(protect, getMyVehicle);

module.exports = router