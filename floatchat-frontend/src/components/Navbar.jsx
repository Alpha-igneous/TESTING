import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { 
  Waves, 
  User, 
  LogOut, 
  BarChart3, 
  MessageCircle, 
  Menu, 
  X 
} from 'lucide-react'

const Navbar = ({ isAuthenticated, user, onAuthClick, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Animate navbar on mount
    gsap.fromTo('.navbar', 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.5 }
    )
  }, [])

  const navLinks = [
    { path: '/', label: 'Chat', icon: MessageCircle },
    { path: '/data', label: 'Ocean Data', icon: BarChart3 },
  ]

  return (
    <div className="navbar bg-base-100/90 backdrop-blur-md fixed top-0 z-50 border-b border-blue-200/30">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl text-blue-600 hover:text-blue-700">
          <Waves className="w-6 h-6 mr-2" />
          <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            FloatChat
          </span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">
          {navLinks.map((link) => {
            const IconComponent = link.icon
            const isActive = location.pathname === link.path
            
            return (
              <li key={link.path}>
                <Link 
                  to={link.path}
                  className={`btn btn-ghost normal-case ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-600 border border-blue-300/50' 
                      : 'hover:bg-blue-500/10 hover:text-blue-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      
      <div className="navbar-end">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full ring-2 ring-blue-500/50 ring-offset-2 ring-offset-base-100">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt="Profile" />
                ) : (
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100/95 backdrop-blur-md rounded-box w-52 border border-blue-200/30">
              <li className="menu-title">
                <span className="text-blue-600">Welcome back!</span>
              </li>
              <li>
                <a className="justify-between hover:bg-blue-500/10">
                  Profile
                  <User className="w-4 h-4" />
                </a>
              </li>
              <div className="divider my-1"></div>
              <li>
                <a 
                  onClick={onLogout}
                  className="text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <button 
            onClick={onAuthClick}
            className="btn btn-primary bg-gradient-to-r from-blue-500 to-cyan-500 border-none text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <User className="w-4 h-4 mr-2" />
            Sign In
          </button>
        )}
        
        {/* Mobile menu button */}
        <div className="dropdown dropdown-end lg:hidden ml-2">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100/95 backdrop-blur-md rounded-box w-52 border border-blue-200/30">
            {navLinks.map((link) => {
              const IconComponent = link.icon
              const isActive = location.pathname === link.path
              
              return (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className={`${isActive ? 'bg-blue-500/20 text-blue-600' : ''}`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar