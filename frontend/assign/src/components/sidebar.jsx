"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Search, Moon, Sun, User, Bot } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useLocation } from "react-router-dom"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"


const SERVER_URL = "http://localhost:8000" // Change this to your actual backend URL

export default function Sidebar({ selectedContact, onSelectContact }) {
  const [contacts, setContacts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const id = searchParams.get("id")


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/users?userId=${id}`)
        const data = await response.json()
        setContacts(data) // Update the state with the fetched users
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }
    fetchUsers()
  }, [id])

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleLogout = () => {
    Cookies.remove("token")
    navigate("/")
    
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="w-80 border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">ChatSync</h1>
        <div className="flex space-x-2">
         {/* <Button variant="ghost" size="icon" onClick={toggleTheme}> 
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          */}
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h2 className="text-sm font-semibold text-muted-foreground px-2 py-1">Contacts</h2>
          <div className="space-y-1 mt-1">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                className={`w-full flex items-center space-x-3 px-2 py-2 rounded-md transition-colors ${
                  selectedContact?.id === contact.id ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                }`}
                onClick={() => onSelectContact(contact)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>
                      {contact.isAI ? <Bot className="h-5 w-5" /> : contact.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {contact.status === "online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{contact.name}</span>
                    {contact.unread ? (
                      <Badge variant="default" className="ml-2">
                        {contact.unread}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {contact.lastMessage || (contact.isAI ? "AI Assistant" : "No messages yet")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{id && "You"}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>
    </div>
  )
}
