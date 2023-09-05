const ErrorHandler = require("../util/errorhandler");
const catchAsyncError = require("./catchAsyncError");
const jwt= require("jsonwebtoken")
const user=require("../models/userModel")


exports.isAuthenticatedUser=catchAsyncError(async function(req,res,next){
    const {token}=req.cookies
    
    if(!token){
        return next(new ErrorHandler("please login first",401))
    }
    const decodeData= jwt.verify(token,process.env.JWT_SECRET)
    
    req.user=await user.findById(decodeData.id)
    next()

})

exports.authorizeRole= (...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){
            return next(new ErrorHandler(`role: ${req.user.role} is not allowed`))
        }
        next();
    }
   
}