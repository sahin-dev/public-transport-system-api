const mongoose = require( "mongoose");
const {PASSENGER} = require('../utils/constants');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone:{
        type:String,
        required:true,
        unique:true
      },
      password: {
        type: String,
        required: true,
      },
      nid:{
        type:String,
        required:true,
      },
      occupation:{
        type:String,
        required:true
      },
      wallet:{
        type:mongoose.ObjectId,
        ref:"Wallet",
        required:true,
      },
      birth_date:{
        type:Date,
        required:true,
      },
      role:{
        type:String,
        enum:["admin","passenger","owner","driver","supervisor"],
        default:"passenger"
      }
    },
    {
      timestamps: true,
    }
  )

  // userSchema.path('objectId').get(v=>v.toString());

  userSchema.methods.matchPassword =  async function (enteredPassword) {
    return  await bcrypt.compare(enteredPassword, this.password);
  }
  
  userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next()
    }
  
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  })

const User = mongoose.model('User', userSchema);
module.exports= User;