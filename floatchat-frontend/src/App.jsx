import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import gsap from 'gsap'
import './App.css'

// Import components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ChatInterface from './components/ChatInterface'
import DataVisualization from './components/DataVisualization'
import AuthModal from './components/AuthModal'
import OceanBackground from './components/OceanBackground'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState(null)
  const appRef = useRef(null)

  useEffect(() => {
    // Initialize GSAP animations
    gsap.fromTo(appRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1.5, ease: "power2.out" }
    )
  }, [])

  return (
    <div ref={appRef} className="App min-h-screen relative overflow-hidden bg-slate-900">
      <OceanBackground />
      <Router>
        <div className="relative z-10">
          <Navbar 
            isAuthenticated={isAuthenticated}
            user={user}
            onAuthClick={() => setShowAuthModal(true)}
            onLogout={() => {
              setIsAuthenticated(false)
              setUser(null)
            }}
          />
          
          <Routes>
            <Route path="/" element={
              <>
                <Hero onGetStarted={() => setShowAuthModal(true)} />
                <ChatInterface isAuthenticated={isAuthenticated} />
              </>
            } />
            <Route path="/data" element={<DataVisualization />} />
          </Routes>

          {showAuthModal && (
            <AuthModal
              onClose={() => setShowAuthModal(false)}
              onSuccess={(userData) => {
                setIsAuthenticated(true)
                setUser(userData)
                setShowAuthModal(false)
              }}
            />
          )}
        </div>
      </Router>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
