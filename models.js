const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  model: {
    type: String,
    minlength: [2, "Must be 2-40 characters."],
    maxlength: [40, "Must be 2-40 characters."],
    required: true,
  },

  make: {
    type: String,
    required: true,
    minlength: [2, "Must be 2-15 characters."],
    maxlength: [15, "Must be 2-15 characters."],
  },

  year: {
    type: Number,
    required: true,
    minlength: [4, "Must be 4 numbers, like 2024!"],
    maxlength: [4, "Must be 4 numbers, like 2024!"],
  },

  color: {
    type: String,
    required: true,
    minlength: [2, "Must be 2-15 characters."],
    maxlength: [15, "Must be 2-15 characters."],
  },

  miles: { type: Number },

  fueltype: { type: String },

  gearbox: { type: String },

  city: { type: String },

  price: { type: Number, required: true },

  images: {
    type: [String], // Array of image URLs
    // required: true,
  }, // Store file paths (URLs) in an array

  armored: {
    type: Boolean,
    default: false,
    required: true,
  },

  carOwnerEmail: { type: String },
});

//user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    minlength: 2,
    maxlength: 20,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  passwordConfirm: {
    type: String,
    validate: {
      validator: function (value) {
        // `this` refers to the current document
        return value === this.password;
      },
      message: "Passwords do not match",
    },
  },

  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
});

const Car = mongoose.model("Car", carSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Car, User };
