// Simple AI chat simulation with pattern matching
// In a real app, you would use a proper NLP model or API

const responses = {
    greeting: [
      "Hello! How can I help you today?",
      "Hi there! What can I do for you?",
      "Hey! How are you doing?",
      "Greetings! How may I assist you?",
    ],
    farewell: [
      "Goodbye! Have a great day!",
      "See you later! Take care!",
      "Bye for now! Feel free to message again if you need anything.",
      "Until next time! Have a wonderful day!",
    ],
    thanks: ["You're welcome!", "Happy to help!", "Anytime!", "No problem at all!"],
    help: [
      "I'm here to help! What do you need assistance with?",
      "I'd be happy to help. What's on your mind?",
      "How can I assist you today?",
      "I'm your AI assistant. What can I help you with?",
    ],
    weather: [
      "I don't have real-time weather data, but I can pretend! Let's say it's sunny with a chance of AI.",
      "If I had to guess, it's probably a good day to chat with an AI!",
      "I don't have access to current weather information, but I'm always sunny!",
      "I can't check the weather, but I hope it's nice wherever you are!",
    ],
    joke: [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What did one wall say to the other wall? I'll meet you at the corner!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "How does a penguin build its house? Igloos it together!",
    ],
    default: [
      "That's interesting! Tell me more.",
      "I understand. Is there anything specific you'd like to know?",
      "I see. How can I help with that?",
      "Interesting point. What are your thoughts on this?",
    ],
  };
  
  async function aiRespond(message) {
    const lowerMessage = message.toLowerCase();
  
    // Check for greetings
    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("hey") ||
      lowerMessage.match(/^(hello|hi|hey|greetings).{0,10}$/)
    ) {
      return getRandomResponse("greeting");
    }
  
    // Check for farewells
    if (
      lowerMessage.includes("goodbye") ||
      lowerMessage.includes("bye") ||
      lowerMessage.includes("see you") ||
      lowerMessage.includes("talk to you later")
    ) {
      return getRandomResponse("farewell");
    }
  
    // Check for thanks
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks") || lowerMessage.includes("appreciate")) {
      return getRandomResponse("thanks");
    }
  
    // Check for help requests
    if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("assist") ||
      lowerMessage.includes("support") ||
      lowerMessage.includes("how do i")
    ) {
      return getRandomResponse("help");
    }
  
    // Check for weather questions
    if (
      lowerMessage.includes("weather") ||
      lowerMessage.includes("temperature") ||
      lowerMessage.includes("forecast") ||
      lowerMessage.includes("rain") ||
      lowerMessage.includes("sunny")
    ) {
      return getRandomResponse("weather");
    }
  
    // Check for joke requests
    if (
      lowerMessage.includes("joke") ||
      lowerMessage.includes("funny") ||
      lowerMessage.includes("make me laugh") ||
      lowerMessage.includes("tell me something funny")
    ) {
      return getRandomResponse("joke");
    }
  
    // If no pattern matches, use default responses
    return getRandomResponse("default");
  }
  
  function getRandomResponse(category) {
    const options = responses[category] || responses.default;
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }
  
  export { aiRespond };
  