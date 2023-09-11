const express=require("express")
const { registerUser, loginUser, logout, removeUser, forgotPassword,resetPassword, getUserDetail, updatePassword, allUserDetail, updateUser, getUserDetailById, deleteUser, updateUserRole, updateProfile } = require("../controllers/userController")
const { isAuthenticatedUser, authorizeRole } = require("../middleware/authentication")

const route=express.Router()

route.post("/register",registerUser)
route.post("/login",loginUser)
route.get("/logout",logout)
route.post("/password/forgot",forgotPassword)
route.put("/password/reset/:token",resetPassword)
route.get("/me",isAuthenticatedUser,getUserDetail)
route.put("/password/update",isAuthenticatedUser,updatePassword)
route.put("/me/update",isAuthenticatedUser,updateProfile)

route.put("/admin/user/:id",isAuthenticatedUser,authorizeRole("admin"),updateUserRole)

route.get("/admin/users",isAuthenticatedUser,authorizeRole("admin"),allUserDetail)

route.get("/admin/user/:id",isAuthenticatedUser,authorizeRole("admin"),getUserDetailById)

route.delete("/admin/user/:id",isAuthenticatedUser,authorizeRole("admin"),deleteUser)



module.exports=route
