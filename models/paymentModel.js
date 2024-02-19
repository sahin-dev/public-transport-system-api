
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    trans_id:{
        type:String,
        required:true
    },
    trans_date:{
        type:Date,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    trans_method:{
        type:String,
        required:true
    }
})