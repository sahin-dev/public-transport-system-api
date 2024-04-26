
const User = require('../models/userModel')
const createError = require('http-errors');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Wallet = require('../models/walletModel');
const Vehicle = require('../models/vehicleModel');
const Ticket = require('../models/ticketModel');
const Request = require('../models/requestModel');
const getTicketUID = require('../utils/ticketUID');

const {DRIVIER_ADDITION_REQUEST, SUPERVISOR_ADDITION_REQUEST} = require('../utils/constants')

const getUser =  async(req,res,next)=>{
    res.json(req.user);
}

// @desc    Log in user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async(req,res,next)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email}).populate('wallet',['-user','-_id']);

    if(user && (await user.matchPassword(password))){
        res.json(
            {
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                wallet:user.wallet,
                token:generateToken(user._id)});
    }else{
        res.status(401);
        res.json({status:"failed",msg:"Invalid email or password"})
    }
}


// @desc Register a user
// @route POST /api/users
// @access Public
const registerUser = async(req,res,next)=>{
    const {name,email,phone,password,nid,dob, occupation,role} = req.body;
    console.log("Registration called!")
    const existUser = await User.findOne({email});
    const phoneUsed = await User.findOne({phone});
    
    if(existUser || phoneUsed){
        next(createError(409, `User already exist with same email or phone`));
        return;
    }
    try{
        const wallet = await Wallet.create({});
        const user = await User.create({name,email,phone,password,nid,birth_date:Date(dob),wallet, occupation,role});
        wallet.user = user._id;
        await wallet.save();
        res.status(200).json({msg:"User created successfully"});
    }
    catch(err){
        res.status(500).json({msg:`User creation failed! : ${err.message}`});
    }
   
}


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wallet',['-user','-_id'])
  
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        occupation:user.occupation,
        role:user.role,
        wallet:user.wallet,
        phone:user.phone,
        nid:user.nid,
        dob:user.dob,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
  
  // @desc    Update user profile
  // @route   PUT /api/users/profile
  // @access  Private
  const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
  
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = req.body.password
      }
  
      const updatedUser = await user.save()
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
  
  // @desc    Get all users
  // @route   GET /api/users
  // @access  Private/Admin
  const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
  })

  // @desh    Get all user with driver role
  // @route   GET /api/users/drivers
  // @access  Private/Admin
  const getDrivers = asyncHandler(async(req,res)=>{

    const filter = {role:{$eq:'driver'}}

    const drivers = await User.find(filter)

    res.json(drivers)

  })
  
  // @desc    Delete user
  // @route   DELETE /api/users/:id
  // @access  Private/Admin
  const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
  
    if (user) {
      await user.remove()
      res.json({ message: 'User removed' })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
  
  // @desc    Get user by ID
  // @route   GET /api/users/:id
  // @access  Private/Admin
  const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
  
    if (user) {
      res.json(user)
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })
  
  // @desc    Update user
  // @route   PUT /api/users/:id
  // @access  Private/Admin
  const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
  
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      user.isAdmin = req.body.isAdmin
  
      const updatedUser = await user.save()
  
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  })


  //@desc Add amount to wallet after payment
  //@route POST /api/users/addmoney
  //@access Private

  const addMoney = async(req,res,next)=>{
    const {amount} = req.body
    const user = req.user
    try{
    const wallet = await Wallet.findById(user.wallet)
    wallet.amount+=amount
    await wallet.save()
    res.satus(200).json({msg:`${amount} added successfully`})
    }catch{
      res.status(500).jsno({msg:"Error occured to add money"})
    }

  }

  //@desc Get vehicle by unique id
  //@route GET api/users/vehicle/:uid
  //@access Private

  const getVehicleByUID = async(req,res,next)=>{
    const {uid} = req.params.uid;
    try{
      const vehicle = await Vehicle.findOne({uniqueId:uid});
      if(! vehicle){
        throw new Error("Invalid vehicle uid");
      }
      if(vehicle.status == 'pending'){
        throw new Error("Vahicle is not active");
        
      }
      res.status(200);
      res.json({status:'success',msg:"Vehicle found!", data:vehicle});
    }catch(err){
      res.status(400);
      res.json({status:'failed',msg:`vehicle not found: ${err.message}`})
    }
  }

  //@desc Purchase a ticket
  //@route POST api/users/purchase
  //@access Private

  
const purchaseTicket = async(req,res,next)=>{
  const {source, destination,amount,vehicleuid} = req.body;
  const user = req.user;
  const ticketUID = getTicketUID();
  try{

    if( (!amount) || (!vehicleuid)|| (!source) || (!destination)  ){
      throw new Error('source, destination, amount and uid required')
    }
    

    const vehicle = await Vehicle.findOne({uniqueId:vehicleuid}).populate('owner');
    const owner_wallet = await Wallet.findOne({user:vehicle.owner._id});
    if(! vehicle){
      throw new Error('Vehicle not found');
    }
    const wallet = await Wallet.findOne({user:user._id});
    if(wallet.amount<Number(amount)){
      throw new Error("Insufficient amount");
    }
    wallet.amount-=Number(amount)||0;
    owner_wallet.amount+=Number(amount)||0;
    await wallet.save();
    const ticket = await Ticket.create({user:user._id,vehicle:vehicle._id, amount, source, destination,ticketUID});
    
    res.status(200);
    res.json({status:'success', msg:'Ticket purchased ', data:ticket})
  }catch(err){
    res.status(400);
    res.json({status:'failed', msg:`Purchase failed : ${err.message}`})
  }
}

//@desc Confirm supervisor request
//@route GET api/users/confirm/:reqid
//@access Public

  const confirmRequst = async(req,res,next)=>{
    const req_id= req.params.reqid;

    const request = await Request.findById(req_id);
    if(!request){
      res.status(404);
      res.json({status:'failed', msg:'Request not found'});
      return;
    }
    let body = request.body;

    if(request.type === SUPERVISOR_ADDITION_REQUEST){
      let vehicle = await Vehicle.findById(body.vehicle);
      let supervisor = await User.findById(body.supervisor);

      vehicle.supervisor = supervisor._id;
      supervisor.role = 'supervisor';
      supervisor = await supervisor.save();
      vehicle = await vehicle.save();

      const data = {
          supervisor_name:supervisor.name,
          supervisor_phone:supervisor.phone,
          supervisor_nid:supervisor.nid,
          trans_name:vehicle.name,
          trans_number:vehicle.number
          }

          res.redirect('localhost:5173/mailconfirmed');
    }
    if(request.type === DRIVIER_ADDITION_REQUEST){
      let vehicle = await Vehicle.findById(body.vehicle);
      let driver = await User.findById(body.driver);

      vehicle.driver = driver._id;
      driver.role = 'driver';
      driver = await driver.save();
      vehicle = await vehicle.save();

      const data = {
          driver_name:driver.name,
          driver_phone:driver.phone,
          driver_nid:driver.nid,
          trans_name:vehicle.name,
          trans_number:vehicle.number
          }

          res.redirect('localhost:5173/mailconfirmed');
    }
    
  }

  
//@desc Get the all transport
//@route GET api/users/vehicles
//@access Private

const getAllTransport = async(req,res,next)=>{
  const vehicles = await Vehicle.find({});
  res.json({status:'success', msg:'Vechicles fetched successfully', data:vehicles});
}

module.exports = {getUser,loginUser,registerUser, deleteUser,
   getUserById,getUserProfile,updateUserProfile,getUsers, updateUser,
    addMoney, purchaseTicket, getVehicleByUID, getAllTransport, confirmRequst};