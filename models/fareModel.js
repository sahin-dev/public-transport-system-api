const mongoose = require('mongoose');

const fareSchema = new mongoose.Schema({
    passenger:{
        type:mongoose.ObjectId,
        ref:"User",
        required:true,
    },
    vehicle:{
        type:mongoose.ObjectId,
        ref:"Vehicle",
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

const Fare = mongoose.model('Fare',fareSchema);
module.exports = Fare;