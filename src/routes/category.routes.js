const express= require("express");
const router= express.Router();

const { createCategory, getAllCategories } = require("../controllers/category.controller");
// ✅ Test route
router.get("/test", (req, res) => {
  res.send("Category API working");
});
router.post("/createCategory", createCategory);
router.get("/getAllCategories", getAllCategories);

module.exports= router;