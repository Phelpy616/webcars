const mongoose = require("mongoose")
const { Car } = require("../models"); 

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


//Get all cars
module.exports = async (req, res) => {
  if (req.method === "GET") {
    try {
      const cars = await Car.find();
      return res.status(200).json({ cars });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  return res.status(405).json({ error: "Method Not Allowed" });
};


