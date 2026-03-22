const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

/* TEST */
router.get("/test", (req, res) => {
  res.send("Category API working");
});

/* ROUTES */

// CREATE
router.post(
  "/createCategory",
  upload.single("image"),
  createCategory
);

// UPDATE
router.put(
  "/updateCategory/:id",
  upload.single("image"),
  updateCategory
);

// GET ALL
router.get("/getAllCategories", getAllCategories);

// GET ONE
router.get("/getCategoryById/:id", getCategoryById);

// DELETE
router.delete("/deleteCategory/:id", deleteCategory);

module.exports = router;