const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");


const verifEmail = (req,res,next)=>{
    if(req.body.email){
        User.findOne({email:req.body.email}).then(data=>{
            res.status(403).json({
                message:"L'email doit être unique"
            })
        }).catch(err=>{
            next();
        })
    }
    else{
        next()
    }

}
module.exports = verifEmail