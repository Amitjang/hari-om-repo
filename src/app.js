const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const categoryRoutes = require("./routes/category.routes");
const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

/* ================= CORS CONFIG ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "https://hari-om-pharma-admin-panel.vercel.app",
  "https://hari-om-pharma-web.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// Preflight request fix (VERY IMPORTANT)
app.options(/.*/, cors());

/* ================= MIDDLEWARE ================= */

app.use(express.json());

/* ================= TEST ROUTE ================= */

app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ================= ROUTES ================= */

app.use("/uploads", express.static("uploads"));

app.use("/products", productRoutes);

// 🔥 global error handler
app.use(errorHandler);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/uploads", express.static("uploads"));

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  if (err.message === "CORS not allowed") {
    return res.status(403).json({ message: "CORS blocked" });
  }
  next(err);
});

module.exports = app;