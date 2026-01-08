const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");
const { addProduct } = require("../controllers/product.controller");

router.post("/product", auth, admin, addProduct);

module.exports = router;
