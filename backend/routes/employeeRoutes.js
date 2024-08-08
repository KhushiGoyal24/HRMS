const express=require("express");
const router=express.Router();
const Employee=require("../models/employeeModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();
const Leave=require("../models/leaveModel");



router.post("/login",async(req,res)=>{
    try{
        //fetch the data
        const {name,password}=req.body;
        //valid user
        if(!name || !password){
            return res.status(400).json({
                success:false,
                message:"please fill all the details carefully!",
            });
        }
         
        //check for registered user
        const user=await Employee.findOne({name});

        //if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered!",
            });
        }

        const payload={
            name:user.name,
            id:user._id,
        }

        //verify password and generate a JWT token
        if(await bcrypt.compare(password,user.password)){
            //password match
            let token=jwt.sign(payload,
                            process.env.JWT_SECRET,
                            {
                                expiresIn:"2h",
                            });
            // user=user.toObject();                
            user.token=token;
            user.password=undefined;

            let options={
                expires: new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User Logged In successfully!"
            });
            
        }else{
            //password do not match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect!",
            });
        }

    }catch(err){
        console.log(err);
        res.status(500)
        .json({
            success:false,
            data:"user can not be logged",
        })
    }
});

router.get("/details/:id", async(req,res)=>{
    try {
        const employees = await Employee.findById(req.params.id);
        if(!employees){
            return res.status(404).json({message:'Employee not found'});
        }
        res.json(employees);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

router.post('/add_leave', async(req,res) => {
    try {
        const {empid, reason ,fromDate, toDate} = req.body;
        const leaveDetails = {
            empid, reason, fromDate, toDate
        };
        console.log(leaveDetails);
        const leave = (await Leave.create(leaveDetails));
        const addToUser = await Employee.updateOne({_id: empid},{ $push: { leaves: leave._id} });
        return res.status(200).json({
            success:true,
            message:'Leave Created Successfully',
            leave,
            addToUser
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'Leave Creation Failed',
        });
    }
  })

  router.delete('/delete_leave', async(req,res) => {
    try {
        const {empid, leaveId} = req.body;
        const leave = await Leave.findByIdAndDelete({_id:leaveId});
        const removeToUser = await Employee.updateOne({_id: empid},{ $pull: { leaves: leaveId} })
        return res.status(200).json({
            success:true,
            message:'Leave Deleted Successfully',
            leave,
            removeToUser
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'Leave Deletion Failed',
        });
    }
  })

  router.get('/get_my_leave/:id', async(req,res) => {
    try {
        const {id} = req.params;
        const leaves = await Leave.find({empid:id}).sort({createdAt: -1});
        return res.status(200).json({
            success:true,
            leaves
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
        });
    }
  })




router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
})

module.exports=router;