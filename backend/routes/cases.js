const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const fetchadvocate = require('../middleware/fetchadvocate')
const Cases = require('../models/Cases')
const { body ,validationResult,query} = require('express-validator');
// Route:1 get all case of an advocate using GET "api/cases/fetchallcases" 
router.get("/fetchallcases",fetchadvocate,async(req,res)=>{
    console.log("advocate id skjdbcjd:",req.advocate.id)
try {
    const cases = await Cases.find({advocate:req.advocate.id})
    
    console.log( "my cases:",cases)
    res.json(cases)
} catch (error) {
    console.log("cant fetch all cases")
}
    
    

})
// ROUTES:2 add all cases of an advocate using POST  "api/cases/addcase" login required
router.post("/addcase",fetchadvocate,[body("title").notEmpty(),body("description").notEmpty()],async(req,res)=>{

    try {
const {title,description} = req.body;

    const result  = validationResult(req);
if(!result.isEmpty()){
    return res.status(400).json({})
}

     
        const cases =new Cases({
            title,description,advocate:req.advocate.id
        }) 
        const savedcase = await cases.save()
        res.json(savedcase)
    
       } catch (error) {
        console.log(error.message)
            res.status(500).send("internal server error")
       }
    
    
    

})

// ROUTE:3  delete a case using delete "api/cases/deletecase" login required
router.delete("/deletecase/:id",fetchadvocate,async(req,res)=>{

let casetoDelete = await Cases.findById(req.params.id)
if(!casetoDelete){return res.status(404).send("not found")}

if(casetoDelete.advocate.toString() !== req.advocate.id){
    return res.status(401).send("not allowed")
}

   casetoDelete = await Cases.findByIdAndDelete(req.params.id) 
    
    res.json(casetoDelete)
    

})

// ROUTE:4 UPDATING AN EXISTING NODE   "api/cases/updatecase" login required

router.put("/updatecase/:id",fetchadvocate,async(req,res)=>{
 const {title,description} =req.body

 const newcase = {};
 if(title){newcase.title = title};
 if(description){newcase.description = description}

//  find the note to be updated and update it
let casetoUpdate = await Cases.findById(req.params.id);
if(!casetoUpdate){return res.status(404).send("not found")}

if(casetoUpdate.advocate.toString() !== req.advocate.id){
    return res.status(401).send("not allowed")
}

casetoUpdate = await Cases.findByIdAndUpdate(req.params.id,{$set:newcase},{new:true})
res.json(casetoUpdate)
})
module.exports = router