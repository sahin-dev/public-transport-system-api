
const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');
const Request = require('../models/requestModel');
const {DRIVER,SUPERVISOR} = require('../utils/constants');
const createError = require('http-errors');


// @desc assign driver for specific vehicle
// @route POST /api/user/owner/assign_driver
// @access Private

const assignDriver = async(req,res,next)=>{
    const { email,vehicle_id} = req.body;
    const user = req.user;
    try{
        let driver = await User.findOne({email}).select("-password");
        let vehicle = await Vehicle.findOne({_id:vehicle_id,owner_id:user._id});

        if(!vehicle){
            res.status(404).json({status:'failed',msg:"Sorry! Vehicle not found"});
            return;
        }
        if(!driver){
            res.status(404).json({status:'failed',msg:"Sorry! Driver not found"});
            return;
        }

        vehicle.driver_id = driver._id;
        driver.role = DRIVER;
        driver = await driver.save();
        vehicle = await vehicle.save();
        const data = {
            driver_name:driver.name,
            driver_phone:driver.phone,
            driver_nid:driver.nid,
            trans_name:vehicle.name,
            trans_number:vehicle.number
            }

        res.status(200).json({status:"success",msg:"Driver added successfully",data});
       
    }catch(err){
        res.status(400);
        res.json({status:"failed", msg:"Assign driver failed"})
    }
};

// @desc assign supervisor for specific vehicle
// @route POST /api/user/owner/assign_supervisor
// @access Private

const assignSupervisor = async(req,res,next)=>{
    const {email,vehicle_id} = req.body;
    const user = req.user;
    try{
        const supervisor = await User.findOne({email}).select('-password');
        const vehicle = await Vehicle.find({_id:vehicle_id,owner_id:user._id});

        
        if(!vehicle){
            res.status(404).json({status:'failed',msg:"Sorry! Vehicle not found"});
            return;
        }
        if(!supervisor){
            res.status(404).json({status:'failed',msg:"Sorry! Supervisor not found"});
            return;
        }

        vehicle.supervisor_id = supervisor._id;
        supervisor.role = SUPERVISOR;
        supervisor.save();
        vehicle.save();
        const data = {
            supervisor_name:supervisor.name,
            supervisor_phone:supervisor.phone,
            supervisor_nid:supervisor.nid,
            trans_name:vehicle.name,
            trans_number:vehicle.number
            }
        res.status(200).json({status:"success",msg:"Supervisor added successfully",data});
        
    }catch(err){
        res.status(400);
        res.json({status:"failed", msg:"Assign supervisor failed"})
    }
};

// @desc get vehicles for a specific user
// @route GET /api/user/owner/vehicles
// @access Private

const getVehicles = async(req,res,next)=>{
    try{
        const vehicles = await Vehicle.find({'owner':req.user._id});
        res.status(200);
        res.json({status:"success",msg:"Vehicles fetched successfully",data:vehicles});
    }catch(err){
        res.status(400);
        res.json({status:"failed", msg:"Vehicles fetched failed"})
    }
    
};

// @desc get  a single vehicle for a specific user
// @route GET /api/user/owner/vehicles/:v_id
// @access Private

const getVehicle = async(req,res,next)=>{
    const v_id = req.params.v_id;
    try{
        const vehicles = await Vehicle.findOne({_id:v_id,'owner':req.user._id});
        res.status(200);
        res.json({status:"success",msg:"Vehicle fetched successfully",data:vehicles});

    }catch(err){
        res.status(400);
        res.json({status:"failed", msg:"Vehicle fetched failed"})
    }
    
};

// @desc Submit add vehicle request to admin
// @route POST /api/user/owner/add_vehicle
// @access Private 

const addVehicleRequest = async(req,res,next)=>{
    const {name,type,desc,number,route} = req.body;
    const user = req.user;
    try{
        const v = await Vehicle.findOne({number});
        
        if(v){
            res.status(409);
            res.json({status:"failed", msg:"Vehicle already added with the same number"});
            return;
        }
        
        const request = await Request.create({user_id:user._id,type:"Vehicle addition request",body:req.body});
        const vehicle = await Vehicle.create({name,desc,type,number,owner:user._id,route});
        
        res.status(200);
        res.json({status:"success",msg:"Request submitted successfully",data:vehicle});
        
    }catch(err){
        res.status(400);
        res.json({status:"failed", msg:"Vehicle addition failed"})
    }
};

// @desh get submitted requests for a user
// @route GET /api/user/owner/requests
// @access Private

const getRequests = async(req,res,next)=>{
    try{
        const requests = await Request.find({"user_id":req.user._id});
        res.status(200).json({status:"success",msg:"Requests fetched successfully",data:requests});
    }catch(err){
        res.status(500);
        next(createError("Internal server error!"));
    }
}

// @desc get vehicles for a specific user
// @route DELETE /api/user/owner/vehicle/:v_id
// @access Private

const removeVehicle = async(req,res,next)=>{
    const {vehicle_id} = req.params.v_id;
    const user = req.user;
    try{
        const vehicle = await Vehicle.findOne({_id:vehicle_id,owner_id:user._id});
        if(!vehicle){
            res.status(404);
            res.json({status:"failed",msg:"Vehicle not found"});
            return;
        }
        
        await vehicle.deleteOne({_id:vehicle_id});
        res.status(200).json({status:"success", msg:"Vehicle deleted successfully"});
        
    }catch(err){
        next(createError(400,"Deleting vehicle failed"));
    }
};

// @desc get vehicles for a specific user
// @route PUT /api/user/owner/vehicle/:v_id
// @access Private

const editVehicle = async(req,res,next)=>{

};

// @desc get vehicles for a specific user
// @route POST /api/user/owner/change_status
// @access Private
const changeStatus = async(req,res,next)=>{};

// @desc get vehicles for a specific user
// @route POST /api/user/owner/withdraw
// @access Private
const requestWithdraw = async(req,res,next)=>{

};

// @desc get vehicles for a specific user
// @route POST /api/user/owner/add_bank
// @access Private
const addBank = async(req,res,next)=>{};

// @desc get driver for a specific vehicle
// @route GET /api/user/owner/vehicle/driver/:d_id
// @access Private

const getDriverDetails = async(req,res,next)=>{

}

// @desc get supervisor for a specific vehicle
// @route GET /api/user/owner/vehicle/supervisor/:s_id
// @access Private
const getSupervisorDetails = async(req,res,next)=>{

}

module.exports = {assignDriver, assignSupervisor,getVehicles, getVehicle ,
    addVehicleRequest,getRequests, removeVehicle, editVehicle, changeStatus, requestWithdraw, addBank, getDriverDetails, getSupervisorDetails};