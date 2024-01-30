// express routes
const express = require('express')
const router = express.Router()

// mongodb user model
const User = require('../models/User')
// mongodb user verification model
const userVerification = require('../models/tokenSchema')

// express js validator
const { body, validationResult, query } = require('express-validator');

// password handler
const bcrypt = require('bcryptjs');

// jason web tokken
var jwt = require('jsonwebtoken')
const JWT_SECRET = "nyaysathi$nyay@milega"

// middleware
const fetchuser = require('../middleware/fetchuser')
const {protect} = require('../middleware/authMiddleware')
// email handler
const nodemailer = require("nodemailer")

// unique String
const { v4: uuidv4 } = require("uuid")

// env variables 


// NODEMAILER STUFF


// exports 
const{ generateOTP } =require("../utils/otp");

const {isValidObjectId} = require("mongoose")


const Token = require("../models/tokenSchema");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const tokenSchema = require('../models/tokenSchema');










// router.get('/users',async(req,res)=>{
//     try {
//         const users =  await User.find();
//         res.json(users)
//     } catch (error) {
//         console.error(error.message);
//     res.status(500).send('Server Error');
//     }
// })


// create a user  using :post "api/auth/".doesnt require auth
router.post('/createuser', 
// [body('name').notEmpty(),
// body('email').isEmail(),
// body('password').isLength({ min: 5 })],
 async (req, res) => {
    const { email ,isUser} = req.body
    // const verificationCode = Math.floor(100000 + Math.random() * 900000);
      let success = false;
    // if there are errors return bad request and the errors
    const result = validationResult(req);
    console.log("result",result)
    if (!result.isEmpty()) {
        return res.status(400).json({ success,  })
    }

    try {
        // chech whether the user exists already
        let user = await User.findOne({ email: req.body.email })

        if (user) {
            return res.status(400).json({ success, error: "user with this email already exists" })
        }
        // securing password
        const salt = await bcrypt.genSalt(10);


        const securedpassword = await bcrypt.hash(req.body.password, salt)
        // creating  a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: securedpassword,
            state:req.body.state,
            isUser:isUser,
            barcode:req.body.barcode,
            aadhar:req.body.aadhar
        })

        // OTP GENERATION WORK
             const OTP  = generateOTP()
console.log("otp",OTP)

        // jwt token
        const data = ({
            user: {
                id: user.id
            },
        });
        const authtoken = jwt.sign(data, JWT_SECRET)
        console.log("authtoken",authtoken) 
        const token = new Token({
            userId: user.id,
            token: OTP 
        })
        await token.save();
 // sending an email for verification
        await sendEmail(email, "verify Email",OTP );
        res.status(201).send({ message: "an email sent to your account" })
        // succesfull generation of authentication token
        let success = true;
        console.log("ma end ma hu")
        if(user){
            res.status(201).json({
                _id: user._id,
      name: user.name,
      email: user.email,
      isUser:user.isUser,
      isAdvocate:user.isAdvocate,
      pic: user.pic,
      token: authtoken,
      state:user.state
            })
        }
    } catch (error) {
        console.log(error.message)
        // res.status(500).send("internal server error occured")
    }

})
// verefying the email and 
router.post("/verify",async (req, res) =>{
    const {userId,otp} =req.body;
     console.log(userId);
    // console.log(otp);
    if(!userId || !otp.trim()){
        return res.status(500).send("cant fetch userid or otp")
    }
    if(!isValidObjectId(userId)){
        return res.status(500).send("not valid object id")
    }
   const user = await User.findById(userId)
   console.log("user = " ,user)
   if(!user) return res.status(500).send("user not found");

   if(user.verified) {
    return res.status(500).send("user already verefied");
   }

  const verificationToken = await tokenSchema.findOne({userId:user.id})

  console.log("verify",verificationToken)
  if(!verificationToken) return res.status(500).send("user not found"); 

  const tokenSchemaToken = await tokenSchema.findOne({token:otp})
 
  if(tokenSchemaToken.token !== otp)return res.status(500).send("provide valid token");
  console.log("tokken" + tokenSchemaToken.token) 
  console.log("otp" + otp)


  user.verified = true;
 await tokenSchema.findByIdAndDelete(verificationToken._id);

 try {
    await user.save();
    res.status(200).send("User verified and saved successfully.");
 } catch (error) {
    console.log(error.message);
        res.status(500).send("Error occurred while saving the user.");
 }
 
})








//  Authinticate the user using post "api/auth/login" no login required
router.post("/login", [body('email').isEmail(), body('password').exists()], async (req, res) => {

       let success =false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({success  })
    }

    const { email, password} = req.body;

    try {
    // seraching from database
        let user = await User.findOne({ email })
      console.log("auth vala user",user)
        // let userpassword = await User.findOne({password})
        if (!user) {
  return res.status(400).json({ error: "login with correct credentials" })
        }
if(!user.verified){
            return res.status(400).json({ error: "User not verified. Please verify your email first." }); 
        }

        console.log("password",password)
        console.log("user.password",user.password)
        // const passwordCompare = await bcrypt.compare(password, user.password)
        // console.log("password compare",passwordCompare)
        // if (!passwordCompare) {
        //     success = false
        //     return res.status(400).json({ success, error: "incorrect password" })
        // }

        const newpasswordCompare = await user.matchPassword(password)
        console.log("newpassword comapare",newpasswordCompare)
        if(user && (await user.matchPassword(password))){
            res.json({
               
            });
        }
console.log("auth vali usedid",user)
        const data = {
            user: {
                id: user._id
            }
        }
        console.log("auth vala data",data)
        const authtoken = jwt.sign(data, JWT_SECRET)
        success = true
        console.log("login vala authtoken",authtoken)

        res.json({ success,  _id: user._id,
            name: user.name,
            email: user.email,
            isUser:user.isUser,
            isAdvocate:user.isAdvocate,
            pic: user.pic,
            token: authtoken, })
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send("internal server error")
    }
})


// ROUTE:3 get a user details after loggedin post request "/api/auth/getuser" login required

// router.get("/getuser", protect , async (req, res) => {


//     try {
//         let userid = req.user.id

//         const user = await User.findById(userid).select("-password")
//         res.json(user)
//     } catch (error) {
//         console.log(error.message)
//         res.status(500).send("internal server error")
//     }

// })
module.exports = router
