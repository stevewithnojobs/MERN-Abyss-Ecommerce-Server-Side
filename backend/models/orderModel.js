const mongoose = require("mongoose")

const orderSchema= new mongoose.Schema({

    shippingInfo:
        {
            address:{
                type:String,required:true
            },
            city:{
                type:String,required:true
            },
            state:{
                type:String,required:true
            },
            country:{
                type:String,required:true,default:"India"
            },
            pinCode:{
                type:Number,
                required:true
            },
            phoneNo:{
                type:Number,
                required:true
            }
        },
    orderItems:[
        {
        name:{
            type:String,
            required:true
            },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        product:{
            type:mongoose.Schema.ObjectId,
            ref:"product",
            required:true
        }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
    },
    paidAt:{
        type:String,
        required:true
        , required:true
    },
    itemsPrice:{
        type:String,
        default:0
        , required:true
    },
    taxPrice:{
        type:String,
        default:0
       , required:true
    },
    shippingPrice:{
        type:String,
        default:0
        , required:true
    },
    totalPrice:{
        type:String,
        default:0
        , required:true
    },

    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliveredAt:Date,
    createdAt:{
        type:Date,
        default:Date.now,
    },
})


const order= mongoose.model("order",orderSchema)

module.exports=order