const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = (req,res,next)=>{
    if( req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            res.status(401).json({
                error:"Not Authorized, no token"
            })
        }
        jwt.verify(token,process.env.KEY_SECRET,(err,decoded)=>{
                if(err){
                    res.status(403).json({
                        error:"token expired",
                    })
                }
                else{
                    User.findById(decoded.id).select("_id email likes").then((data)=>{
                        req.user=data;
                        next();
                    }).catch((error)=>{
                        res.status(403).json({
                            error:"Not Authorized",
                            details:error,
                        })
                    })
            }
        })
 
    }
    else{
        res.status(401).json({
            error:"Not Authorized, no token"
        })
    }
}

module.exports={protect}