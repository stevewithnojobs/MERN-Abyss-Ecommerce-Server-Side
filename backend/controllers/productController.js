const product = require("../models/productModel")
const ErrorHandler = require("../util/errorhandler")
const catchAsyncError = require("../middleware/catchAsyncError")
const ApiFeatures = require("../util/apifeatures")
const { Error } = require("mongoose")
const user = require("../models/userModel")

exports.createProducts = async function (req, res, next) {
    const pro = await product.create(req.body)
    const ourUser=await user.findById(req.user.id)
   
    pro.user=ourUser
    pro.save({validateBeforeSave:false})
    res.status(201).json({
        sucess: true,
        pro
    })
}

exports.updateProduct = catchAsyncError(
    async function (req,res,next) {
        let prod = await product.findById(req.params.id)
        if (!prod) {
            return next(new ErrorHandler("product not found", 404))
        }

        prod = await product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({
            sucess: true,
            prod
        })

    })


exports.deleteProduct = catchAsyncError(async function (req, res,next) {
    const data = await product.findByIdAndDelete(req.params.id)
    if (!data) {
        return next(new ErrorHandler("product not found", 404))
    }
    res.status(200).json({
        sucess: true,
        message: "product deleted"
    })

})


exports.getProductDetail = catchAsyncError(async function (req, res, next) {


    const data = await product.findById(req.params.id)

    if (!data) {

        return next(new ErrorHandler("product not found", 404))
    }
    const pdata = await product.find({ _id: req.params.id })
    res.status(200).json({
        sucess: true,
        data
    })
})

exports.getALLproducts = catchAsyncError(async function (req, res,next) {
    
    const resultPerPage = 5;
    const productCount= await product.countDocuments()
    const apiFeature = new ApiFeatures(product, req.query).search().filter().pagination(resultPerPage);
    
    const products=await apiFeature.query 

    

   
    res.status(200).json({
        success:true,
        products,
        productCount,
        resultPerPage,
        
    })
})


exports.createProductReview=catchAsyncError(async function(req,res,next){
    
    const {rating,comment,productId}=req.body

    const review={
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const ourProduct= await product.findById(productId)
    
    const isReviewed= ourProduct.reviews.find(rev=> rev.user.toString()===req.user.id.toString())
   
    if(isReviewed){

            ourProduct.reviews.forEach(rev=>{
                if(rev.user.toString()===req.user.id.toString())
                rev.rating=rating,
                rev.comment=comment
            })
    }
    else{
        
        ourProduct.reviews.push(review)
        ourProduct.numOfReview=ourProduct.reviews.length
    }
   
    let avg=0
    ourProduct.reviews.forEach(rev=>{
        avg+=rev.rating
    })
    ourProduct.ratings=avg/ourProduct.numOfReview

    await ourProduct.save({validateBeforeSave:false})
    res.status(200).json({
        success:true
    })

})


exports.getProductReviews=catchAsyncError(async function(req,res,next){
    const {productId}=req.query.productId
    const ourProduct= await product.findById(productId)
    if(!ourProduct){
        return next(new ErrorHandler("product not found"))
    }
    
    const productData=ourProduct.reviews
    res.status(200).json({
        success:true,
        productData
    })
})

exports.deleteReview=catchAsyncError(async function(req,res,next){
    const productId=req.query.productId
    const ourProduct= await product.findById(productId)
    if(!ourProduct){
        return next(new ErrorHandler("product not found"))
    }
    const review= ourProduct.reviews.filter(rev=> rev._id.toString()!==req.query.id.toString())
    
    let avg=0
    review.forEach(rev=>{
        avg+=rev.rating
    })
    ourProduct.numOfReview=review.length
    ourProduct.ratings=avg/ourProduct.numOfReview
    ourProduct.reviews=reviews
    await ourProduct.save({new:true,validateBeforeSave:false})
    
   
    res.status(200).json({
        success:true,
     })
})