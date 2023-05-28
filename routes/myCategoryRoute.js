const express =require("express")
const { auth, isAdmin } = require("../middlewares/auth")
const { categoryController, updateCategory, getCategories, singleCategory, deleteCategory } = require("../Controllers/CategoryController")
const router= express.Router()




router.post("/create-category" ,auth,isAdmin, categoryController)
router.put("/update-category/:id",auth ,isAdmin,updateCategory)
router.get("/get-category" ,getCategories)
router.get("/single-category/:slug" , singleCategory)
router.delete("/delete-category/:id",auth,isAdmin, deleteCategory)

module.exports = router;