const mongoose = require('mongoose')
const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2
const isThereLoggedUser = require("../middlewares");
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

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params:{
    folder: "cars_images",
    format: async (req, file) => 'jpeg',
    public_id:(req, file) => `${Date.now()}-${file.originalname}`
  }
})

const upload = multer({ storage });

//post/sell a car
module.exports=[
  isThereLoggedUser,
  upload.array("images", 3),
  async (req, res) => {
    if(req.method==='POST'){
     try {
       console.log(req.files);
       console.log(req.body);
 
       const {
         model,
         make,
         year,
         color,
         miles,
         fueltype,
         gearbox,
         city,
         price,
         armored,
         carOwnerEmail,
         description
       } = req.body;
 
       const images = req.files.map((file) => file.path); // ✅ Correct
 
       const newCar = await Car.create({
         model,
         make,
         year,
         color,
         miles,
         fueltype,
         gearbox,
         city,
         price,
         armored,
         images, // Save image URLs
         carOwnerEmail,
         description
       });
 
       res.json({ message: "Ad created", car: newCar });
     } catch (error) {
       if (error.name === "ValidationError") {
         return res.json({ message: error.message });
       }
       console.error("Error posting car:", error);
     }
    }
   }
]

 
  
  



