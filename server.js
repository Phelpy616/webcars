const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Serve front-end static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
const api = require('./api');
app.use("/api", api);


// app.use("/api", require("api")); // This loads all the route handlers in the 'api' folder

// Catch-all route for front-end to handle any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "frontEnd", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000; // Fallback to 3000 for local development
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

