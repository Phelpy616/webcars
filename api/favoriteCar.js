const mongoose = require("mongoose")
const isThereLoggedUser = require('../middlewares');
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

// Favorite a car
module.exports = [
  isThereLoggedUser, // Middleware to check if a user is logged in
  async (req, res) => {
    if (req.method === 'PATCH') {
      const { carId } = req.params;
      const userId = req.body.userId;

      try {
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const isFavorite = user.favorites.includes(carId);

        if (isFavorite) {
          // Remove from favorites if already in the list
          user.favorites = user.favorites.filter((id) => id.toString() !== carId);
        } else {
          // Add to favorites if not in the list
          user.favorites.push(carId);
        }

        await user.save();
        res.json({
          message: "Car favorited",
          favorites: user.favorites,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating favorite status" });
      }
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  }
];


