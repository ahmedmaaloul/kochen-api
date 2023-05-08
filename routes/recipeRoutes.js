const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerRecipeImage");
const recipeController = require("../controllers/recipeController")
const {protect} = require("../middleware/authMiddleware")

router.post("/create",protect, upload.single("image"), recipeController.recipe_create_post);
router.post("/details/:id/create",protect,recipeController.recipe_comment_post);
router.get("/",recipeController.recipe_index);
router.get("/me",protect,recipeController.my_recipes_get)
router.get("/fav",protect,recipeController.fav_recipes_get)
router.get("/:title",recipeController.recipe_title)
router.get("/details/:id",protect, recipeController.recipe_details);
router.put("/update/:id",protect,upload.single("image"),recipeController.recipe_update_put );
router.delete("/delete/:id",protect,recipeController.recipe_delete);
router.delete("/details/:id/delete",protect,recipeController.recipe_comment_delete)

module.exports = router
