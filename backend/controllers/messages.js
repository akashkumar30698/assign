const Message = require("../models/Message"); 


async function handleAllMessages(){
    try {
        const messages = await Message.find({
          $or: [
            { senderId: req.params.userId, receiverId: req.params.contactId },
            { senderId: req.params.contactId, receiverId: req.params.userId },
          ],
        }).sort("timestamp");
    
        res.json(messages);
      } catch (err) {
        res.status(500).json({ error: "Error fetching messages" });
      }   
}

module.exports = {
    handleAllMessages
}