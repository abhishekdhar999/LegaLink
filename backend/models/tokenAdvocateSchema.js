const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;
const tokenAdvocateSchema =  new Schema({
    advocateId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"advocate",
        unique:true,
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:3600
    }
})

tokenAdvocateSchema.pre("save",async function (next){
    if(this.isModified("password")){
        const hash= await bcrypt.hash(this.password,8);
        this.password = hash;
    }

    next();
});
tokenAdvocateSchema.methods.compareToken = async function (token){
    const result = await bcrypt.compareSync(token,this.token);
    return result;
} 
const advocate = mongoose.model('tokens',tokenAdvocateSchema)
// user.createIndexes()
module.exports  = advocate