//import mongoose
const mongoose = require("mongoose");

const employeeModel=mongoose.Schema({
    name:{
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


    address:{
        type:String,
        required:true,
    },

    salary:{
        type:Number,
        required:true,
    },

    hireDate:{
        type:Date,
        default:Date.now()
    },

    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    
},
{
    timeStamp:true,
}

);


//export
module.exports=mongoose.model("Employee",employeeModel);
