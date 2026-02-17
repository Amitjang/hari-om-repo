require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");





connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
// const http = require("http");

// const server = http.createServer((req, res) => {
//   console.log("METHOD:", req.method);
//   console.log("URL:", req.url);

//   if (req.method === "POST" && req.url === "/login") {
//     let body = {
//       "message": "POST working"
//     };

//     req.on("data", (chunk) => {
//       body += chunk;
//     });

//     req.on("end", () => {
//       console.log("RAW BODY:", body);

//       let data;
//       try {
//         data = JSON.parse(body);
//       } catch (err) {
//         res.statusCode = 400;
//         return res.end("Invalid JSON");
//       }

//       res.setHeader("Content-Type", "application/json");
//       res.end(
//         JSON.stringify({
//           message: "POST working",
//           received: data,
//         })
//       );
//     });
//   } else {
//     res.statusCode = 404;
//     res.end("Route not found");
//   }
// });

// server.listen(3000, () => {
//   console.log("Server running on http://localhost:3000");
// // });
// const fs=require("fs");
// const http = require("http");

// let cachedData;
// try {
//   cachedData = fs.readFileSync("src/fake-data/user.json","utf-8");
// } catch(err) {
//   console.error("Error reading file:", err);
//   cachedData = "[]";
// }

// const server= http.createServer((req,res)=>{
//   if(req.method==="GET" && req.url==="/users"){
//     res.writeHead(200,{"Content-Type":"application/json"});
//     res.end(cachedData);
//   }
//   else if (req.method==="POST" && req.url==="/add-user"){
//     let body="";
//     req.on("data",(chunk)=>{
//       body+=chunk;
//     });
//     req.on("end",()=>{
//       try {
//         JSON.parse(body);
//         res.writeHead(200,{"Content-Type":"application/json"});
//         res.end(body);
//       } catch(err) {
//         res.writeHead(400,{"Content-Type":"text/plain"});
//         res.end("Invalid JSON");
//       }
//     });
//   }
//   else if (req.method==="DELETE" && req.url==="/delete-user"){
//     res.writeHead(200,{"Content-Type":"text/plain"});
//     res.end("DELETE request received");
    
   
//   }
//   else{
//     res.writeHead(404,{"Content-Type":"text/plain"});
//     res.end("Route not found");
//   }
// });
//   server.listen(3000,()=>{
//     console.log("Server running on http://localhost:3000");
//   })