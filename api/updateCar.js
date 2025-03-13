const mongoose = require('mongoose')
const multer = require("multer");
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2
const { User, Car } = require("../models"); 

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

module.exports=[
  upload.array("images", 3),
  async (req, res)=>{
  if(req.method==='PATCH'){
  const  carId  = req.params.carId;
  const userEmail = req.body.userEmail;
  const updateData = { ...req.body }; // Copy request body
  const images = req.files.map((file) => file.path);


  const user = await  User.findOne({email: userEmail})
  if (!user) {
      return res.json({ message: "User not found" });
  }

  const car = await Car.findById(carId)
  if(!car){
      return res.json({ message: "Car not found" });
  }

  // Merge images into updateData
  updateData.images = images; // Add images array to updateData

  const updatedCar = await Car.findByIdAndUpdate(carId, updateData, {
      new: true, // Return updated car
      runValidators: true, // Ensure validation rules apply
    });

    res.json({ message: "Car updated successfully", updatedCar });
}
}]   

