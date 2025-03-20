"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "../components/themeProvider"
import Sidebar from "../components/sidebar"
import ChatWindow from "../components/chat-window"
import { io } from "socket.io-client"
import { aiRespond } from "../services/ai-chat"
import { useLocation } from "react-router-dom"

const SERVER_URL = "http://localhost:8000" // Update this

export default function Dashboard() {
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [messages, setMessages] = useState({})
  const [socket, setSocket] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get("id")

  // Fetch contacts from database
  useEffect(() => {
  
    if (!id) return;
  
    fetch(`${SERVER_URL}/users?userId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setContacts(data);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [id]);
  

  useEffect(() => {

    const newSocket = io(SERVER_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    setSocket(newSocket)

    newSocket.on("connect", () => console.log("Connected to WebSocket server"))

    newSocket.on("message", (message) => {
      setMessages((prev) => ({
        ...prev,
        [message.senderId]: [...(prev[message.senderId] || []), message],
      }))

      if (selectedContact?._id !== message.senderId) {
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === message.senderId ? { ...contact, unread: (contact.unread || 0) + 1 } : contact
          )
        )
      }
    })

    newSocket.on("typing", ({ userId, isTyping }) => {
      if (selectedContact?.id === userId) {
        setIsTyping(isTyping)
      }
    })

    newSocket.on("status", ({ userId, status }) => {
      setContacts((prev) =>
        prev.map((contact) => (contact.id === userId ? { ...contact, status } : contact))
      )
    })

    return () => {
      newSocket.disconnect()
    }
  }, [selectedContact])

  useEffect(() => {
    setMessages(
      contacts.reduce((acc, contact) => ({ ...acc, [contact.id]: [] }), {})
    )
  }, [contacts])

  const handleContactSelect = (contact) => {
    setSelectedContact(contact)

    if (contact.unread) {
      setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, unread: 0 } : c)))
    }
  }

  useEffect(() => {
    if (!selectedContact || !id) return

    fetch(`${SERVER_URL}/messages/${id}/${selectedContact._id}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => ({ ...prev, [selectedContact._id]: data }))
      })
      .catch((err) => console.error("Error fetching messages:", err))
  }, [selectedContact])

  useEffect(()=>{
      console.log("socket :",socket) 
  },[socket])

  const handleSendMessage = async (text) => {
    if (!selectedContact || !socket || !id) {
      console.log(selectedContact._id,socket)
      return
    }
    const newMessage = {
      id: `msg-${Date.now()}`,
      text,
      senderId: `${id}`,
      receiverId: selectedContact._id,
      timestamp: new Date().toISOString(),
      status: "sent",
    }

    setMessages((prev) => ({
      ...prev,
      [selectedContact._id]: [...(prev[selectedContact._id] || []), newMessage],
    }))

    socket.emit("message", newMessage)

    if (selectedContact.isAI) {
      setIsTyping(true)
      setTimeout(async () => {
        const aiResponse = await aiRespond(text)

        const responseMessage = {
          id: `msg-${Date.now() + 1}`,
          text: aiResponse,
          senderId: selectedContact._id,
          receiverId: `${id}`,
          timestamp: new Date().toISOString(),
          status: "received",
        }

        socket.emit("message", responseMessage)

        setIsTyping(false)

        setMessages((prev) => ({
          ...prev,
          [selectedContact._id]: [...(prev[selectedContact._id] || []), responseMessage],
        }))
      }, 1000 + Math.random() * 2000)
    }
  }

  const handleTyping = (isTyping) => {
    if (!selectedContact || !socket || !id) {
      console.log(selectedContact, socket)
      return
    }

    socket.emit("typing", {
      userId: `${id}`,
      receiverId: selectedContact._id,
      isTyping,
    })
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="chat-theme">
      <div className="flex h-screen bg-background">
        <Sidebar contacts={contacts} selectedContact={selectedContact} onSelectContact={handleContactSelect} />

        {selectedContact ? (
          <ChatWindow
            contact={selectedContact}
            messages={messages[selectedContact._id] || []}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-primary mb-2">Welcome to ChatSync</h2>
              <p className="text-muted-foreground">Select a contact to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}
