const express= require("express");
const router= express.Router();

const { createCategory, getAllCategories,getCategoryById } = require("../controllers/category.controller");
// ✅ Test route
router.get("/test", (req, res) => {
  res.send("Category API working");
});
router.post("/createCategory", createCategory);
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoryById/:id", getCategoryById);
module.exports= router;