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
        type:Object,
        required:false,
      },
      birth_date:{
        type:Date,
        required:true,
      },
      role:{
        type:String,
        required:true,
        default:PASSENGER
      },
      isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  )
  userSchema.methods.matchPassword =  async function (enteredPassword){
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