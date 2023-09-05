const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt= require("jsonwebtoken")
const crypto= require("crypto")
const { stringify } = require("querystring")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter name"]
    },
    email: {
        type: String,
        required: [true, "please enter name"],
        unique: true,
        validate: [validator.isEmail, "please give correct email"]

    },
    password: {
        type:String,
        required: true,
        minLength: [8, "length at least 8 charachter"],
        select:false
    },
    flag:{
        type:Number,
        default:0
    },
    avatar:{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    
    resetPasswordToken:String,
    resetPasswordExpire:Date,
})

userSchema.pre("save",async function(next){

    if(this.flag===1){
        next();
    }
    this.password=await bcrypt.hash(this.password,10)
    this.flag=1

})


userSchema.methods.getJWTToken= function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function(enPassword){

    return await bcrypt.compare(enPassword,this.password,function(err,isValid){
        if(isValid){
            return true
        }
        return false
    })
}

userSchema.methods.getPasswordToken= async function(email){

    const token= crypto.randomBytes(20).toString("hex")
   
    const ourUser=await user.findOne({email})
    
    const hashedtoken= crypto.createHash("sha256").update(token).digest("hex")
    
    ourUser.resetPasswordToken=hashedtoken
    ourUser.resetPasswordExpire=Date.now()+15*60*1000
    
    await ourUser.save()

    return token

}



const user =  mongoose.model("user", userSchema)

module.exports=user