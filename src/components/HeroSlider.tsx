'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export interface SlideData {
  id: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
  primaryCtaText?: string | null
  primaryCtaLink?: string | null
  secondaryCtaText?: string | null
  secondaryCtaLink?: string | null
  alignment: string
}

interface HeroSliderProps {
  slides: SlideData[]
}

export default function HeroSlider({ slides: initialSlides }: HeroSliderProps) {
  const [slides, setSlides] = useState<SlideData[]>(initialSlides)

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(firestore, 'heroSlides'), (snap) => {
        if (!snap.empty) {
          const fresh: any[] = []
          snap.forEach((doc) => {
            const data = doc.data()
            if (data.isEnabled !== false) fresh.push({ id: doc.id, ...data })
          })
          fresh.sort((a, b) => (a.order || 0) - (b.order || 0))
          if (fresh.length > 0) setSlides(fresh)
        }
      })
      return () => unsub()
    } catch (e) {
      console.warn('HeroSlider live listener bypassed:', e)
    }
  }, [])
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const AUTOPLAY_TIME = 8000

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Set up autoplay
  useEffect(() => {
    if (slides.length <= 1) return

    timerRef.current = setInterval(handleNext, AUTOPLAY_TIME)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [handleNext, slides.length])

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = setInterval(handleNext, AUTOPLAY_TIME)
    }
  }

  const navigateTo = (index: number) => {
    if (index === current) return
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
    resetTimer()
  }

  if (!slides || slides.length === 0) return null

  const slide = slides[current]

  // Slide variants for transition effects
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 1.2, ease: 'easeInOut' },
        scale: { duration: 1.5, ease: 'easeOut' },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.95,
      transition: {
        opacity: { duration: 1, ease: 'easeInOut' },
        scale: { duration: 1, ease: 'easeInOut' },
      },
    }),
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-emerald-950 select-none">
      {/* Background Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Main Slide Image filling 100% of container */}
          <div className="absolute inset-0 w-full h-full bg-[#032318]">
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover object-center select-none"
              sizes="100vw"
              priority
            />
          </div>
          {/* Cinematic premium vignette overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-[2]" />
          <div className="absolute inset-0 bg-black/25 z-[1]" />
        </motion.div>
      </AnimatePresence>

      {/* Content Container */}
      <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-center h-full pt-16">
          <div
            className={`w-full max-w-3xl flex flex-col ${
              slide.alignment === 'right'
                ? 'ml-auto text-right items-end'
                : slide.alignment === 'center'
                ? 'mx-auto text-center items-center'
                : 'text-left items-start'
            }`}
          >
            {/* Animated Subtitle */}
            <div className="overflow-hidden mb-4">
              <motion.span
                key={`sub-${current}`}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1], delay: 0.2 }}
                className="inline-block text-xs md:text-sm uppercase tracking-mega text-secondary font-sans font-semibold"
              >
                {slide.subtitle}
              </motion.span>
            </div>

            {/* Animated Title */}
            <div className="overflow-hidden mb-6">
              <motion.h2
                key={`title-${current}`}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.215, 0.61, 0.355, 1], delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-wide leading-[1.15]"
              >
                {slide.title}
              </motion.h2>
            </div>

            {/* Animated Description */}
            <div className="overflow-hidden mb-8">
              <motion.p
                key={`desc-${current}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                className="text-emerald-100/70 text-sm md:text-base leading-relaxed max-w-xl font-sans"
              >
                {slide.description}
              </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
              key={`ctas-${current}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 }}
              className="flex flex-wrap items-center gap-4 mt-2"
            >
              {slide.primaryCtaText && slide.primaryCtaLink && (
                <Link
                  href={slide.primaryCtaLink}
                  className="px-8 py-3.5 text-xs font-sans uppercase font-bold tracking-widest text-[#032318] bg-secondary hover:bg-white hover:text-primary transition-all duration-300 shadow-premium"
                >
                  {slide.primaryCtaText}
                </Link>
              )}
              {slide.secondaryCtaText && slide.secondaryCtaLink && (
                <Link
                  href={slide.secondaryCtaLink}
                  className="px-8 py-3.5 text-xs font-sans uppercase font-bold tracking-widest text-white border border-white/20 hover:border-white hover:bg-white/10 transition-all duration-300"
                >
                  {slide.secondaryCtaText}
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Numerical Progress Indicator */}
      <div className="absolute left-8 bottom-12 z-20 hidden md:flex items-center gap-4 text-white font-sans text-xs tracking-wider">
        <span className="text-secondary font-semibold">0{current + 1}</span>
        <div className="w-12 h-[1px] bg-white/20 relative">
          <div className="absolute left-0 top-0 h-full bg-secondary w-full origin-left transform scale-x-0 animate-timer-line" />
        </div>
        <span className="opacity-45">0{slides.length}</span>
      </div>

      {/* Arrow Navigation Controls */}
      <div className="absolute right-8 bottom-12 z-20 flex items-center gap-3">
        <button
          onClick={() => {
            handlePrev()
            resetTimer()
          }}
          className="p-3 border border-white/10 text-white hover:border-white hover:bg-white/10 rounded-none transition-all duration-300 focus:outline-none"
          aria-label="Previous slide"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => {
            handleNext()
            resetTimer()
          }}
          className="p-3 border border-white/10 text-white hover:border-white hover:bg-white/10 rounded-none transition-all duration-300 focus:outline-none"
          aria-label="Next slide"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Bottom slide dots indicator for mobile */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex md:hidden gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => navigateTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current ? 'w-6 bg-secondary' : 'w-1.5 bg-white/30'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes kenburns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.08) translate(-1%, -0.5%); }
        }
        .animate-ken-burns {
          animation: kenburns 12s infinite alternate ease-in-out;
        }
      `}</style>
    </div>
  )
}
