const mongoose = require('mongoose')
const isThereLoggedUser = require("../middlewares");
const nodemailer = require("nodemailer");

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

//Send email to the user that posted the car ad
module.exports=[
  isThereLoggedUser,
  async (req, res) => {
  if(req.method==='POST'){
    const { name, email, number, message, carOwnerEmail, subject } = req.body;

  if (!name || !email || !number || !message || !carOwnerEmail) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    // Create a transporter using an email service like Gmail, SMTP, etc.
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.TEMPLATE9BACKEND_GMAIL, // Your email
        pass: process.env.TEMPLATE9BACKEND_APP_PASSWORD, // Your email password or app password
      },
    });

    // Email content
    let mailOptions = {
      from: `"${name}" <${email}>`,

      //You must send the email to the user email, set the user email to the localstorage,
      //you already have a fetch data logs the user to the console,
      //carOwnerEmail is navysealbey@gmail.com just for testing.
      to: carOwnerEmail,
      subject: `${name} is INTERESTED in your ${subject}!`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${number}\n\nMessage:\n${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
}}]

