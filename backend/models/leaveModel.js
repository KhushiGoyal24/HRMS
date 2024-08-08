//import mongoose
const mongoose = require("mongoose");

const leaveModel=mongoose.Schema({
    empid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    },
    reason:{
        type:String,
        required:true
    },
    fromDate:{
        type:Date,
        required:true
    },
    toDate:{
        type:Date,
        required:true
    },
    accepted:{
        type:Boolean,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});


//export
module.exports=mongoose.model("Leave",leaveModel);
