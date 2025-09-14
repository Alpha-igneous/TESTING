import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { 
  ArrowRight, 
  Waves, 
  BarChart3, 
  MessageCircle, 
  Sparkles,
  Globe,
  TrendingUp
} from 'lucide-react'

const Hero = ({ onGetStarted }) => {
  const heroRef = useRef(null)
  const [oceanImages, setOceanImages] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchOceanImages = async () => {
      try {
        const response = await fetch(
          'https://api.unsplash.com/search/photos?query=ocean+waves+blue&per_page=5&orientation=landscape',
          {
            headers: {
              Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'demo-key'}`
            }
          }
        )
        const data = await response.json()
        if (data.results) {
          setOceanImages(data.results.map(img => img.urls.regular))
        }
      } catch (error) {
        console.log('Using fallback ocean images')
        setOceanImages([
          'https://images.unsplash.com/photo-1505142468610-359e7d316be0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
          'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
        ])
      }
    }

    fetchOceanImages()
  }, [])

  useEffect(() => {
    if (oceanImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % oceanImages.length)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [oceanImages])

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1 })
    
    tl.fromTo('.hero-title', 
      { y: 100, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }
    )
    .fromTo('.hero-subtitle',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
      "-=1"
    )
    .fromTo('.hero-buttons',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.8"
    )
    .fromTo('.hero-features',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out", stagger: 0.1 },
      "-=0.6"
    )

    gsap.to('.floating-element', {
      y: -10,
      duration: 2,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      stagger: 0.3
    })
  }, [])

  const features = [
    {
      icon: MessageCircle,
      title: "AI Ocean Chat",
      description: "Ask questions about ocean data in natural language"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Visualize ARGO float data with interactive charts"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access ocean data from floats worldwide"
    },
    {
      icon: TrendingUp,
      title: "Smart Insights",
      description: "Get AI-powered insights from research papers"
    }
  ]

  return (
    <div ref={heroRef} className="min-h-screen relative overflow-hidden pt-24 pb-12">
      {oceanImages.length > 0 && (
        <div className="absolute inset-0 -z-10">
          {oceanImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ${
                index === currentImageIndex ? 'opacity-30' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(1px)'
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-cyan-900/70" />
        </div>
      )}

      <div className="container mx-auto px-6 py-16 relative z-10 max-w-7xl">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="hero-title text-5xl md:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
              Explore Ocean Data
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              with AI Power
            </span>
          </h1>

          <p className="hero-subtitle text-lg md:text-xl xl:text-2xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto">
            FloatChat combines cutting-edge AI with real ocean data from ARGO floats.
            <br className="hidden md:block" />
            Ask questions, visualize data, and discover insights about our planet's oceans.
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={onGetStarted}
              className="btn btn-lg bg-gradient-to-r from-cyan-500 to-blue-600 border-none text-white hover:from-cyan-600 hover:to-blue-700 shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 transition-all duration-300 floating-element"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Exploring
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
            <a 
              href="#features"
              className="btn btn-lg btn-outline border-cyan-400 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-300 shadow-lg floating-element"
            >
              <Waves className="w-5 h-5 mr-2" />
              Learn More
            </a>
          </div>
        </div>

        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-16 md:mt-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={index}
                className="hero-features floating-element card bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300 hover:scale-105"
              >
                <div className="card-body text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="card-title text-white justify-center text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Hero