
const User = require('../models/userModel');
const Vehicle = require("../models/vehicleModel");
const createError = require('http-errors');

const payFare = async(req,res,next)=>{
    const {vehicle_id,amount} = req.body;
    const vehicle  = await Vehicle.findById(vehicle_id);
    
}

const getPassengers = async(req,res,next)=>{
    try{
        const users = await User.find({});
        res.json(users);
    }catch(err){
        next(createError())
    }
    
}

module.exports = {payFare, getPassengers};

