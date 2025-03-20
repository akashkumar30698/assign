"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Phone, Video, Info, Search, Check, CheckCheck, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";


export default function ChatWindow({ contact, messages, isTyping, onSendMessage, onTyping }) {
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    onTyping(e.target.value.length > 0);
  };

  const handleInputBlur = () => {
    onTyping(false);
  };

  useEffect(() => {
    console.log("Messages Updated:", messages);
  }, [messages]);

  const filteredMessages = searchQuery
    ? messages.filter((msg) => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.isAI ? <Bot className="h-5 w-5" /> : contact.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium">{contact.name}</h2>
            <p className="text-xs text-muted-foreground">
              {contact.status === "online" ? "Online" : "Offline"}
              {isTyping && " • Typing..."}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSearching(!isSearching)}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isSearching && (
        <div className="p-2 border-b border-border">
          <Input
            placeholder="Search in conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            autoFocus
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          filteredMessages.map((message) => {
            const isUserMessage = message.senderId === id ;
            const messageDate = new Date(message.timestamp);

            return (
              <div key={message.id} className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] ${
                    searchQuery && message.text.toLowerCase().includes(searchQuery.toLowerCase()) ? "bg-yellow-500/20" : ""
                  }`}
                >
                  <div className={`px-4 py-2 rounded-lg ${isUserMessage ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                    {message.text}
                  </div>
                  <div className={`flex items-center mt-1 text-xs text-muted-foreground ${isUserMessage ? "justify-end" : "justify-start"}`}>
                    <span>{format(messageDate, "h:mm a")}</span>
                    {isUserMessage && (
                      <span className="ml-1">
                        {message.status === "read" ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            placeholder="Type a message..."
            value={messageText}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!messageText.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
