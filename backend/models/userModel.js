//import mongoose
const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const userModel=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    role:{
        type:String,
        required:true,
    },

    email:{
        type:String,
        required:true,
    },

    password:{
        type:String,
        required:true,
    },
},
{
    timeStamp:true,
}

);


//export
module.exports=mongoose.model("User",userModel);
