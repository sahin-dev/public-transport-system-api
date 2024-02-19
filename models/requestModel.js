const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.ObjectId,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    body:{
        type:Object,
        required:true
    },
    isResolved:{
        type:Boolean,
        required:true,
        default:false
    }
},{
    timestamps:true
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;