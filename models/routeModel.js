const mongoose = require('mongoose');
const StopageClass = require('../classes/stopage');

const RouteSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    list:{
        type:Object,
        required:true
    }
},{
    timestamps:true
})

const StopageSchema = new mongoose.Schema();
StopageSchema.loadClass(StopageClass);

const Route = mongoose.model("Route", RouteSchema);
const Stopage = mongoose.model("Stopage",StopageSchema);

module.exports = Route;