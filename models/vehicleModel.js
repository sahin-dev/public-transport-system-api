
const mongoose = require('mongoose');


const vehicleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    uniqueId:{
        type:String,
        required:false
    },
    desc:{
        type:String
    },
    type:{
        type:String,
        required:true
    },

    number:{  //number structure DHAKA-D-11-9999
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"pending",
        enum:['pending','active']
    },
    owner:{
        type:mongoose.ObjectId,
        ref:'User',
        required:true,
    },
    route:{
        type:Object,
        required:true,
    },
    supervisor:{
        type:mongoose.ObjectId,
        ref:'User',
        required:false,
    },
    driver:{
        type:mongoose.ObjectId,
        ref:'User',
        required:false,
    },
},
{
    timestamps:true
}
)

vehicleSchema.methods.getRoute = function(){
    return this.route;
}
vehicleSchema.pre('save',function(next){
    if(!this.isModified('number')){
        next();
    }
    let parts = this.number.split('-');
    this.uniqueId = parts[1]+parts[2]+parts[3];
    next();
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;