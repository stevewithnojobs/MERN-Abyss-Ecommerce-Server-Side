const app = require("./app.js")
const dotenv=require("dotenv")
const connectDatabase=require("./config/database.js")
const cloudinary=require("cloudinary")



dotenv.config({path:'backend/config/config.env'})

connectDatabase();

cloudinary.config({
    cloud_name: 'dct0xlo1c',
   api_key: '132612724226643',
   api_secret:'oQJywmLTSTOTAKgTw5Mwj-mGdH8'
})
// console.log("aeijfe",process.env.CLOUDINARY_API_KEY)

const server=app.listen(process.env.PORT,function(){
    console.log(`port working on port ${process.env.PORT}....`)
})


process.on("unhandledRejection",err=>{
    console.log(`Error:${err.message}`)
    console.log("shutting down the server")

    server.close(function(){
        process.exit(1);
    })

})