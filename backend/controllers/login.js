const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const newUser = require("../models/User");

async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await newUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token with 15-day expiration
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "Akash@312004",
      { expiresIn: "15d" } // Token expires in 15 days
    );

    console.log(user)

    // Set token in HTTP-only cookie (Expires in 15 days)
    res.cookie("token", token, {
      httpOnly: true, // Prevents access via JavaScript (More secure)
      secure: true,
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    });

    return res.status(200).json({ message: "Login successful",userId: user._id });
  } catch (err) {
    console.error("Error at handleUserLogin:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { handleUserLogin };
