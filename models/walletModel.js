const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    
    amount:{
        type:Number,
        required:true,
        default:0.00
    },

}, {timestamps:true});

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;