
const User = require('../models/userModel')
const createError = require('http-errors');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Wallet = require('../models/walletModel');
const Vehicle = require('../models/vehicleModel');

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
        next(createError(401,"Invalid email or password"));
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

  const pay = async(req,res,next)=>{
    const {amount,uniqueId} = req.body;
    const user = req.user;
    const vehicle = await Vehicle.find({uniqueId});

  }


module.exports = {getUser,loginUser,registerUser, deleteUser,
   getUserById,getUserProfile,updateUserProfile,getUsers, updateUser,
    addMoney};