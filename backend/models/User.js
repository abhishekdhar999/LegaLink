

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
    isUser: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAdvocate:{
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
  },
  state:{
    type:String,
    required:true,
},
rating:{
  type:String
},
education:{
  type:String
},
barcode:{
  type:String,
  required:true,
  unique:true
  // required:function(){
  //   return this.isBarcodeRequired
  // }
  },
aadhar:{
  type:String,
  required:true,
  unique:true
  // required:function(){
  //   return this.isBarcodeRequired
  // }
  },
  isBarcodeRequired:{
    type:Boolean,
    default:false,
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
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZHZvY2F0ZSI6eyJpZCI6IjY1YWZkOWNmN2IyMDY0YzcwZTA3Yzg1OCJ9LCJpYXQiOjE3MDYwMjYxODV9.GV4SrsktOwPYLtFLaYAlE6_wNXHSdQ1RR2T7FlN30sc
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const user = mongoose.model("user", UserSchema);

module.exports = user;