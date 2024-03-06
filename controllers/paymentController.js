
const SSLCommerzPayment = require('sslcommerz-lts')
const Payment = require('../models/paymentModel')
const User = require('../models/userModel')
require('dotenv').config()

const store_id = process.env.STORE_ID
const store_passwd = process.env.STORE_PASS
const is_live = false 
const port = process.env.PORT

const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)

const initPayment = (req,res,next)=>{
    const {amount = 1000,c_name = "Sahin",c_email = 'sahin@gmail.com',c_phone='01621839863'} = req.body
    const data = {
        total_amount: amount,
        currency: 'BDT',
        tran_id: 'REF123', 
        success_url: `http://localhost:${port}/api/payment/success`,
        fail_url: `http://localhost:${port}/api/payment/fail`,
        cancel_url: `http://localhost:${port}/api/payment/cancel`,
        ipn_url: `http://localhost:${port}/api/payment/ipn`,
        shipping_method: 'Courier',
        product_name: 'Computer.',
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
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    }

    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        console.log(apiResponse)
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.redirect(GatewayPageURL)
        console.log('Redirecting to: ', GatewayPageURL)
    });
}


//sslcommerz init
// app.get('/init', (req, res) => {
//     const data = {
//         total_amount: 100,
//         currency: 'BDT',
//         tran_id: 'REF123', 
//         success_url: 'http://localhost:3030/success',
//         fail_url: 'http://localhost:3030/fail',
//         cancel_url: 'http://localhost:3030/cancel',
//         ipn_url: 'http://localhost:3030/ipn',
//         shipping_method: 'Courier',
//         product_name: 'Computer.',
//         product_category: 'Electronic',
//         product_profile: 'general',
//         cus_name: 'Customer Name',
//         cus_email: 'customer@example.com',
//         cus_add1: 'Dhaka',
//         cus_add2: 'Dhaka',
//         cus_city: 'Dhaka',
//         cus_state: 'Dhaka',
//         cus_postcode: '1000',
//         cus_country: 'Bangladesh',
//         cus_phone: '01711111111',
//         cus_fax: '01711111111',
//         ship_name: 'Customer Name',
//         ship_add1: 'Dhaka',
//         ship_add2: 'Dhaka',
//         ship_city: 'Dhaka',
//         ship_state: 'Dhaka',
//         ship_postcode: 1000,
//         ship_country: 'Bangladesh',
//     };
//     const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
//     sslcz.init(data).then(apiResponse => {
//         // Redirect the user to payment gateway
//         let GatewayPageURL = apiResponse.GatewayPageURL
//         res.redirect(GatewayPageURL)
//         console.log('Redirecting to: ', GatewayPageURL)
//     });
// })

const IPN = (req,res,next)=>{
    res.json({msg:"IPN called"})
}

//
const paymentSuccess = async (req,res,next)=>{
    const {val_id} = req.body

    const {status,tran_date,tran_id,amount,card_type} = await sslcz.validate({val_id})

    await Payment.create({user:req.user,tran_id,amount,tran_date,card_type})
    if(status === 'VALID'){
        res.json({msg:'Payment Success',amount,tran_id})
        return
    }
    res.status(500).jsno({mag:"Payment Invalid"})
    
}

const paymentFail =(req,res)=>{
    res.json({msg:'Payment Fail'})
}


const paymentCancel =(req,res)=>{
    res.json({msg:'Payment Cancel'})
}

module.exports = {initPayment,paymentCancel,paymentSuccess, paymentFail,IPN}