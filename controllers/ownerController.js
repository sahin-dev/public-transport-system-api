
const User = require('../models/userModel');
const Vehicle = require('../models/vehicleModel');
const Request = require('../models/requestModel');
const Wallet = require('../models/walletModel');

const {WITHDRAW_REQUEST, VEHICLE_ADDITION_REQUEST, SUPERVISOR_ADDITION_REQUEST, DRIVIER_ADDITION_REQUEST} = require('../utils/constants');
const createError = require('http-errors');
const mailSender = require('../service/mail');


// @desc assign driver for specific vehicle
// @route POST /api/user/owner/assign_driver
// @access Private

const assignDriver = async(req,res,next)=>{
    const { email,vehicle_id} = req.body;
    const user = req.user;
    try{
        let driver = await User.findOne({email}).select("-password");
        let vehicle = await Vehicle.findOne({_id:vehicle_id,owner:user._id});

        if(!vehicle){
            res.status(404).json({status:'failed',msg:"Sorry! Vehicle not found"});
            return;
        }
        if(!driver){
            res.status(404).json({status:'failed',msg:"Sorry! Driver not found"});
            return;
        }

        if(vehicle.driver){
            res.status(403);//403 - already exists
            res.json({status:"failed", msg: "Driver already added!"});
            return;
        }

        if(vehicle.status === 'pending'){
            res.status(400);
            res.json({status:"failed",msg:"Vehicle is not active!"});
            return;
        }
        const request = await Request.create({user:req.user._id,type:DRIVIER_ADDITION_REQUEST, body:{
            driver:driver._id,
            vehicle:vehicle._id,
        }});
        mailSender(driver.email, "Confirm to join as a driver", `You are appointed as driver for this following vehicle.\n Name:  ${vehicle.name}\n Number: ${vehicle.number}.
        To join click on the link:  http://localhost:3000/api/users/confirm/${request._id}\n`);

       
        res.status(200).json({status:"success",msg:"Email sent to driver for confirmation"});
       
    }catch(err){
        res.status(400);
        res.json({status:"failed", msg:`Assign driver failed : ${err.message}`})
    }
};

// @desc assign supervisor for specific vehicle
// @route POST /api/user/owner/assign_supervisor
// @access Private

const assignSupervisor = async(req,res,next)=>{
    const {email,vehicle_id} = req.body;
    const user = req.user;
    try{
        let supervisor = await User.findOne({email}).select('-password');
        let vehicle = await Vehicle.findOne({_id:vehicle_id,owner:user._id});

        
        if(!vehicle){
            res.status(404).json({status:'failed',msg:"Sorry! Vehicle not found"});
            return;
        }
        if(!supervisor){
            res.status(404).json({status:'failed',msg:"Sorry! Supervisor not found"});
            return;
        }

        if(vehicle.supervisor){
            res.status(403);//403 - already exists
            res.json({status:"failed", msg: "Supervisor already added!"});
            return;
        }

        if(vehicle.status === 'pending'){
            res.status(400);
            res.json({status:"failed",msg:"Vehicle is not active!"});
            return;
        }
        const request = await Request.create({user:req.user._id,type:SUPERVISOR_ADDITION_REQUEST, body:{
            supervisor:supervisor._id,
            vehicle:vehicle._id,
        }});
        mailSender(supervisor.email, "Confirm to join as a supervisor", `You are appointed as supervisor for this following vehicle.\n Name:  ${vehicle.name}\n Number: ${vehicle.number}.
        To join click on the link:  http://localhost:3000/api/users/confirm/${request._id}\n`);

       
        res.status(200).json({status:"success",msg:"Email sent to supervisor for confirmation"});
        
    }catch(err){
        res.status(400);
        res.json({status:"failed", msg:`Assign supervisor failed : ${err.message}`})
    }
};

// @desc get vehicles for a specific user
// @route GET /api/user/owner/vehicles
// @access Private

const getVehicles = async(req,res,next)=>{
    try{
        const vehicles = await Vehicle.find({'owner':req.user._id}).select(['-owner']);
        res.status(200);
        res.json({status:"success",msg:"Vehicles fetched successfully",data:vehicles});
    }catch(err){
        res.status(400);
        res.json({status:"failed", msg:`Vehicles fetched failed : ${err.message}`})
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
        res.json({status:"failed", msg:`Vehicle fetched failed : ${err.message}`})
    }
    
};

// @desc get  a single vehicle for a specific user
// @route GET /api/user/owner/vehicles/:status
// @access Private

const getVehiclesByStatus = async(req,res,next)=>{
    const status = req.params.status;
    try{
        const vehicles = await Vehicle.find({'owner':req.user._id,status});
        res.status(200);
        res.json({status:"success",msg:"Vehicle fetched successfully",data:vehicles});

    }catch(err){
        res.status(400);
        res.json({status:"failed", msg:`Vehicle fetched failed : ${err.message}`})
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
        
        const request = await Request.create({user:user._id,type:VEHICLE_ADDITION_REQUEST,body:req.body});
        const vehicle = await Vehicle.create({name,desc,type,number,owner:user._id,route});
        
        res.status(200);
        res.json({status:"success",msg:"Request submitted successfully",data:vehicle});
        
    }catch(err){
        res.status(400);
        res.json({status:"failed", msg:`Vehicle addition failed: ${err.message}`})
    }
};

// @desh get submitted requests for a user
// @route GET /api/user/owner/requests
// @access Private

const getRequests = async(req,res,next)=>{
    try{
        const requests = await Request.find({"user":req.user._id}).populate('user',['name','-_id','email','phone']);
        res.status(200).json({status:"success",msg:"Requests fetched successfully",data:requests});
    }catch(err){
        res.status(500);
        res.json({status:"failed", msg:`Request fetching failed: ${err.message}`})
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
        res.status(400);
        res.json({status:'failed',msg:`Deleting vehicle failed : ${err.message}`})
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
    const {amount, bank_name,bank_branch, bank_acc} = req.body;
   if( (!amount) || (amount<=0)){
        res.status(400);
        res.json({status:'failed', msg:'provided amount is invalid'});
        return;
   }
   const wallet = await Wallet.findOne({user:req.user._id});
   if(wallet.amount < Number(amount)){
        res.status(400);
        res.json({status:'failed', msg:'Insufficient balance'});
        return;
   }
   wallet.amount-=Number(amount);
   let body = {amount,bank_name, bank_branch, bank_acc};
   const request= await Request.create({user:req.user, type:WITHDRAW_REQUEST, body});

   res.json({status:'success', msg:'Request submitted successfully'});
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

module.exports = {assignDriver, assignSupervisor,getVehicles, getVehicle ,getVehiclesByStatus,
    addVehicleRequest,getRequests, removeVehicle, editVehicle, changeStatus, requestWithdraw, addBank, getDriverDetails, getSupervisorDetails};