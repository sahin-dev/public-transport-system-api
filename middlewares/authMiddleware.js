const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const  User = require ('../models/userModel.js');
const createError = require('http-errors');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if(req.headers.secret && req.headers.secert !== ''){
      try{
          token = req.headers.secret;
          const user = jwt.verify(token, process.env.SECRET_KEY);
          req.user = await User.findById(user.id).select('-password');
          next();
          return;
      }catch(err){
          next(createError(401,"Not authorized, token failed"));
         return;
      }
  }
  next(createError(401,"Not authorized, no token"));
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    next(createError(401,"Not authorized as an admin"));
  }
}

module.exports =  { protect, admin }