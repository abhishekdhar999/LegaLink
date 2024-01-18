const mongoose = require('mongoose')
const {Schema} = mongoose;
const CaseSchema =  new Schema({
    advocate:{
        type:Schema.Types.ObjectId,
        ref:'advocate'
    },
    title:{
        type:String,
        required:true 
    },
    description:{
        type:String,
        required:true,
         
    },
    
})
const cases = mongoose.model('case',CaseSchema)
// user.createIndexes()
module.exports  = mongoose.model('case',CaseSchema)



