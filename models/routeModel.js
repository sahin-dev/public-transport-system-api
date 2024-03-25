const mongoose = require('mongoose');
const StopageClass = require('../classes/stopage');

const ConnectedStopageSchema = mongoose.Schema({
    destination:{
        type:mongoose.ObjectId,
        ref:"Stopage",
        required:true
    },
    length:{
        type:Number,
        required:true
    }
},{_id:false})

const StopageSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    connected_routes:{
        type:[ConnectedStopageSchema],
        default:[]
    }
},{timestamps:true})

const RouteSchema = new mongoose.Schema({
    name:{
        type:mongoose.ObjectId,
        ref:"Stopage",
        required:true
    },
    start:{
        type:mongoose.ObjectId,
        ref:"Stopage",
        required:true
    },
    end:{
        type:mongoose.ObjectId,
        ref:"Stopage",
        required:true
    },
    list:{
        type:[StopageSchema],
        required:true
    }
},{
    timestamps:true
})

const Stopage = mongoose.model("Stopage",StopageSchema);

const Route = mongoose.model("Route", RouteSchema);


module.exports = {Route,Stopage};