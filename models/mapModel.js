const mongoose = require('mongoose');
const Stopage = require('../classes/stopage');

const mapSchema = new mongoose.Schema({
    source:{
        type:mongoose.ObjectId,
        ref:"Stopage",
        requird:true
    },
    destination:{
        type:mongoose.ObjectId,
        ref:"Stopage",
        required:true
    },
    length:{
        type:Number,
        required:true
    }
},{
    timestamps:true
})

mapSchema.methods.addEdge = async function (src,dest,length){
    let s1 = await Stopage.find({name:src});
    let s2 = await Stopage.find({name:dest});
    if(s1 && s1){
        this.src = s1;
        this.dest = s2;
        this.length = length;
    }
}

const Map = mongoose.model("Map",mapSchema);
module.exports = Map;