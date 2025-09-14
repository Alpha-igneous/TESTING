import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { MessageCircle, BarChart3, Users } from 'lucide-react'

const Hero = ({ onGetStarted }) => {
  const heroRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 1 })
    
    tl.fromTo('.hero-title', 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
    )
    .fromTo('.hero-subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.8"
    )
    .fromTo('.hero-button',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.6"
    )
    .fromTo('.features-section',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" },
      "-=0.4"
    )
  }, [])

  const features = [
    {
      icon: MessageCircle,
      title: "Conversational AI",
      description: "Engage with an AI assistant to query and understand ocean data."
    },
    {
      icon: BarChart3,
      title: "Data Visualization",
      description: "Visualize complex data sets with interactive charts and graphs."
    },
    {
      icon: Users,
      title: "Collaborative Insights",
      description: "Share insights and collaborate with fellow oceanographers."
    }
  ]

  return (
    <div ref={heroRef} className="min-h-screen relative pt-24 pb-16">
      {/* Hero Section */}
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto mb-24">
          <h1 className="hero-title text-5xl md:text-6xl font-bold text-white mb-6">
            Dive into Ocean Data
          </h1>
          
          <p className="hero-subtitle text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore the depths of ocean data with our AI-powered conversational interface.
          </p>
          
          <button 
            onClick={onGetStarted}
            className="hero-button btn bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg rounded-full border-none shadow-lg transition-all duration-300"
          >
            Start Exploring
          </button>
        </div>

        {/* Key Features Section */}
        <div className="features-section">
          <h2 className="text-3xl font-bold text-white mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div 
                  key={index}
                  className="bg-slate-800/60 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 hover:bg-slate-800/80 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <IconComponent className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero