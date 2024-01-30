const multer = require("multer");
const path = require("path");


const storage =  multer.diskStorage({
    
    destination:(req,file,cb)=>{
        cb(null,"./storage/images")
    },
    filename:(req,file,cb)=>{
        console.log("in storage file",file)
        const ext = path.extname(file.originalname);
        return cb(null, `${file.fieldname}_${Date.now()}${ext}`)
    }
})

const fileUpload =  multer({
    
    storage:storage,
    limits:{
        fileSize: 2 * 1024 *1024,
    },

    fileFilter: (req,file,cb)=>{
        console.log("in fileupload file",file)
        if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"){
            cb(null,true);
        }else{
            cb(null,false);
            return cb(new Error ("only .png , .jpg and .jpeg format allowed" ))
        }
    },
    onError : function(err,next){
        return console.log("error",err);
        next(err);
    }

    
})

module.exports = { fileUpload };