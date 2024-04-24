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
        res.status(401);
        res.json({status:"failed", msg:`Not authorized, token failed ${err.message}`})
        return;
      }
  }
  res.status(401);
  res.json({status:"failed", msg:`Not authorized, no token`})
})

const admin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin')) {
    next()
  } else {
    next(createError(401,"Not authorized as an admin"));
  }
}

module.exports =  { protect, admin }