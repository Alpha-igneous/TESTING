import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

const OceanBackground = () => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)
    
    // Create ocean geometry
    const geometry = new THREE.PlaneGeometry(100, 100, 100, 100)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x1e40af) }, // Ocean blue
        color2: { value: new THREE.Color(0x0369a1) }, // Deeper blue
        color3: { value: new THREE.Color(0x075985) }, // Deepest blue
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          pos.z += sin(pos.x * 0.1 + time) * 0.5;
          pos.z += cos(pos.y * 0.1 + time * 0.7) * 0.3;
          pos.z += sin(pos.x * 0.05 + pos.y * 0.05 + time * 0.5) * 0.8;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          float depth = (vPosition.z + 2.0) / 4.0;
          vec3 color = mix(color1, color2, depth);
          color = mix(color, color3, clamp(depth - 0.5, 0.0, 1.0));
          
          // Add some wave shimmer
          float shimmer = sin(vUv.x * 50.0 + time * 2.0) * 0.1 + 0.9;
          color *= shimmer;
          
          gl_FragColor = vec4(color, 0.6);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    })
    
    const ocean = new THREE.Mesh(geometry, material)
    ocean.rotation.x = -Math.PI / 2
    ocean.position.y = -20
    scene.add(ocean)
    
    // Add floating particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1000
    const posArray = new Float32Array(particlesCount * 3)
    
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 200
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.8,
    })
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)
    
    camera.position.z = 30
    camera.position.y = 10
    camera.lookAt(0, 0, 0)
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      material.uniforms.time.value += 0.01
      particlesMesh.rotation.y += 0.0005
      particlesMesh.rotation.x += 0.0002
      
      renderer.render(scene, camera)
    }
    
    animate()
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    sceneRef.current = { scene, camera, renderer, ocean, particlesMesh }
    
    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10"
      style={{ 
        background: 'linear-gradient(180deg, #0c4a6e 0%, #1e40af 50%, #075985 100%)' 
      }}
    />
  )
}

export default OceanBackground