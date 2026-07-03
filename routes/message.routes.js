const express=require("express");
const router=express.Router()
const { getMessages, sendMessage ,getOrCreateConversation} = require("../controllers/message.controller");
const verifyToken = require("../middleware/auth.middleware")


router.post("/send", verifyToken, sendMessage),
router.post("/conversation",verifyToken,getOrCreateConversation)
router.get("/:conversationId", verifyToken, getMessages),
router.post("/send",sendMessage);
router.get("/:conversationId",getMessages);

module.exports=router;
