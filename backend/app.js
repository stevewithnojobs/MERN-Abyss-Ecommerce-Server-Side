const express= require('express')
const app=express()
const product=require("./routes/productRoute")
const errorMiddleware=require("./middleware/error")
const user=require("./routes/userRoute")
const cookieParser=require("cookie-parser")
const order=require("./routes/orderRoute")
const bodyParser=require("body-parser")
const fileUpload=require("express-fileupload")

app.use(cookieParser())
app.use(express.json({limit:'100mb'}))
app.use(bodyParser.urlencoded({extended:true,limit:'100mb'}))
app.use(fileUpload())


app.use(order)
app.use(product)
app.use(user)
app.use(errorMiddleware)


module.exports=app