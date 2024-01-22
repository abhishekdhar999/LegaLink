const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017');

main().catch(err => console.log(err));
async function main(){
    await mongoose.connect("mongodb://localhost:27017/nyaysathi-original")
   
}


 