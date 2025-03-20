const User = require("../models/User");


 async function handleAllUser(req,res){
 try {
      const userId = req.query.userId; // Get the logged-in user's ID from query params
  
      const users = await User.find({ _id: { $ne: userId } }).select("-password"); // Exclude the logged-in user
  
      // AI Assistant (permanent contact)
      const aiAssistant = {
        id: "ai-assistant",
        name: "AI Assistant",
        status: "online",
        lastMessage: "How can I help you today?",
        lastMessageTime: new Date().toISOString(),
        isAI: true,
      };
  
      res.json([aiAssistant, ...users]); // Ensure AI Assistant is always included
    } catch (err) {
      res.status(500).json({ error: "Error fetching users" });
    }
}

module.exports = {
    handleAllUser
}
