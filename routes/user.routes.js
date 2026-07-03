const express=require("express")
const router=express.Router()
const {getUsers}=require("../controllers/user.controller")
const verifyToken=require("../middleware/auth.middleware")

router.get("/",verifyToken,getUsers)
module.exports=router