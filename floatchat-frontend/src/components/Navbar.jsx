import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Settings, User } from 'lucide-react'

const Navbar = ({ isAuthenticated, user, onAuthClick, onLogout }) => {
  useEffect(() => {
    // Animate navbar on mount
    gsap.fromTo('.navbar', 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.5 }
    )
  }, [])

  return (
    <div className="navbar bg-slate-900/95 backdrop-blur-md fixed top-0 z-50 px-6">
      <div className="navbar-start">
        {/* Empty space for balanced layout */}
      </div>
      
      <div className="navbar-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-gray-200 transition-colors">
          FloatChat
        </Link>
      </div>
      
      <div className="navbar-end">
        {isAuthenticated ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <Settings className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-slate-800/95 backdrop-blur-md rounded-box w-52">
              <li>
                <a className="text-gray-300 hover:text-white">
                  <User className="w-4 h-4" />
                  Profile
                </a>
              </li>
              <li>
                <a 
                  onClick={onLogout}
                  className="text-red-400 hover:text-red-300"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <button className="btn btn-ghost btn-circle">
            <Settings className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar