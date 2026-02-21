const express= require("express");
const router= express.Router();


const { createCategory, getAllCategories,getCategoryById ,updateCategory } = require("../controllers/category.controller");
// ✅ Test route
router.get("/test", (req, res) => {
  res.send("Category API working");
});
router.post("/createCategory", upload.single("image"), createCategory);
router.put("/updateCategory/:id", upload.single("image"), updateCategory);
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoryById/:id", getCategoryById);
module.exports= router;