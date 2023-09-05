const product = require("../models/productModel")
const ErrorHandler = require("../util/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const order=require("../models/orderModel")
const user = require("../models/userModel")




exports.newOrder= catchAsyncError(async function(req,res,next){
    const {shippingInfo,orderItem,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body

    const ourOrder=await order.create({
        shippingInfo,
        orderItem,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })
    res.status(200).json({
        success:true,
        ourOrder
    })

})

exports.myOrder=catchAsyncError(async function(req,res,next){
       const ourOrder=await order.find({user:req.user._id})

       res.status(200).json({
        success:true,
        ourOrder
       })

})

exports.getSingleOrder=catchAsyncError(async function(req,res,next){
    const ourOrder=await order.findById(req.params.id)
    if(!ourOrder){ 
         return next(new ErrorHandler("order now found",404))
    }

    res.status(200).json({
     success:true,
     ourOrder
    })

})

exports.getAllOrders=catchAsyncError(async function(req,res,next){
    const ourOrders=await order.find()
    let totalAmount=0
    ourOrders.forEach(ord=>{
        totalAmount=totalAmount+Number(ord.totalPrice)
    })
    res.status(200).json({
        success:true,
        ourOrders,
        totalAmount
    })
})

exports.updateOrder=catchAsyncError(async function(req,res,next){
    const ourOrder=await order.findById(req.params.id)
    
    if(!ourOrder){
        return next(new ErrorHandler("order not found"),404)
    }

    if(ourOrder.orderStatus==="Delivered"){
        return next(new ErrorHandler("order already delivered",400))
    }
    ourOrder.orderItems.forEach(async (ord)=>{
        await updateStock(ord.product,ord.quantity);
    });
    
    ourOrder.orderStatus=req.body.status
    if(req.body.status==="Delivered"){
        ourOrder.deliveredAt=Date.now()
    }
    await ourOrder.save({ validateBeforeSave:false})
    
    res.status(200).json({
        success:true,
        ourOrder,
        totalAmount
    })

    async function updateStock(id,quantity){
        const prod=await product.findById(id)
        
        prod.stock-=quantity

        prod.save({validateBeforeSave:false})

    }
})


exports.deleteOrder=catchAsyncError(async function(req,res,next){
    const ourOrder=await order.findById(req.params.id)
    console.log(ourOrder)
    if(!ourOrder){
        return next(new ErrorHandler("order not found"),404)
    }

    await order.findOneAndDelete(req.params.id)


    res.status(200).json({
        success:true
    })
})


