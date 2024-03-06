var express = require('express');
var router = express.Router();
const Payment = require('../models/paymentModel')

/* GET home page. */
router.get('/', async(req, res, next)=>{
  
  res.send("Welcome to Transport System API!");
});

module.exports = router;
