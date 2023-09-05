const express=require('express')
const { getALLproducts,createProducts,deleteProduct, updateProduct, getProductDetail, createProductReview, getProductReviews, deleteReview } = require('../controllers/productController')
const { isAuthenticatedUser, authorizeRole } = require('../middleware/authentication')

const router= new express.Router()


router.get('/product/products',getALLproducts)
router.post('/admin/product/new',isAuthenticatedUser,authorizeRole("admin"),createProducts)
router.put("/admin/product/:id",isAuthenticatedUser,authorizeRole("admin"),updateProduct)
router.delete("/admin/product/:id",isAuthenticatedUser,authorizeRole("admin"),deleteProduct)
router.get("/product/:id",getProductDetail)
router.put("/review",isAuthenticatedUser,createProductReview)

router.get("/reviews",getProductReviews)
router.delete("/reviews",getProductReviews,deleteReview)


module.exports=router