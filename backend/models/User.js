// const mongoose = require('mongoose')
// const {Schema} = mongoose;
// const UserSchema =  new Schema({
//     name:{
//         type:String,
//         required:true 
//     },
//     email:{
//         type:String,
//         required:true,
//          unique:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
    

//     verified:{
//         type:Boolean,
//         default:false
//     },
//     picture:{
//         type:String,
//     }
// },{
//     timestamps:true,
// });




// https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=654&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
// const mongoose = require('mongoose')
// const user = mongoose.model('user',UserSchema)
// user.createIndexes()
// module.exports  = user

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    verified:{
      type:Boolean,
      default:false
  },
  picture:{
      type:String,
  }
  },
  { timestaps: true }
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const user = mongoose.model("user", UserSchema);

module.exports = user;