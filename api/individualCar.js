const mongoose = require('mongoose')
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

//get individual car
module.exports = async (req, res) => {
  if(req.method==='GET'){
    // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.carId)) {
    return res.json({ message: "Invalid car ID" });
  }

  try {
    const car = await Car.findById(req.params.carId);
    if (!car) {
      return res.json({ message: "Car not found" });
    }

    res.json({ car });
  } catch (error) {
    console.error("Error fetching car:", error);
    res.json({ message: "Server error" });
  }
}};


