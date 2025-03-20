const bcrypt = require("bcrypt");
const newUser = require("../models/User"); // Import your User model

// Sign Up
async function handleUserRegister(req, res) {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const userExist = await newUser.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const saltrounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltrounds);

    // Create a new user
    await newUser.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error at handleUserRegister:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { handleUserRegister };
