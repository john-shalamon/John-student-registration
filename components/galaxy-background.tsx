"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  z: number
  size: number
  color: string
}

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    // Initialize stars
    const initStars = () => {
      const stars: Star[] = []
      const starCount = Math.floor((canvas.width * canvas.height) / 1000)

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width - canvas.width / 2,
          y: Math.random() * canvas.height - canvas.height / 2,
          z: Math.random() * 1000,
          size: Math.random() * 2,
          color: getStarColor(),
        })
      }

      starsRef.current = stars
    }

    // Get a random star color
    const getStarColor = () => {
      const colors = [
        "rgba(255, 255, 255, 0.8)", // White
        "rgba(173, 216, 230, 0.8)", // Light blue
        "rgba(147, 112, 219, 0.8)", // Purple
        "rgba(135, 206, 250, 0.8)", // Sky blue
        "rgba(221, 160, 221, 0.8)", // Plum
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Update and draw stars
      starsRef.current.forEach((star, i) => {
        // Move stars closer (z decreases)
        star.z -= 1

        // Reset star if it's too close
        if (star.z <= 0) {
          starsRef.current[i] = {
            x: Math.random() * canvas.width - centerX,
            y: Math.random() * canvas.height - centerY,
            z: 1000,
            size: Math.random() * 2,
            color: getStarColor(),
          }
          return
        }

        // Project 3D position to 2D with perspective
        const projectedX = (star.x / star.z) * 100 + centerX
        const projectedY = (star.y / star.z) * 100 + centerY

        // Calculate size based on distance
        const projectedSize = Math.min(5, ((1000 - star.z) / 100) * star.size)

        // Skip if outside canvas
        if (projectedX < 0 || projectedX > canvas.width || projectedY < 0 || projectedY > canvas.height) {
          return
        }

        // Draw star
        ctx.beginPath()
        ctx.fillStyle = star.color
        ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Initialize and start animation
    handleResize()
    window.addEventListener("resize", handleResize)
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ background: "linear-gradient(to bottom, #000000, #0a0a2a)" }}
    />
  )
}

