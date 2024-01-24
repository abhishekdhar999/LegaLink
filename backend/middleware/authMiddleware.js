const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Advocate = require("../models/Advocate")
const asyncHandler = require("express-async-handler");
const JWT_SECRET = "nyaysathi$nyay@milega"
const protect = async (req, res, next) => {
  
  // const fetchuser = (req,res,next)=>{
    //     const token = req.header('auth-token');
  // if (
  //   req.headers.authorization &&
  //    req.headers.authorization.startsWith("Bearer")
  // )
   {
    try {
      // try {
//         const data = jwt.verify(token,JWT_SECRET);
//         console.log({"data": data})
//         req.user = data.user;
//         console.log(req.user)
//         next();


      // token = req.headers.authorization.split(" ")[1];
      const token = req.header('auth-token');
console.log("authmiddleware token hjjhbhgggsg",token)
      //decodes token id
      const decoded = jwt.verify(token,JWT_SECRET );
console.log("decodeddddddd",decoded)

console.log("decoded.id",decoded.user.id)

      req.user = await User.findById(decoded.user.id).select("-password")  
console.log("req.user = ",req.user)
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  
};


// var jwt = require('jsonwebtoken');
// const JWT_SECRET = "harryisagood$boy";

// const fetchuser = (req,res,next)=>{
//     const token = req.header('auth-token');
//     if(!token){
//         res.status(401).send({error:"please authenticate using a valid token"})
//     }
//     try {
//         const data = jwt.verify(token,JWT_SECRET);
//         console.log({"data": data})
//         req.user = data.user;
//         console.log(req.user)
//         next();
//     } catch (error) {
//         res.status(401).send({error:"please authenticate using a valid token"})
//     }
// }
// module.exports = fetchuser

module.exports = { protect };