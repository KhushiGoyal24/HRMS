const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = express();
const cors=require("cors");
const Jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cors({
    origin: "http://localhost:3000",
    methods: 'GET, POST, PUT, DELETE',
    credentials: true
}));

app.use(cookieParser());

dotenv.config();

app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const employeeRoutes=require("./routes/employeeRoutes");

app.use(express.static('Public'))
app.use("/admin", userRoutes);
app.use("/emp",employeeRoutes);


require("./config/database").connect();

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  console.log("token"+token);
  if(token) {
      Jwt.verify(token, "JWT_SECRET", (err ,decoded) => {
          if(err) return res.json({Status: false, Error: "Wrong Token"})
          req.id = decoded.id;
          req.role = decoded.role;
          next()
      })
  } else {
      return res.json({Status: false, Error: "Not autheticated"})
  }
}
app.get('/verify',verifyUser, (req, res)=> {
  return res.json({Status: true, role: req.role, id: req.id})
} )


app.get("/", (req, res) => {
  res.send("API is running123");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("Server is Running..."));