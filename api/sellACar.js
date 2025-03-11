const mongoose = require('mongoose')
const multer = require("multer");
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


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${Date.now()}.${ext}`);
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

//post/sell a car
module.exports=[
  isThereLoggedUser,
  upload.array("images", 3),
  async (req, res) => {
    if(req.method==='POST'){
     try {
       console.log(req.file);
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
       } = req.body;
 
       const images = req.files.map((file) => file.filename); // ✅ Correct
 
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
         images,
         carOwnerEmail,
       });
 
       res.json({ message: "Ad created", car: newCar });
     } catch (error) {
       if (error.name === "ValidationError") {
         return res.json({ message: error.message });
       }
     }
    }
   }
]

 
  
  



