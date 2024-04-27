
const Request = require('../models/requestModel');
const Vehicle = require('../models/vehicleModel');
const User = require('../models/userModel');
const Ticket = require('../models/ticketModel')
const {Stopage} = require('../models/routeModel')
const mailSender = require('../service/mail');

const {VEHICLE_ADDITION_REQUEST, WITHDRAW_REQUEST} = require('../utils/constants')


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

//@desc Get requests by type
//@route GET api/admin/requests/:type
//@access Private

const getRequestsByType = async(req,res,next)=>{
    const t = req.params.type;
    const requests = await Request.find({type:Number(t)}).populate('user');

    res.json({status:'success', msg:'Requests fetched successfully', data:requests});
}

//@desc Get a Request
//@route GET api/admin/request
//@access Private/Admin

const getRequest = async(req,res,next)=>{
    const {req_id} = req.body;

    try{
        const request = await Request.findById(req_id);
        if(!request){
            throw new Error("Request not found");
        }

        res.json({status:'success', msg:'Request found', data:request});
    }catch(err){
        res.status(400);
        res.json({status:'success', msg:'Request not found'});
    }
}

//@desc Resolve a request
//@route UPDATE api/admin/request
//@access Private/Admin

const resolveRequest = async(req,res,next)=>{
    const {req_id, status} = req.body;
    try{
        const request = await Request.findById(req_id).populate('user');
        if(!request){
            throw new Error("Request not found!");
        }
        if(request.type === process.env.VEHICLE_ADDITION_REQUEST){
            const vehicle = await Vehicle.findOne({number: request.body.number});
            vehicle.status = 'active';
            await vehicle.save();
        }
        request.isResolved = true;
        request.status = status;
        await request.save();
        let text = `Your request is ${status}.\n Thank you`;
        if(request.type === process.env.VEHICLE_ADDITION_REQUEST)
            text = `Your vehcile with BRTA number ${request.body.number} is ${status}.\n Thank you`;
        mailSender(request.user.email, `Request is ${status}`, text);
        res.json({status:'success', msg:'Request resolved'});
    }catch(err){
        res.status(400);
        res.json({status:'success', msg:'Request not found'});
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
        if(vehicle.owner.email)
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

//@desc Get the all transport
//@route POST api/admin/vehicles
//@access Private/admin

const getAllTransportByStatus = async(req,res,next)=>{
    const {status} = req.body;
    const vehicles = await Vehicle.find({status});
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


//@desc Get all tickets 
//@route GET api/admin/tickets
//@access Private/Admin

const getTickets = async(req,res,next)=>{
    const tickets = await Ticket.find({}).populate('user', 'vehicle');
    res.json({status:'success', msg:'Tickets fetched successfully', count:tickets.length, data:tickets})
}

//@desc Get a ticket by UID
//@route GET api/admin/ticket/:uid
//@access Private/Admin

const getTicketByUID = async(req,res,next)=>{
    const uid = req.params.uid;
    const ticket = await Ticket.findOne({ticketUID:uid}).populate('user', 'vehicle');
    if(ticket){
        res.json({status:'success',msg:'Ticket found', data:ticket});
        return;
    }
    res.status(404);
    res.json({status:'failed', msg:'Ticket not found!'});
}

module.exports = {getRequestsByResolve, approveTransport, getAllTransport, getTicketByUID, getTickets,
    getAllUsers, addStopage, addRoute, resolveRequest, 
    getRequest, getAllTransportByStatus, getRequestsByType}