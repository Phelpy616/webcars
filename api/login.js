const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const cookie = require("cookie"); // Add this import
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

module.exports= async (req, res) => {
  if(req.method==='POST'){
    const email = req.body.email;
    const password = req.body.password;

  if (!email || !password)
    return res.json({ message: "Please provide a valid email and password!" });

  const user = await User.findOne({ email: email });

  if (!user) return res.json({ message: "User not found!" });

  if (password !== user.password)
    return res.json({ message: "Wrong password!" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  // Use the cookie module to manually set the cookie in the response header
  res.setHeader('Set-Cookie', cookie.serialize('jwt', token, {
    httpOnly: true,
    secure: true, // Set to true when in production with HTTPS
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    path: '/', // Makes the cookie available across the entire site
  }));

  res.json({ message: "User logged in!" });
  }
};


