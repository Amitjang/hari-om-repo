// const express = require("express");
// const mongoose = require("mongoose");
// const app = express();
// const { MongoClient, ServerApiVersion } = require('mongodb');
// app.use(express.json());


// const uri = "mongodb+srv://amitjangra94664:1234567890@cluster0.6zcwnrz.mongodb.net/?appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String
// });

// const User = mongoose.model("User", userSchema);

// app.get("/", (req, res) => {
//   res.send("Hello World");
// })
// app.post("/users", async (req, res) => {
//   try{
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json(user);

//   } catch(err){} });

//   // Connect mongoose instead of using separate MongoDB client
//   mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
//     .then(() => console.log("Connected to MongoDB"))
//     .catch(err => console.error("MongoDB connection error:", err));

//   // Add error handling middleware
//   app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({ error: err.message });
//   });

//   // Add GET endpoint to retrieve users
//   app.get("/users", async (req, res) => {
//     try {
//       const users = await User.find();
//       res.json(users);
//     } catch(err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

//   // Add error handling to POST endpoint
//   app.post("/users", async (req, res) => {
//     try {
//       const user = new User(req.body);
//       await user.save();
//       res.status(201).json(user);
//     } catch(err) {
//       res.status(400).json({ error: err.message });
//     }
//   });
// app.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// });