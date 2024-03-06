
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    user:{
        type:mongoose.ObjectId,
        ref:"User",
        required:true
    },
    tran_id:{
        type:String,
        required:true
    },
    tran_date:{
        type:Date,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    card_type:{
        type:String,
        required:true
    }
})

const Payment = mongoose.model('Payment',paymentSchema)
module.exports = Payment