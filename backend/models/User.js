const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    profileImageURL: {
      type: String, // Can store Cloudinary URL or local path
      default: "",
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const User = mongoose.model("User", userSchema);

module.exports = User;
