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

//get user
module.exports = [
  isThereLoggedUser, 
  async (req, res) => {
    if(req.method ==='GET'){let token = req.cookies.jwt;
  
      // Check if the token is missing
      if (!token) {
        return res.json({ message: "Not authenticated" });
      }
    
      try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        // Check if the decoded data exists
        if (!decoded) {
          return res.json({ message: "Invalid token" });
        }
    
        // Find the current user
        const currentUser = await User.findById(decoded.id);
    
        // If no user is found, send a response indicating the user no longer exists
        if (!currentUser) {
          return res.status(404).json({
            message: "The user belonging to this token no longer exists",
          });
        }
    
        // Send the user information back
        res.json({ currentUser });
      } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Invalid or expired token" });
      }}
  }] 


