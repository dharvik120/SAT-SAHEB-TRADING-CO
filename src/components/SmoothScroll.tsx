'use client'

import { ReactLenis } from 'lenis/react'
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger)

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setDisabled(mediaQuery.matches)

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setDisabled(e.matches)
    }

    mediaQuery.addEventListener('change', handleMotionChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [])

  // If user prefers reduced motion, bypass Lenis smooth scroll wrapping
  if (disabled) {
    return <>{children}</>
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2 }}>
      {children}
    </ReactLenis>
  )
}
