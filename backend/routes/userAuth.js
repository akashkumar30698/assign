const express = require("express");
const router = express.Router();
const { handleUserRegister } = require("../controllers/userAuth");
const { handleUserLogin } = require("../controllers/login");
const { handleAllUser } = require("../controllers/user")
const { handleAllMessages } = require("../controllers/messages")

// Register
router.post("/register", handleUserRegister);

// Login
router.post("/login", handleUserLogin);


router.get("/users",handleAllUser);
  
  

// Fetch messages between two users
router.get("/messages/:userId/:contactId",handleAllMessages);

module.exports = {  
    router 

}; // Export router properly
