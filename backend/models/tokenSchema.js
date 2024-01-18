const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const {Schema} = mongoose;
const tokenSchema =  new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"user",
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

tokenSchema.pre("save",async function (next){
    if(this.isModified("password")){
        const hash= await bcrypt.hash(this.password,8);
        this.password = hash;
    }

    next();
});
tokenSchema.methods.compareToken = async function (token){
    const result = await bcrypt.compareSync(token,this.token);
    return result;
} 
const Token = mongoose.model('token',tokenSchema)
// user.createIndexes()
module.exports  = Token