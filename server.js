const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Serve front-end static files
app.use(express.static(path.join(__dirname, "public")));

// API routes
const carsRoute = require("./api/cars");
const carsByMakeRoute = require("./api/carsByMake");
const favoriteCarRoute = require("./api/favoriteCar");
const favoritesRoute = require("./api/favorites");
const getUserRoute = require("./api/getUser");
const individualCarRoute = require("./api/individualCar");
const loginRoute = require("./api/login");
const logOutRoute = require("./api/logout");
const sellACarRoute = require("./api/sellACar");
const sendEmailRoute = require("./api/sendEmail");
const signupRoute = require("./api/signup");
const updateCarRoute = require("./api/updateCar");

app.use("/api/cars", carsRoute);
app.use("/api/carsByMake", carsByMakeRoute);
app.use("/api/favoriteCar", favoriteCarRoute);
app.use("/api/favorites", favoritesRoute);
app.use("/api/getUser", getUserRoute);
app.use("/api/individualCar", individualCarRoute);
app.use("/api/login", loginRoute);
app.use("/api/logout", logOutRoute);
app.use("/api/sellACar", sellACarRoute);
app.use("/api/sendEmail", sendEmailRoute);
app.use("/api/signup", signupRoute);
app.use("/api/updateCar", updateCarRoute);

// Catch-all route for front-end to handle any unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "frontEnd", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3000; // Fallback to 3000 for local development
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

