const mongoose = require('mongoose')
const multer = require("multer");
const path = require("path"); // Require path module
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

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/images"));
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.originalname.split('.')[0]}-${Date.now()}.${ext}`);
    },
  });
  
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Only images allowed."), false);
    }
  };
  
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

module.exports=[
  upload.array("images", 3),
  async (req, res)=>{
  if(req.method==='PATCH'){
    const  carId  = req.params.carId;
  const userEmail = req.body.userEmail;
  const updateData = { ...req.body }; // Copy request body
  const images = req.files.map((file) => file.filename);


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

