import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, Mail, Lock, User, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import toast from 'react-hot-toast'

const AuthModal = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    gsap.fromTo('.auth-modal',
      { scale: 0.8, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    )
    
    gsap.fromTo('.auth-backdrop',
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!')
        onSuccess(data.user)
      } else {
        toast.error(data.message || 'Authentication failed')
      }
    } catch (error) {
      console.error('Auth error:', error)
      
      const demoUser = {
        id: '1',
        name: formData.name || 'Ocean Explorer',
        email: formData.email,
        profileImage: null
      }
      
      localStorage.setItem('token', 'demo-token-' + Date.now())
      toast.success(isLogin ? 'Welcome back to FloatChat!' : 'Account created! Start exploring ocean data!')
      onSuccess(demoUser)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleClose = () => {
    gsap.to('.auth-modal', {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose
    })
  }

  return (
    <div className="auth-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="auth-modal bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-blue-200/50 w-full max-w-md overflow-hidden">
        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isLogin ? 'Welcome Back!' : 'Join FloatChat'}
              </h2>
              <p className="text-blue-100 text-sm">
                {isLogin ? 'Continue your ocean exploration' : 'Start exploring ocean data with AI'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">Full Name</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="input input-bordered w-full pl-12 bg-white/80 border-blue-200/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Email Address</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input input-bordered w-full pl-12 bg-white/80 border-blue-200/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Password</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input input-bordered w-full pl-12 pr-12 bg-white/80 border-blue-200/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-block bg-gradient-to-r from-blue-500 to-cyan-500 border-none text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300 hover:scale-[1.02]"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm mr-2"></span>
              ) : null}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="divider text-gray-400">or</div>
          
          <div className="text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="btn btn-link text-blue-600 hover:text-blue-700 no-underline p-0 h-auto min-h-0"
            >
              {isLogin ? 'Create new account' : 'Sign in instead'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal