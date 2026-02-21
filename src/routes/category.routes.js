const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");  // ✅ ADD THIS

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../controllers/category.controller");

/* TEST */
router.get("/test", (req, res) => {
  res.send("Category API working");
});

/* ROUTES */

router.post("/createCategory", upload.single("image"), createCategory);

router.put("/updateCategory/:id", upload.single("image"), updateCategory);

router.get("/getAllCategories", getAllCategories);

router.get("/getCategoryById/:id", getCategoryById);

router.delete("/deleteCategory/:id", deleteCategory);

module.exports = router;