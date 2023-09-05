const express = require("express")
const { myOrder, newOrder, getAllOrders, getSingleOrder, updateOrder, deleteOrder } = require("../controllers/orderController.js")
const { isAuthenticatedUser, authorizeRole } = require("../middleware/authentication")



const route = new express.Router()

route.get("/",function(req,res){
    res.send("hello")
})
route.post("/order/new", isAuthenticatedUser, newOrder)
route.get("/order/me", isAuthenticatedUser, myOrder)
route.get("/order/:id", isAuthenticatedUser, getSingleOrder)
route.get("/admin/orders",isAuthenticatedUser,authorizeRole("admin"),getAllOrders)
route.put("/admin/order/:id",isAuthenticatedUser,authorizeRole("admin"),updateOrder)
route.delete("/admin/order/:id",isAuthenticatedUser,authorizeRole("admin"),deleteOrder)
module.exports = route