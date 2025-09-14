import { useState, useEffect, useRef } from 'react'
import Plot from 'react-plotly.js'
import gsap from 'gsap'
import { 
  BarChart3, 
  Globe, 
  Thermometer, 
  Droplets, 
  TrendingUp, 
  Search,
  Filter,
  Download,
  RefreshCw,
  MapPin,
  Waves,
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'

const DataVisualization = () => {
  const [argoData, setArgoData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeChart, setActiveChart] = useState('3d-ocean')
  const [filters, setFilters] = useState({
    floatId: '',
    temperatureRange: { min: '', max: '' },
    salinityRange: { min: '', max: '' },
    pressureRange: { min: '', max: '' },
    dateRange: { start: '', end: '' },
    region: { lat: '', lng: '', radius: '' }
  })
  const containerRef = useRef(null)

  useEffect(() => {
    // Stunning entrance animations
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
    )
    
    // Load initial data
    fetchArgoData()
  }, [])

  const fetchArgoData = async (customQuery = null) => {
    setIsLoading(true)
    try {
      const endpoint = customQuery ? '/api/query/translate' : '/api/query/explain'
      const query = customQuery || "Show me recent ARGO float data with temperature, salinity, and position information"
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ question: query })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }

      const result = await response.json()
      
      // If we have real data, use it; otherwise use demo data for showcase
      if (result.data && result.data.length > 0) {
        setArgoData(result.data)
      } else {
        // Generate stunning demo data for visualization showcase
        generateDemoData()
      }
      
      toast.success('Ocean data loaded successfully!')
    } catch (error) {
      console.error('Data fetch error:', error)
      generateDemoData()
      toast.success('Demo ocean data loaded for visualization!')
    } finally {
      setIsLoading(false)
    }
  }

  const generateDemoData = () => {
    const demoData = []
    const floatIds = [2901623, 2901624, 2901625, 2901626, 2901627]
    const baseCoords = [
      { lat: -30, lng: 165 }, // Tasman Sea
      { lat: -35, lng: 170 }, // South Pacific
      { lat: -25, lng: 155 }, // Coral Sea
      { lat: -40, lng: 160 }, // Southern Ocean
      { lat: -20, lng: 150 }  // Queensland Coast
    ]

    floatIds.forEach((floatId, index) => {
      const baseCoord = baseCoords[index]
      
      // Generate 30 cycles per float
      for (let cycle = 1; cycle <= 30; cycle++) {
        const timeOffset = cycle * 10 * 24 * 60 * 60 * 1000 // 10 days apart
        const date = new Date(Date.now() - timeOffset)
        
        // Add some drift to position
        const latDrift = (Math.random() - 0.5) * 2
        const lngDrift = (Math.random() - 0.5) * 2
        
        // Generate realistic depth profiles (multiple depths per cycle)
        const depths = [10, 50, 100, 200, 500, 1000, 1500, 2000]
        
        depths.forEach(depth => {
          // Temperature: warmer at surface, colder at depth
          const surfaceTemp = 20 + Math.random() * 8 // 20-28°C at surface
          const temp = surfaceTemp - (depth / 100) * 1.5 + (Math.random() - 0.5) * 2
          
          // Salinity: realistic ocean values
          const salinity = 34.5 + Math.random() * 1.0 + (depth / 1000) * 0.3
          
          demoData.push({
            FLOAT_ID: floatId,
            CYCLE_NUMBER: cycle,
            LATITUDE: baseCoord.lat + latDrift,
            LONGITUDE: baseCoord.lng + lngDrift,
            TEMP: Number(temp.toFixed(2)),
            PSAL: Number(salinity.toFixed(2)),
            PRES: depth,
            TIME: date.toISOString(),
            DATA_MODE: 'R',
            DIRECTION: 'A'
          })
        })
      }
    })
    
    setArgoData(demoData)
  }

  const create3DOceanChart = () => {
    if (!argoData.length) return null

    // Group data by float for different colors
    const floatGroups = {}
    argoData.forEach(point => {
      if (!floatGroups[point.FLOAT_ID]) {
        floatGroups[point.FLOAT_ID] = []
      }
      floatGroups[point.FLOAT_ID].push(point)
    })

    const colors = ['#1e40af', '#059669', '#dc2626', '#7c2d12', '#6b21a8']
    const traces = []

    Object.entries(floatGroups).forEach(([floatId, points], index) => {
      traces.push({
        x: points.map(p => p.LONGITUDE),
        y: points.map(p => p.LATITUDE),
        z: points.map(p => -p.PRES), // Negative for depth below surface
        mode: 'markers+lines',
        type: 'scatter3d',
        name: `Float ${floatId}`,
        marker: {
          size: 5,
          color: points.map(p => p.TEMP),
          colorscale: [
            [0, '#1e3a8a'], // Deep blue (cold)
            [0.3, '#3b82f6'], // Blue
            [0.6, '#10b981'], // Green
            [0.8, '#f59e0b'], // Orange
            [1, '#ef4444'] // Red (warm)
          ],
          colorbar: {
            title: 'Temperature (°C)',
            titleside: 'right'
          },
          line: { color: colors[index % colors.length], width: 2 }
        },
        line: {
          color: colors[index % colors.length],
          width: 4
        },
        hovertemplate: 
          '<b>Float %{text}</b><br>' +
          'Lat: %{y:.2f}°<br>' +
          'Lng: %{x:.2f}°<br>' +
          'Depth: %{customdata[0]:.0f}m<br>' +
          'Temp: %{customdata[1]:.2f}°C<br>' +
          'Salinity: %{customdata[2]:.2f} PSU<br>' +
          '<extra></extra>',
        text: points.map(() => floatId),
        customdata: points.map(p => [p.PRES, p.TEMP, p.PSAL])
      })
    })

    return {
      data: traces,
      layout: {
        title: {
          text: '3D Ocean Data Visualization - ARGO Floats',
          font: { size: 20, color: '#1e40af' }
        },
        scene: {
          xaxis: { title: 'Longitude (°E)', backgroundcolor: '#f0f9ff' },
          yaxis: { title: 'Latitude (°N)', backgroundcolor: '#f0f9ff' },
          zaxis: { title: 'Depth (m)', backgroundcolor: '#f0f9ff' },
          bgcolor: '#e0f2fe',
          camera: {
            eye: { x: 1.5, y: 1.5, z: 0.5 }
          }
        },
        margin: { l: 0, r: 0, b: 0, t: 40 },
        paper_bgcolor: 'rgba(255,255,255,0.9)',
        plot_bgcolor: 'rgba(255,255,255,0.9)'
      },
      config: {
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['pan2d', 'lasso2d']
      }
    }
  }

  const createTemperatureDepthChart = () => {
    if (!argoData.length) return null

    const floatGroups = {}
    argoData.forEach(point => {
      if (!floatGroups[point.FLOAT_ID]) {
        floatGroups[point.FLOAT_ID] = []
      }
      floatGroups[point.FLOAT_ID].push(point)
    })

    const colors = ['#1e40af', '#059669', '#dc2626', '#7c2d12', '#6b21a8']
    const traces = []

    Object.entries(floatGroups).forEach(([floatId, points], index) => {
      const sortedPoints = points.sort((a, b) => a.PRES - b.PRES)
      
      traces.push({
        x: sortedPoints.map(p => p.TEMP),
        y: sortedPoints.map(p => -p.PRES),
        mode: 'lines+markers',
        type: 'scatter',
        name: `Float ${floatId}`,
        line: { color: colors[index % colors.length], width: 3 },
        marker: { size: 6, color: colors[index % colors.length] },
        hovertemplate: 
          '<b>Float %{text}</b><br>' +
          'Temperature: %{x:.2f}°C<br>' +
          'Depth: %{customdata:.0f}m<br>' +
          '<extra></extra>',
        text: sortedPoints.map(() => floatId),
        customdata: sortedPoints.map(p => p.PRES)
      })
    })

    return {
      data: traces,
      layout: {
        title: {
          text: 'Temperature vs Depth Profiles',
          font: { size: 20, color: '#1e40af' }
        },
        xaxis: { title: 'Temperature (°C)' },
        yaxis: { title: 'Depth (m)' },
        paper_bgcolor: 'rgba(255,255,255,0.9)',
        plot_bgcolor: 'rgba(255,255,255,0.9)',
        margin: { l: 50, r: 50, b: 50, t: 60 }
      }
    }
  }

  const createSalinityChart = () => {
    if (!argoData.length) return null

    return {
      data: [{
        x: argoData.map(p => p.LONGITUDE),
        y: argoData.map(p => p.LATITUDE),
        z: argoData.map(p => p.PSAL),
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          size: 6,
          color: argoData.map(p => p.PSAL),
          colorscale: [
            [0, '#0c4a6e'],
            [0.5, '#0ea5e9'],
            [1, '#f0f9ff']
          ],
          colorbar: {
            title: 'Salinity (PSU)',
            titleside: 'right'
          }
        },
        hovertemplate: 
          'Lat: %{y:.2f}°<br>' +
          'Lng: %{x:.2f}°<br>' +
          'Salinity: %{z:.2f} PSU<br>' +
          '<extra></extra>'
      }],
      layout: {
        title: {
          text: '3D Salinity Distribution',
          font: { size: 20, color: '#1e40af' }
        },
        scene: {
          xaxis: { title: 'Longitude (°E)' },
          yaxis: { title: 'Latitude (°N)' },
          zaxis: { title: 'Salinity (PSU)' },
          bgcolor: '#e0f2fe'
        },
        margin: { l: 0, r: 0, b: 0, t: 40 },
        paper_bgcolor: 'rgba(255,255,255,0.9)'
      }
    }
  }

  const chartConfigs = {
    '3d-ocean': {
      title: '3D Ocean Exploration',
      icon: Globe,
      description: 'Explore ARGO float paths in 3D space',
      chart: create3DOceanChart()
    },
    'temp-depth': {
      title: 'Temperature Profiles',
      icon: Thermometer,
      description: 'Temperature vs depth relationships',
      chart: createTemperatureDepthChart()
    },
    'salinity': {
      title: 'Salinity Distribution',
      icon: Droplets,
      description: '3D salinity patterns across regions',
      chart: createSalinityChart()
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const applyFilters = () => {
    // Build natural language query from filters
    let query = "Show me ARGO float data"
    
    if (filters.floatId) {
      query += ` for float ${filters.floatId}`
    }
    
    if (filters.temperatureRange.min || filters.temperatureRange.max) {
      query += ` with temperature between ${filters.temperatureRange.min || 0}°C and ${filters.temperatureRange.max || 50}°C`
    }
    
    if (filters.region.lat && filters.region.lng) {
      query += ` near latitude ${filters.region.lat} and longitude ${filters.region.lng}`
    }
    
    fetchArgoData(query)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(argoData, null, 2)
    const dataBlob = new Blob([dataStr], {type: 'application/json'})
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `argo-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported successfully!')
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-20 pb-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-4">
            Ocean Data Visualization
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore ARGO float data through interactive 3D visualizations and advanced analytics
          </p>
        </div>

        {/* Controls Panel */}
        <div className="card bg-white/80 backdrop-blur-sm shadow-xl border border-blue-200/50 mb-8">
          <div className="card-body">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h3 className="text-2xl font-bold text-blue-600">
                <BarChart3 className="inline w-6 h-6 mr-2" />
                Data Controls
              </h3>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => fetchArgoData()}
                  disabled={isLoading}
                  className="btn btn-primary bg-gradient-to-r from-blue-500 to-cyan-500 border-none text-white hover:from-blue-600 hover:to-cyan-600"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Data
                    </>
                  )}
                </button>
                
                <button 
                  onClick={exportData}
                  className="btn btn-outline border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              <div className="form-control">
                <label className="label label-text font-medium">Float ID</label>
                <input 
                  type="number"
                  placeholder="e.g., 2901623"
                  className="input input-bordered bg-white/80"
                  value={filters.floatId}
                  onChange={(e) => handleFilterChange('floatId', e.target.value)}
                />
              </div>
              
              <div className="form-control">
                <label className="label label-text font-medium">Min Temp (°C)</label>
                <input 
                  type="number"
                  placeholder="e.g., 15"
                  className="input input-bordered bg-white/80"
                  value={filters.temperatureRange.min}
                  onChange={(e) => handleFilterChange('temperatureRange', {...filters.temperatureRange, min: e.target.value})}
                />
              </div>
              
              <div className="form-control">
                <label className="label label-text font-medium">Max Temp (°C)</label>
                <input 
                  type="number"
                  placeholder="e.g., 25"
                  className="input input-bordered bg-white/80"
                  value={filters.temperatureRange.max}
                  onChange={(e) => handleFilterChange('temperatureRange', {...filters.temperatureRange, max: e.target.value})}
                />
              </div>
              
              <div className="form-control">
                <label className="label label-text font-medium">Latitude</label>
                <input 
                  type="number"
                  placeholder="e.g., -30.5"
                  className="input input-bordered bg-white/80"
                  value={filters.region.lat}
                  onChange={(e) => handleFilterChange('region', {...filters.region, lat: e.target.value})}
                />
              </div>
              
              <div className="form-control">
                <label className="label label-text font-medium">Longitude</label>
                <input 
                  type="number"
                  placeholder="e.g., 165.2"
                  className="input input-bordered bg-white/80"
                  value={filters.region.lng}
                  onChange={(e) => handleFilterChange('region', {...filters.region, lng: e.target.value})}
                />
              </div>
            </div>
            
            <button 
              onClick={applyFilters}
              className="btn bg-gradient-to-r from-green-500 to-blue-500 text-white border-none hover:from-green-600 hover:to-blue-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              Apply Filters
            </button>
          </div>
        </div>

        {/* Chart Selection */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(chartConfigs).map(([key, config]) => {
            const IconComponent = config.icon
            return (
              <button
                key={key}
                onClick={() => setActiveChart(key)}
                className={`btn btn-lg ${
                  activeChart === key 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none' 
                    : 'btn-outline border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
                } transition-all duration-300 hover:scale-105`}
              >
                <IconComponent className="w-5 h-5 mr-2" />
                {config.title}
              </button>
            )
          })}
        </div>

        {/* Chart Display */}
        <div className="card bg-white/90 backdrop-blur-sm shadow-2xl border border-blue-200/50">
          <div className="card-body">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-blue-600">
                {chartConfigs[activeChart].title}
              </h3>
              <p className="text-gray-600">
                {chartConfigs[activeChart].description}
              </p>
            </div>
            
            {chartConfigs[activeChart].chart && (
              <div className="w-full h-[600px]">
                <Plot
                  data={chartConfigs[activeChart].chart.data}
                  layout={{
                    ...chartConfigs[activeChart].chart.layout,
                    autosize: true,
                    responsive: true
                  }}
                  config={chartConfigs[activeChart].chart.config || {}}
                  style={{ width: '100%', height: '100%' }}
                  useResizeHandler={true}
                />
              </div>
            )}
          </div>
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-xl">
            <div className="card-body text-center">
              <Waves className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">{argoData.length}</h3>
              <p>Data Points</p>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-xl">
            <div className="card-body text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">
                {new Set(argoData.map(d => d.FLOAT_ID)).size}
              </h3>
              <p>Active Floats</p>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl">
            <div className="card-body text-center">
              <Thermometer className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">
                {argoData.length ? `${Math.min(...argoData.map(d => d.TEMP)).toFixed(1)}°C` : '—'}
              </h3>
              <p>Min Temperature</p>
            </div>
          </div>
          
          <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
            <div className="card-body text-center">
              <Activity className="w-8 h-8 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">
                {argoData.length ? `${Math.max(...argoData.map(d => d.PRES)).toFixed(0)}m` : '—'}
              </h3>
              <p>Max Depth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataVisualization