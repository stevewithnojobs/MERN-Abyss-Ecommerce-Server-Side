
const sendTokens=(users,statusCode,res)=>{
   
    const token= users.getJWTToken();
    
    const options={
        expires: new Date(
            Date.now()+ 5 * 24 * 60 * 60 * 1000
        ),
        httpOnly:true,
    }

    res.status(statusCode).cookie("token", token, options).json({
        success:true,
        users,token
    })
}

module.exports=sendTokens