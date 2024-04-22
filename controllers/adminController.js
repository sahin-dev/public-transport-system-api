
const Request = require('../models/requestModel');
const Vehicle = require('../models/vehicleModel');
const User = require('../models/userModel');
const {Stopage} = require('../models/routeModel')
const mailSender = require('../service/mail')


//@desc Get requests based on resolve or not
//@route GET api/admin/requests
//@access Private/Admin

const getRequestsByResolve = async(req,res,next)=>{
    const {resolve} = req.body;
    try{
    if(!resolve){
        const requests = await Request.find({});
        res.json({status:'success', count:requests.length, data:requests});
        return;
    }else{
        const requests = await Request.find({isResolved:resolve});
        res.json({status:'success', count:requests.length, data:requests});
        return;
    }
    }catch(err){
        res.status(400);
        res.json({status:'failed',msg:'Request fetching failed!'});
    }
    
}

//@desc Approve a transport
//@route POST api/admin/vehicle/approve
//@access Private/Admin

const approveTransport = async(req,res,next)=>{
    const {vehicle_id} = req.body;

    try{
        const vehicle = await Vehicle.findById(vehicle_id).populate('owner');
        if(!vehicle){
            throw new Eror("Vehicle not found");
        }
        vehicle.status = 'active';
        await vehicle.save();
        //send a mail to the owner
        mailSender(vehicle.owner.email, "Vehicle activation!", `Your vehicle with BRTA number ${vehicle.number} is activated`);
        res.json({status:'success', msg:'Vehicle activate successfully', data:vehicle});
    }catch(err){
        res.status(404);
        res.json({status:'failed', msg:err.message});
    }
}

//@desc Get the all transport
//@route GET api/admin/vehicles
//@access Private/admin

const getAllTransport = async(req,res,next)=>{
    const vehicles = await Vehicle.find({});
    res.json({status:'success', msg:'Vechicles fetched successfully', data:vehicles});
}

//@desc Get the all users
//@route GET api/admin/users
//@access Private/Admin

const getAllUsers = async(req,res,next)=>{
    const users = await User.find({});
    res.json({status:'success', msg:'Users fetched successfully', data:users});
}

//@desc Add a stopage
//@route POST api/admin/stopage
//@access Private/Admin


const addStopage = async(req,res,next)=>{
    const {name} = req.body;
    const st = await Stopage.findOne({name});

    if(st){
        res.status(409);
        res.json({status:"failed",msg:"Stopage already created"});
        return;
    } 
    
    const stopage = await Stopage.create({name,connected_route:[]});
    if(!stopage){
        res.status(400);
        res.json({status:"failed",msg:"Stopage creation failed!"});
        return;
    }

    res.json({status:"success",msg:"Stopage created successfully", data:stopage})
}



//@desc Add route between stopages
//@route POST api/admin/route
//@access Private/Admin

const addRoute = async(req,res,next)=>{
    //source and destination is id of Stopage document in mongodb
    const {source,destination,length} = req.body;
    
    try{
        let s1 = await Stopage.findById(source);
        let s2 = await Stopage.findById(destination);
        if(!(s1 && s1)){
            throw new Error('Route addition failed')
        }
        
        s1.connected_routes.push({destination:source,length});
        s2.connected_routes.push({destination:destination,length});
        
        await s1.save();
        await s2.save();

        res.json({status:'success',msg:"Route added successfully",data:{source:s1,destination:s2}})
    }catch(err){
        res.status(400);
        res.json({status:"failed",msg:"Route addition failed",error:err.message})
    }
}


module.exports = {getRequestsByResolve, approveTransport, getAllTransport, 
    getAllUsers, addStopage, addRoute}