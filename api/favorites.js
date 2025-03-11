const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const isThereLoggedUser = require("../middlewares");
const { User } = require("../models"); 


// Use a global variable to prevent multiple connections in serverless environments
if (!global.mongoose) {
  global.mongoose = mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((conn) => {
      console.log("MongoDB connected");
      return conn;
    })
    .catch((error) => console.log(error));
}

// Get the user favorited cars
module.exports = [
  isThereLoggedUser,
  async (req, res) => {
  if(req.method==='GET'){
    try {
      const token = req.cookies.jwt; // Get token from cookies
  
      if (!token) {
        // If no token is found, return an error message
        return res.json({ message: "JWT must be provided. Please log in." });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
      req.user = await User.findById(decoded.id).select("-password"); // Attach user to req
  
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      const user = await User.findById(req.user._id).populate("favorites");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ favorites: user.favorites });
    } catch (error) {
      // Handle errors properly, such as invalid token or other issues
      console.error(error);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid token" });
      }
      res.status(500).json({ message: "Error fetching favorites" });
    }
}}];


