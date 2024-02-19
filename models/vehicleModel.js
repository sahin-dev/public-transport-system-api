
const mongoose = require('mongoose');


const vehicleSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    desc:{
        type:String
    },
    type:{
        type:String,
        required:true
    },

    number:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:"Pending"
    },
    owner_id:{
        type:mongoose.ObjectId,
        required:true,
    },
    route:{
        type:Object,
        required:true,
    },
    supervisor_id:{
        type:mongoose.ObjectId,
        required:false,
    },
    driver_id:{
        type:mongoose.ObjectId,
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
// vehicleSchema.pre('save',function(next){
//     if(!this.isModified('name')){
//         next();
//     }
//     this.name = this.name+"-"+this.number;
// });

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;