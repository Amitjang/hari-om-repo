const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const categoryRoutes = require("./routes/category.routes");
const authRoutes = require("./routes/auth.routes");

// const adminRoutes = require("./routes/admin.routes");


const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running...");
}
);

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);  
app.use("/auth", authRoutes);


module.exports = app;
