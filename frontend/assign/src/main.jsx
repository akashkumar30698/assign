import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './components/themeProvider'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterForm from './components/register-form'
import LoginForm from './components/login-form'
import Dashboard from './dashboard/dashboard'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/register' element={<RegisterForm/>} />

          <Route path='/login' element={<LoginForm/>} />
          <Route path='/dashboard' element={<Dashboard/>}  />
          
        </Routes>
      </BrowserRouter>
   
    </ThemeProvider>
  </StrictMode>,
)
