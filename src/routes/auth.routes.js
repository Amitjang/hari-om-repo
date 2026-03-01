const express = require("express");
const router = express.Router();

const { register, login , logout, refreshToken} = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token",refreshToken);
router.post("/create-admin", async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const User = require("../models/user.model");

    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
    });

    res.json({ success: true, admin });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;