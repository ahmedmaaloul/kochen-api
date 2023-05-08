const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController")
const {protect} = require("../middleware/authMiddleware")
const verifEmail = require("../middleware/uniciteUser")



router.post("/create",userController.user_create_post);
router.post("/login",userController.user_login_post);
router.post("/like",protect,userController.like_post);
router.get("/avatar/:id",userController.user_avatar_get)
router.get("/profile",protect,userController.user_profile_get)
router.put("/profile",protect,verifEmail,userController.user_profile_put)
router.get("/likes",protect,userController.user_likes_get);
router.delete("/dislike",protect,userController.dislike_delete)

module.exports = router