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
    required: true
  },

  year: {
    type: Number,
    required: true,
    minlength: [4, "Must be 4 numbers, like 2024!"],
    maxlength: [4, "Must be 4 numbers, like 2024!"],
    required: true
  },

  color: {
    type: String,
    required: true,
    minlength: [2, "Must be 2-15 characters."],
    maxlength: [15, "Must be 2-15 characters."],
    required: true
  },

  //Numbers should be stored as numbers, to math operations
  //sorting and filtering, here I'm using string because it's a template for demonstration
  miles: { type: String, required: true },

  fueltype: { type: String, required: true },

  gearbox: { type: String, required: true },

  city: { type: String, required: true },

  //Numbers should be stored as numbers, to math operations
  //sorting and filtering, here I'm using string because it's a template for demonstration
  price: { type: String, required: true },

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

  description: {
    type:String,
    minlength: [5, 'Description must have at least 5 letters'],
    maxlength: [60, 'Description must have a maximum of 60 letters']
  }
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
