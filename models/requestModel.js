const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    user:{
        type:mongoose.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:Number,
        required:true
    },
    body:{
        type:Object,
        required:true
    },
    status:{
        type:String,
        default:"pending",
        enum:['pending','accepted', 'declined']
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