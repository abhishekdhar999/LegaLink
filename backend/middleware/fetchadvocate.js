var jwt = require('jsonwebtoken');
const Advocate = require('../models/Advocate');
const JWT_SECRET = "nyaysathi$nyay@milega";

const fetchadvocate = async(req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"please authenticate using a valid token"})
    }
    try {
        const decodedAdvocate = jwt.verify(token,JWT_SECRET);
        console.log({"data": data})
        console.log("decodedAdvocate.id",decodedAdvocate.advocate.id)
        req.advocate = await Advocate.findById(decodedAdvocate.advocate.id)
        console.log("req.advocate",req.advocate)
        next();
    } catch (error) {
        res.status(401).send({error:"please authenticate using a valid token"})
    }
}
module.exports = fetchadvocate