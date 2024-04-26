const express = require('express');

const router = express.Router();
const {assignDriver,assignSupervisor,requestWithdraw,getVehicles,addVehicleRequest, getRequests,
    editVehicle, removeVehicle, addBank, changeStatus, getDriverDetails, getSupervisorDetails, getVehicle, getVehiclesByStatus} = require('../controllers/ownerController');
const {protect} = require('../middlewares/authMiddleware');
const checkRole = require('../middlewares/checkRole');

router.route("/vehicles").get(protect, checkRole('owner'),getVehicles);
router.route("/vehicles/:status").get(protect,checkRole('owner'),getVehiclesByStatus);
router.route("/vehicle/:v_id").get(protect,checkRole('owner'), getVehicle).put(protect,editVehicle).delete(protect,removeVehicle);
router.get("/vehicle/driver/:d_id",protect,checkRole('owner'), getDriverDetails);
router.get("/vehicle/supervisor/:s_id",protect,checkRole('owner'), getSupervisorDetails);
router.route("/assign_driver").post(protect,checkRole('owner'),assignDriver);
router.route('/assign_supervisor').post(protect,checkRole('owner'),assignSupervisor);
router.route('/withdraw').post(protect,checkRole('owner'),requestWithdraw);
router.route('/add_vehicle').post(protect,checkRole('owner'),addVehicleRequest);
router.route("/status").post(changeStatus);
router.route('/add_bank').post(addBank);
router.route('/requests').get(protect, getRequests);

module.exports = router;


