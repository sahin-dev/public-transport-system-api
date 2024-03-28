const mongoose = require('mongoose');


const TicketSchema = new mongoose.Schema({
    user:{
        type:mongoose.ObjectId,
        ref:"User",
        required:true
    },
    vehicle:{
        type:mongoose.ObjectId,
        ref:'Vehicle',
        required:true
    },
    purchase_date:{
        type:Date,
        default:Date.now()
    },
    amount:{
        type:Number,
        require:true
    },
    source:{
        type:mongoose.ObjectId,
        ref:'Stopage',
        required:true
    },
    destination:{
        type:mongoose.ObjectId,
        ref:'Stopage',
        required:true
    },
    ticketUID:{
        type:String,
        required:true
    },
    valid_till:{
        type:Date,
        required:false
    },
    checked:{
        type:Boolean,
        default:false
    },
    invalid:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

TicketSchema.pre('save', function (next){
    if( !this.isModified('purchase_date')){
        next();
    }
    // let date = this.purchase_date;
    // date.setDate(date.getDate()+1);
    this.valid_till = new Date(this.purchase_date);
    this.valid_till.setDate(this.valid_till.getDate()+1);
})

const Ticket = mongoose.model('Ticket',TicketSchema);

module.exports = Ticket