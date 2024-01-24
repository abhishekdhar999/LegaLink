const mongoose = require('mongoose')
const {Schema} = mongoose;
const AdvocateSchema =  new Schema({
    name:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true,
         unique:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
         default:false
    },
    barcode:{
        type:String,
        // required:true,
        // unique:true,
    },
    aadhar:{
        type:String,
        // required:true,
        // unique:true,
    },
    education:{
        type:String
    },
    rating:{
        type:String
    },
    picture:{
        type:String
    },
    state:{
        type:String,
        required:true,
    }

});



const advocate = mongoose.model('Advocate',AdvocateSchema)
// user.createIndexes()
module.exports  = mongoose.model('Advocate',AdvocateSchema)