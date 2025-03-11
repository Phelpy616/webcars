const mongoose = require('mongoose')
const isThereLoggedUser = require("../middlewares");


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

//Log out
//objective: delete token, if there's a token there's a logged in user
module.exports = [isThereLoggedUser,(req, res) => {
  if(req.method==='POST'){
    res.cookie("jwt", "", { httpOnly: true, maxAge: 0 });
  res.json({ message: "Logged out successfully!" });
}}];


