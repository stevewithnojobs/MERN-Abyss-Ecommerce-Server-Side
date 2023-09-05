const ErrorHandler = require("../util/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const user = require("../models/userModel")
const sendTokens = require("../util/jwtToken")
const jwt = require("jsonwebtoken")
const { sendEmail } = require("../util/sendEmails")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const cloudinary=require("cloudinary")


exports.registerUser = catchAsyncError(async function (req, res, next) {

    const myCloud= await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatar",
        width:150,
        crop:"scale"
    })
    const { name, email, password } = req.body

    const newuser = await user.create({
        name, email, password,
        avatar: {
            public_id:myCloud.public_id,
            url:myCloud.secure_url
        }
    })

    sendTokens(newuser, 201, res);
})

exports.loginUser = catchAsyncError(async function (req, res, next) {

    const { email, password } = req.body
    console.log(req.cookie)
    if (!email || !password) {
        return next(new ErrorHandler("please enter credential", 400))
    }

    const guy = await user.findOne({ email: email }).select("+password")

    if (!guy) {
        return next(new ErrorHandler("Invalid password or email"))
    }

    const isPasswordMatched = await bcrypt.compare(password, guy.password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 400))
    }

    sendTokens(guy, 200, res);

})

exports.logout = async function (req, res, next) {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "logged out"
    })
}


exports.forgotPassword = catchAsyncError(async function (req, res, necxt) {
    const { email } = req.body

    const ourUser = await user.findOne({ email })
    if (!ourUser) {
        return next(new ErrorHandler("user not found"), 400)
    }

    const recievedToken = await ourUser.getPasswordToken(email);

    res.json({
        success: true,
        message: `A token is sent with to ${email}  on a mail${recievedToken}`

    })

})


exports.resetPassword = catchAsyncError(async function (req, res, next) {

    const ourToken = req.params.token

    const searchForToken = crypto.createHash("sha256").update(ourToken).digest("hex")


    const ourUser = await user.findOne({ resetPasswordToken: searchForToken })

    if (!ourUser || ourUser.resetPasswordExpire < Date.now()) {
        return next(new ErrorHandler("Reset Password Token Invalid"))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("confirmPassword should be same as Password "))
    }

    ourUser.password = await bcrypt.hash(req.body.password, 10)
    ourUser.getResetPasswordToken = undefined
    ourUser.resetPasswordExpire = undefined
    ourUser.save()

    res.json({
        success: true,
        message: "password changed"
    })

})

exports.getUserDetail = catchAsyncError(async function (req, res, next) {
    const ourUser = await user.findById(req.user.id)

    res.status(200).json({
        success: true,
        ourUser
    })
})


exports.updatePassword = catchAsyncError(async function (req, res, next) {
    const ourUser = await user.findById(req.user.id)


    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("password and confirm password does not match"), 400)
    }

    ourUser.password = await bcrypt.hash(req.body.password, 10)
    ourUser.save()

    sendTokens(ourUser, 200, res)


})

exports.updateProfile = catchAsyncError(async function (req, res, next) {

    const newUserData = 
    {
        name: req.body.name,
        email: req.body.email
    }

    const ourUser = await user.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

})



exports.allUserDetail=catchAsyncError(async function(req,res,next){

    const allUserData= await user.find()

    res.status(200).json({
        success:true,
        allUserData
    })
})

exports.getUserDetailById=catchAsyncError(async function(req,res,next){
        const userData=await user.findById(req.params.id)

        if(!userData){
            return next(new ErrorHandler("user not found"))
        }

        res.status(200).json({
            success:true,
            userData
        })

})

exports.updateUserRole = catchAsyncError(async function (req, res, next) {

    const newUserData = 
    {
        name: req.body.name,
        email: req.body.email,
        role:req.body.role
    }

    const ourUser = await user.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

})
 

exports.deleteUser=catchAsyncError(async function(req,res,next){
    const ourUser=await user.findByIdAndDelete(req.params.id)

    if(!ourUser){
        return next(new ErrorHandler(""))
    }

    res.status(200).json({
        message:"User deleted"
    })

})











