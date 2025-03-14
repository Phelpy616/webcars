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

//Get the car by the make
module.exports =  async (req, res) => {
if(req.method === 'GET'){  
  try {
  const { make } = req.query; // Get search term from query string
  let filter = {};

  if (!make) return res.json({ message: "Please type a make." });

  if (make) {
    filter.make = new RegExp(make, "i"); // Case-insensitive search
  }

  const cars = await Car.find(filter);

  if (!cars.length) return res.json({ message: "No cars with this make!" });

  // Ensure an exact match
  const exactMatch = cars.some(
    (car) => car.make.toLowerCase() === make.toLowerCase()
  );

  if (!exactMatch) return res.json({ message: "No cars with this make!" });

  res.json({ cars });
} catch (error) {
  console.error(error);
  res.status(500).json({ message: "Error fetching cars" });
}}
};


