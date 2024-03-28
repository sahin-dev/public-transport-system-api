// const Wallet = require('../models/walletModel')
// const Vehicle = require('../models/vehicleModel')
// const Ticket = require('../models/ticketModel');
// const User = require('../models/userModel');



//   const getTicket = async(req,res,next)=>{
//     const {ticketID} = req.body;
//     //const user = req.user;
//     const ticket = await Ticket.findById(ticketID);
//     if(!ticket){
//         res.status(400);
//         res.json({status:'failed', msg:"Ticket not found"});
//         return;
//     }
//     res.status(200);
//     res.json({status:'success', msg:'Ticket found', data:ticket})

//   }

//   const getTicketByPhone = async(req,res,next)=>{
//     const {phone, v_id} = req.body;
//     const supervisor = req.user;
//     try{
//         const user = await User.findOne({phone})
//         const tickets = await Ticket.find({user:user._id,vehicle:v_id});
        
//         let validTicket = tickets.map(t=> t.purchase_date<t.valid_till);

//         res.status(200);
//         res.json({status:'success', msg:'Tickets fetched successfully', data:validTicket});
//     }catch(err){
//         res.status(400);
//         res.json({status:'failed', msg:'Ticket not found'});
//     }

//   }

//   const getTicketByUID = async(req,res,next)=>{
//     const {ticketUID} = req.body;
//     try{
//         const ticket = Ticket.findOne({ticketUID});
//         if(! ticket){
//             throw new Error("Ticket not found");
//         }
//         res.status(200);
//         res.json({status:'success', msg:"Ticet found", data:ticket})
//     }catch(err){
//         res.status(400);
//         res.json({status:'failed', msg:err.message});
//     }
//   }

//   const checkTicket = async(req,res,next)=>{
//     const {ticket_id} = req.body;

//     try{
//         const ticket = await Ticket.findById(ticket_id);
//         if(ticket.checked || ticket.invalid){
//             throw new Error("Ticket is invalid");
//         }

//         if(ticket.purchase_date>ticket.valid_till){
//             throw new Error("Ticket expird")
//         }

//         ticket.checked = true;
//         ticket.invalid = true;
//         await ticket.save();
//         res.status(200);
//         res.json({status:'success', msg:'Ticket checked'});
        
//     }catch(err){
//         res.status(400);
//         res.json({status:'failed', msg:`Ticket checking failed: ${err.message}`})
//     }
//   }

//   module.exports = {}