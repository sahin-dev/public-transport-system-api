
const SSLCommerzPayment = require('sslcommerz-lts')
const Payment = require('../models/paymentModel')
const User = require('../models/userModel')
const Wallet = require('../models/walletModel')
const generateId = require('randomstring')
require('dotenv').config()

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASS
const is_live = false 
const port = process.env.PORT

const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)

const tran_id = generateId.generate({length:8,charset:'hex',capitalization:'uppercase'})

//@desc Initiate Payment
//@route POST api/payment
//@access Private
const initPayment = (req,res,next)=>{
    const {amount = 1000,c_name = "Sahin",c_email = 'sahin@gmail.com',c_phone='01621839863'} = req.body
    const data = {
        total_amount: amount,
        currency: 'BDT',
        tran_id, 
        success_url: `http://localhost:${port}/api/payment/success`,
        fail_url: `http://localhost:${port}/api/payment/fail`,
        cancel_url: `http://localhost:${port}/api/payment/cancel`,
        ipn_url: `http://localhost:${port}/api/payment/ipn`,
        shipping_method: 'online',
        product_name: 'add_fare.',
        product_category: 'fare',
        product_profile: 'general',
        cus_name: c_name,
        cus_email: c_email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: c_phone,
        cus_fax: '01711111111',
        ship_name: c_name,
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    }

    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        //res.setHeader('Access-Control-Allow-Origin', "*")
        res.redirect(GatewayPageURL)
        console.log('Redirecting to: ', GatewayPageURL)
    });
}


const IPN = (req,res,next)=>{
    res.json({msg:"IPN called"})
}

//
const paymentSuccess = async (req,res,next)=>{
    
    const {val_id} = req.body
    try{
        const {status,tran_date,tran_id,amount,card_type} = await sslcz.validate({val_id})

        if(status === 'VALID'){
            await Payment.create({user:req.user,tran_id,amount,tran_date,card_type})
            let wallet = await Wallet.findOne({'user':req.user._id});
            wallet.amount+=amount;
            await wallet.save();
            res.json({msg:'Payment Success',amount,tran_id})
            return
        }else{
            res.status(500).jsno({msg:`Payment Invalid`})
        }
    }catch(err){
        res.status(500).jsno({msg:`Payment Invalid : ${err.message}`})
    } 
    
}

const paymentFail =(req,res)=>{
    res.json({msg:'Payment Fail'})
}


const paymentCancel =(req,res)=>{
    res.json({msg:'Payment Cancel'})
}

module.exports = {initPayment,paymentCancel,paymentSuccess, paymentFail,IPN}