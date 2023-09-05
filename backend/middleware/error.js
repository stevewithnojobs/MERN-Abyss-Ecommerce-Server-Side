const ErrorHandler=require("../util/errorhandler");

module.exports = function(err,req,res,next){
    err.statusCode=err.statusCode||500;
    err.message=err.message||"internal server error"

    if(err.code===11000){
        const message=`Duplicate entered`
        err=new ErrorHandler(message,400)
    }

    if(err.name==="JsonWebTokenError"){
        const message=`json web token is invalid`
        err=new ErrorHandler(message,400)
    }

    if(err.name==="TokenExpiredError"){
        const message=`json web token is expired`
        err=new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({
        success:false,
        error:err,
        message:err.message
    })
}

