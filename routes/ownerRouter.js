const express = require('express');

const router = express.Router();
const {assignDriver,assignSupervisor,requestWithdraw,getVehicles,addVehicleRequest, getRequests,
    editVehicle, removeVehicle, addBank, changeStatus, getDriverDetails, getSupervisorDetails, getVehicle} = require('../controllers/ownerController');
const {protect} = require('../middlewares/authMiddleware')

router.route("/vehicles").get(protect,getVehicles);
router.route("/vehicle/:v_id").get(protect, getVehicle).put(protect,editVehicle).delete(protect,removeVehicle);
router.get("/vehicle/driver/:d_id",protect, getDriverDetails);
router.get("/vehicle/supervisor/:s_id",protect, getSupervisorDetails);
router.route("/assign_driver").post(protect,assignDriver);
router.route('/assign_supervisor').post(protect,assignSupervisor);
router.route('/withdraw').post(requestWithdraw);
router.route('/add_vehicle').post(protect,addVehicleRequest);
router.route("/status").post(changeStatus);
router.route('/add_bank').post(addBank);
router.route('/requests').get(protect, getRequests);

module.exports = router;


