"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "./components/themeProvider"
import LoginForm from "@/components/login-form"
import RegisterForm from "@/components/register-form"

export default function Home() {
  const [authMode, setAuthMode] = useState("login")
  //const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
   //   router.push("/dashboard")
    }
  }, [])

  return (
    <ThemeProvider defaultTheme="dark" storageKey="chat-theme">
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-primary">ChatSync</h1>
            <p className="text-muted-foreground mt-2">Connect and chat in real-time</p>
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2 rounded-md transition-colors ${
                authMode === "login" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode("register")}
              className={`flex-1 py-2 rounded-md transition-colors ${
                authMode === "register"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {authMode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </ThemeProvider>
  )
}
