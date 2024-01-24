// express routes
const express = require('express')
const router = express.Router()

// mongodb user model
const Advocate = require('../models/Advocate')
const User = require("../models/User")
// mongodb user verification model
const userVerification = require('../models/tokenSchema')

// express js validator
const { body, validationResult} = require('express-validator');

// password handler
const bcrypt = require('bcryptjs');

// jason web tokken
var jwt = require('jsonwebtoken')
const JWT_SECRET = "nyaysathi$nyay@milega"

// middleware
const fetchadvocate = require('../middleware/fetchadvocate')
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


const Token = require("../models/tokenAdvocateSchema");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');
const tokenAdvocateSchema = require('../models/tokenAdvocateSchema');
const tokenSchema = require('../models/tokenSchema');









router.get('/advocates',protect, async(req,res)=>{
    try {
        const advocate =  await User.find({isAdvocate:true});
        res.json(advocate)
    } catch (error) {
        console.error(error.message);
    res.status(500).send('Server Error');
    }
})


// create a user  using :post "/api/authArbitrator".doesnt require auth
router.post('/createadvocate',
//  [body('name').notEmpty(),
// body('email').isEmail(),
// body('barcode').notEmpty(),
// body('aadhar').notEmpty(),

// body('password').isLength({ min: 5 })],
 async (req, res) => {
    
    
    const { email ,isAdvocate,isBarcodeRequired} = req.body
    console.log(req.body);
    // const verificationCode = Math.floor(100000 + Math.random() * 900000);
    let success = false;
    // if there are errors return bad request and the errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success, errors: result.array() })
    }

    try {
        // chech whether the Advocate exists already
        let advocate = await User.findOne({ email: req.body.email })

        if (advocate) {
            return res.status(400).json({ success, error: "advocate with this email already exists" })
        }
        // securing password
        const salt = await bcrypt.genSalt(10);

        const securedpassword = await bcrypt.hash(req.body.password, salt)
        // creating  a new Advocate
        advocate = await User.create({
            name: req.body.name,
            email: req.body.email,
            verified:false,
            password: securedpassword,
            barcode:req.body.barcode,
            aadhar:req.body.aadhar,
            state:req.body.state,
            isAdvocate:isAdvocate,
            isBarcodeRequired:isBarcodeRequired
        })

        // await advocate.save()
        console.log("advocate",advocate)
        // OTP GENERATION WORK
             const OTP  = generateOTP()


        // jwt token
        const data = ({
            user : {
                id: advocate._id
            },
        });
        const authtoken = jwt.sign(data, JWT_SECRET)
        console.log(authtoken)

        const otptoken = crypto.randomBytes(32).toString("hex")
        const token = new Token({
            advocateId: advocate.id,
            token: OTP 
        })

        await token.save();
        console.log("token advocate",token)
        // const url = `${"http://localhost:6001"}users/${user.id}/verify/${authtoken}`
        // console.log(url)

        // sending an email for verification
        await sendEmail(email, "verify Email",OTP );
        res.status(201).send({ message: "an email sent to your account" })


        // succesfull generation of authentication token
        success = true
        console.log("advocate",advocate)

       if(advocate){
        res.status(201).json({
            _id: advocate._id,
      name: advocate.name,
      email: advocate.email,
      barcode:advocate.barcode,
      aadhar:advocate.aadhar,
      profilePicture: advocate.pic,
      token: authtoken,
      isAdvocate:advocate.isUser
        })
       }
    } catch (error) {
        console.log(error.message)
        // res.status(500).send("internal server error occured")
    }

 })

// verefying the email and api/autharbitrator/verifyAdvocate
router.post("/verifyAdvocate",async (req, res) =>{
    const {advocateId,otp} = req.body;
    
    if(!advocateId || !otp.trim()){
        return res.status(500).send("cant fetch advocateid or otp")
    }
    if(!isValidObjectId(advocateId)){
        return res.status(500).send("not valid object id")
    }

   const advocate = await User.findById(advocateId)

   console.log(advocate)
   if(!advocate) return res.status(500).send("advocate not found");

   if(advocate.verified) {
    return res.status(500).send("advocate already verefied");
   }

  const verificationToken = await tokenSchema.findOne({advocateId:advocate.id})

  console.log(verificationToken)
  if(!verificationToken) return res.status(500).send("advocate not found"); 

  const tokenAdvocateSchemaToken = await tokenSchema.findOne({token:otp})
 
  if(tokenAdvocateSchemaToken.token !== otp)return res.status(500).send("provide valid token");
  console.log("tokken" + tokenAdvocateSchemaToken.token) 
  console.log("otp" + otp)
//    

  advocate.verified = true;
 await tokenSchema.findByIdAndDelete(verificationToken._id);

 try {
    await advocate.save();
    res.status(200).send("User verified and saved successfully.");
 } catch (error) {
    console.log(error.message);
        res.status(500).send("Error occurred while saving the user.");
 }
 
})








//  Authinticate the user using post "api/autharbitrator/loginAdvocate" no login required
router.post("/loginAdvocate", [body('email').isEmail(), body('password').exists()], async (req, res) => {

     let success =false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({  })
    }

    const { email, password} = req.body;

    try {
// seraching from database
        let advocate = await User.findOne({ email })
        console.log("advocate",advocate)
        // let userpassword = await User.findOne({password})
        if (!advocate) {
 return res.status(400).json({ error: "login with correct credentials" })
        }

        if(!advocate.verified){
            return res.status(400).json({ error: "User not verified. Please verify your email first." }); 
        }
        // const passwordCompare = await bcrypt.compare(password, advocate.password)
        // if (!passwordCompare) {
        //     success = false
        //     return res.status(400).json({  error: "incorrect password" })
        // }

        const data = {
            user: {
                id: advocate._id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
         success = true
        console.log(authtoken)
        res.json({ success, _id: advocate._id,
            name: advocate.name,
            email: advocate.email,
            barcode:advocate.barcode,
            aadhar:advocate.aadhar,
            profilePicture: advocate.pic,
            token: authtoken,
        state:advocate.state })
    } catch (error) {
        console.log(error.message)
        res.status(500).send("internal server error")
    }
})


// ROUTE:3 get a user details after loggedin post request "/api/autharbitrator/getadvocater" login required

router.get("/getadvocate", protect, async (req, res) => {


    try {
        let advocateid = req.user.id

        const advocate = await User.findById(advocateid).select("-password")
        res.json(advocate)
    } catch (error) {
        console.log(error.message)
        res.status(500).send("internal server error")
    }

})

router.get("/getSingleadvocate/:id", async (req, res) => {


    try {
        let advocate = await User.findById(req.params.id)

        if(!advocate){return res.status(404).send("advocate not found")}

res.json(advocate)

    } catch (error) {
        console.log(error.message)
            res.status(500).send("internal server error")
    }

})


module.exports = router