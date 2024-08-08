const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/userModel");
const Category=require("../models/categoryAdmin");
const Employee=require("../models/employeeModel");
const Leave=require("../models/leaveModel");

router.post("/adminLogin", async(req,res)=>{
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
        const user=await User.findOne({name});

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
            role:user.role,
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

router.post("/adminRegister", async(req,res)=>{
    try{
        //get data
        const {name,role,email,password}=req.body;

        //check if user already exist
        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"user already exist"
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in hashing Password",
            });
        }

        //create entry for user
        const user=await User.create({
            name,role,email,password:hashedPassword
        })

        return res.status(200).json({
            success:true,
            message:"user created successfully!"
        });

    }catch(err){
        console.log(err);
        res.status(500)
        .json({
            success:false,
            data:"user can not be registered,please try again later",
        })
    }
});

router.get("/getCategory",async(req,res)=>{
    const keyword=req.query.search
    ? {
        $or:[
            { name : { $regex : req.query.search , $options:"i" } },
        ],
    }
    :{};

    const users=await Category.find(keyword).find();
    res.send(users);
});

router.post("/addCategory",async(req,res)=>{
    try{
        const {name} =req.body;
        const existingCategory=await Category.findOne({name});

        if(existingCategory){
            return res.status(400).json({
                success:false,
                message:"Category already exist"
            });
        }

        const category=await Category.create({
            name
        })

        return res.status(200).json({
            success:true,
            message:"category created successfully!"
        });

    }catch(err){
        console.log(err);
        res.status(500)
        .json({
            success:false,
            data:"category can not be registered,please try again later",
        })
    }
});



// Add Employee Route
router.post("/addEmployee", async (req, res) => {
  try {
    // Get data from request body
    const { name, email, password, address, salary, hireDate, department } = req.body;

    // Check if user already exists
    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        Status: false,
        message: "Employee already exists"
      });
    }

    // Secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({
        Status: false,
        message: "Error in hashing password"
      });
    }

    // Check if department (category) exists
    const category = await Category.findById(department);
    if (!category) {
      return res.status(400).json({
        Status: false,
        message: "Invalid department"
      });
    }

    // Create entry for user
    const user = await Employee.create({
      name,
      email,
      password: hashedPassword,
      address,
      salary,
      hireDate,
      department
    });

    return res.status(200).json({
      Status: true,
      message: "Employee created successfully!",
      employee: user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      Status: false,
      message: "Employee cannot be registered, please try again later"
    });
  }
});



router.get("/getEmployee",async(req,res)=>{

    const users=await Employee.find({});
    res.send(users);
});

router.get("/getEmployee/:id",async(req,res)=>{
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

router.put("/editEmployee/:id",async(req,res)=>{
    try {
        const employees = await Employee.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if(!employees){
            return res.status(404).json({message:'Employee not found'});
        }
        res.json(employees);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

router.delete("/deleteEmployee/:id",async(req,res)=>{
    try {
        const employees = await Employee.findByIdAndDelete(req.params.id);
        if(!employees){
            return res.status(404).json({message:'Employee not found'});
        }
        res.json({message:"Employee Deleted Successfully!"});
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
});

router.get("/adminCount",async(req,res)=>{
    try{
        const count=await User.collection.count();
        res.json(count);
    }catch(error){
        res.status(400);
        throw new Error(error.message); 
    }
});

router.get("/employeeCount",async(req,res)=>{
    try{
        const count=await Employee.collection.count();
        res.json(count);
    }catch(error){
        res.status(400);
        throw new Error(error.message); 
    } 
});

router.get("/salaryCount",async(req,res)=>{
    try{
        const result=await Employee.aggregate([
            {$group :{_id:null,totalSalary:{$sum:"$salary"}}}
        ]);
        const totalSalary=result[0]?result[0].totalSalary:0;
        res.json({totalSalary});
    }catch(error){
        res.status(400);
        throw new Error(error.message); 
    }
});

router.get("/adminRecords",async(req,res)=>{
    const keyword=req.query.search
    ? {
        $or:[
            { name : { $regex : req.query.search , $options:"i" } },
        ],
    }
    :{};

    const users=await User.find(keyword).find();
    res.send(users);
});

router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
});

router.get("/get_leaves",async(req,res)=>{
    try{
        const leaves = await Leave.find({}).populate("empid");
        return res.status(200).json({
            success:true,
            message:'Got all leaves',
            leaves
        });
    }catch(error){
        return res.status(400).json({
            success:false,
            message:'leaves not fetched',
        });
    }
});

router.put('/accept_leave', async(req,res) => {
    try {
        const {leaveId} = req.body;
        const response = await Leave.findByIdAndUpdate({_id:leaveId},{accepted:true});
        return res.status(200).json({
            success:true,
            message:'request accepted',
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'leave not accepted',
        });
    }
})

router.put('/reject_leave', async(req,res) => {
    try {
        const {leaveId} = req.body;
        const response = await Leave.findByIdAndUpdate({_id:leaveId},{accepted:false});
        return res.status(200).json({
            success:true,
            message:'request rejected',
        });
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:'leave not rejected',
        });
    }
})




module.exports=router;