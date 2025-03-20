
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const express = require('express');
const app = express();
const server = createServer(app);
const Message = require("./models/Message")


/**
 * 
 * 
 * 
 */
const io = new Server(server, {
  cors: {
    origin: `https://assign-tawny.vercel.app`, // Ensure this matches your React app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  },
});

//
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("message", async (message) => {
    try {
      const newMessage = new Message(message);
      await newMessage.save();

      io.to(message.receiverId).emit("message", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("typing", ({ userId, receiverId, isTyping }) => {
    io.emit("typing", { userId, receiverId, isTyping });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/messages/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ timestamp: 1 });

    res.setHeader("Access-Control-Allow-Origin", "https://assign-tawny.vercel.app");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});


module.exports = { io, server, app,express };