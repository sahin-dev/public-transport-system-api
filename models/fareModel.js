const mongoose = require('mongoose');

const fareSchema = new mongoose.Schema({
    passenger:{
        type:Object,
        required:true,
    },
    vehicle:{
        type:Object,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    fare_date:{
        type:Date,
        required:true
    },
    start_stopage:{
        type:String,
        required:true,
    },
    stop_stopage:{
        type:String,
        required:true
    }
},{
    timestamps:true
})