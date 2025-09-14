import { useEffect, useState } from 'react'

const OceanBackground = () => {
  const [oceanImage, setOceanImage] = useState(null)

  useEffect(() => {
    const fetchOceanImage = async () => {
      try {
        const response = await fetch(
          'https://api.unsplash.com/search/photos?query=dark+ocean+waves+night&per_page=1&orientation=landscape',
          {
            headers: {
              Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
            }
          }
        )
        const data = await response.json()
        if (data.results && data.results[0]) {
          setOceanImage(data.results[0].urls.full)
        }
      } catch (error) {
        console.log('Using fallback ocean image')
        // Beautiful dark ocean fallback
        setOceanImage('https://images.unsplash.com/photo-1551244072-5d12893278ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')
      }
    }

    fetchOceanImage()
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      {/* Beautiful ocean background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: oceanImage ? `url(${oceanImage})` : undefined,
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Dark gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-slate-900/90" />
      
      {/* Fallback gradient if image fails to load */}
      {!oceanImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />
      )}
    </div>
  )
}

export default OceanBackground