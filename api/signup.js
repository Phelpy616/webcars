const mongoose = require('mongoose')
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

//Sign up
//objective: create user, send token
module.exports = async (req, res) => {
  if(req.method==='POST'){
    try {
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists)
        return res.json({
          message: "There is already an account with that email!",
        });
  
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      });
  
      return res.json({ message: "User signed up", newUser });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.json({ message: error.message });
      } else if (error.code === 11000) {
        // MongoDB duplicate key error code
        return res.json({ message: "That name is already taken!" });
      }
    }
  }
};


