//import mongoose
const mongoose = require("mongoose");

const categoryAdmin=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
},
{
    timeStamp:true,

}
);

//export
module.exports=mongoose.model("Category",categoryAdmin);

