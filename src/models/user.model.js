const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
trim: true,
},


email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
},

password: {
  type: String,
  required: true,
},

role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},

/* Store refresh token for secure login sessions */
refreshToken: {
  type: String,
  default: null,
},

/* Optional: device tracking for admin security */
deviceId: {
  type: String,
  default: null,
},

/* Optional: last login tracking */
lastLogin: {
  type: Date,
  default: null,
},


},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
