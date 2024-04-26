const Wallet = require('../models/walletModel')
const Vehicle = require('../models/vehicleModel')
const Ticket = require('../models/ticketModel');
const Request = require('../models/requestModel');
const User = require('../models/userModel');



  const getTicket = async(req,res,next)=>{
    const {ticketID} = req.body;
    //const user = req.user;
    const ticket = await Ticket.findById(ticketID);
    if(!ticket){
        res.status(400);
        res.json({status:'failed', msg:"Ticket not found"});
        return;
    }
    res.status(200);
    res.json({status:'success', msg:'Ticket found', data:ticket})

  }
//@desc Get all valid and unchecked tickets
//@route GET api/supervisor/tickets
//@access Private
  
  const getTickets = async(req,res,next)=>{
    const {ticketID} = req.body;
    //const user = req.user;
    const tickets = await Ticket.find({checked:false});
    if(tickets.length == 0){
        res.status(200);
        res.json({status:'success', msg:'No tickets found'});
        return;
    }
    res.status(200);
    res.json({status:'success', msg:'Tickets fetched successfully', data:tickets})

  }

  const getTicketByPhone = async(req,res,next)=>{
    const {phone, v_id} = req.body;
    const supervisor = req.user;
    try{
        const user = await User.findOne({phone})
        const tickets = await Ticket.find({user:user._id,vehicle:v_id});
        
        let validTicket = tickets.map(t=> t.valid_till<Date.now());

        res.status(200);
        res.json({status:'success', msg:'Tickets fetched successfully', data:validTicket});
    }catch(err){
        res.status(400);
        res.json({status:'failed', msg:'Ticket not found'});
    }

  }

  //@desc Get ticket by unique ticket number
  //@route GET api/supervisor/ticket/:uid
  //@access Private

  const getTicketByUID = async(req,res,next)=>{
    const {uid} = req.params;
    
    try{
        if(!uid){
            throw new Error("Invalid ticket uid")
        }
        const ticket = await Ticket.findOne({ticketUID:uid}).populate(['source','destination']);
        if(!ticket){
            throw new Error("Ticket not found");
        }
        
        res.status(200);
        res.json({status:'success', msg:"Ticket found", data:ticket})
    }catch(err){
        res.status(400);
        res.json({status:'failed', msg:err.message});
    }
  }

  //@desc Check ticket
  //@route POST api/supervisor/check
  //@access Private

  const checkTicket = async(req,res,next)=>{
    const {ticket_id} = req.body;

    try{
        const ticket = await Ticket.findById(ticket_id).populate('vehicle');
        if(ticket.checked || ticket.invalid){
            throw new Error("Ticket is invalid");
        }

        if(ticket.valid_till<=Date.now()){
            throw new Error("Ticket expird")
        }
        if(ticket.vehicle.supervisor != req.user._id){
          throw new Error("You are not authrized to check thc ticket");
        }

        ticket.checked = true;
        ticket.invalid = true;
        await ticket.save();
        res.status(200);
        res.json({status:'success', msg:'Ticket checked'});
        
    }catch(err){
        res.status(400);
        res.json({status:'failed', msg:`Ticket checking failed: ${err.message}`})
    }
  }

    //@desc Check ticket
  //@route GET api/supervisor/vehicle
  //@access Private

  const getMyVehicle = async(req,res,next)=>{
    const supervisor = req.user;
    const vehicle = await Vehicle.findOne({supervisor:supervisor._id}).populate('owner', 'driver');

    if(!vehicle){
      res.status(404);
      res.json({status:'failed', msg:'Vehicle not found'});
      return;
    }

    res.json({status:'success', msg:'Vehicle found', data:vehicle});

  }
  

  module.exports = {checkTicket, getTicketByUID,getTickets, getMyVehicle}