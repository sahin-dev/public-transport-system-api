
const User = require('../models/userModel')
const createError = require('http-errors');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');

const getUser =  async(req,res,next)=>{
    res.json(req.user);
}

// @desc    Log in user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async(req,res,next)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user && user.matchPassword(password)){
        res.json(
            {
                id:user._id,
                name:user.name,
                email:user.email,
                occupation:user.occupation,
                role:user.role,
                phone:user.phone,
                nid:user.nid,
                dob:user.dob,
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

    const existUser = await User.findOne({email});
    const phoneUsed = await User.findOne({phone});
    
    if(existUser || phoneUsed){
        next(createError(409, `User already exist with same email or phone`));
        return;
    }
    try{
        const user = await User.create({name,email,phone,password,nid,birth_date:Date(dob), occupation,role});
        res.json(user);
    }
    catch(err){
        res.status(500).json({msg:"User creation failed!"});
    }
   
}
module.exports = {getUser,loginUser,registerUser};