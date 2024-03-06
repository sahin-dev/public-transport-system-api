const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');
const routeRouter = require('./routes/routeRouter');
const passengerRouter = require('./routes/passengerRouter');
const ownerRouter =require('./routes/ownerRouter');
const adminRouter = require('./routes/adminRouter');
const paymentRouter = require('./routes/paymentRouter')
const connectDb = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

var debug = require('debug')('server');
connectDb();

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use('/api/users', userRouter);
app.use('/api/routes',routeRouter);
app.use('/api/passengers',passengerRouter);
app.use('/api/user/owner',ownerRouter);
app.use('/api/admin',adminRouter);
app.use('/api/payment',paymentRouter);
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(res.statusCode || 500);
  res.json({path:req.url,msg:err.message});
});

module.exports = app;
