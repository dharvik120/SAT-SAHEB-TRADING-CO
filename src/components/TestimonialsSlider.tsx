'use client'

import { useState, useEffect, useRef } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, ArrowLeft, ArrowRight, Star } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  review: string
  rating: number
}

interface TestimonialsSliderProps {
  testimonials: Testimonial[]
}

export default function TestimonialsSlider({ testimonials: initialTestimonials }: TestimonialsSliderProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(firestore, 'testimonials'), (snap) => {
        if (!snap.empty) {
          const fresh: any[] = []
          snap.forEach((doc) => {
            const data = doc.data()
            if (data.isEnabled !== false) fresh.push({ id: doc.id, ...data })
          })
          fresh.sort((a, b) => (a.order || 0) - (b.order || 0))
          if (fresh.length > 0) setTestimonials(fresh)
        }
      })
      return () => unsub()
    } catch (e) {
      console.warn('TestimonialsSlider live listener bypassed:', e)
    }
  }, [])
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const AUTOPLAY_TIME = 10000

  const handleNext = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    if (testimonials.length <= 1) return

    timerRef.current = setInterval(handleNext, AUTOPLAY_TIME)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [testimonials.length])

  const resetAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = setInterval(handleNext, AUTOPLAY_TIME)
    }
  }

  if (!testimonials || testimonials.length === 0) return null

  const active = testimonials[current]

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
      },
    }),
  }

  return (
    <div className="relative w-full bg-emerald-950/20 border border-emerald-900/30 p-8 md:p-16 max-w-4xl mx-auto shadow-premium text-left">
      {/* Quote Icon */}
      <div className="absolute right-8 top-8 text-secondary/15">
        <Quote className="h-32 w-32 rotate-180" />
      </div>

      <div className="relative z-10 min-h-[220px] flex flex-col justify-between">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex flex-col gap-6"
          >
            {/* Stars rating */}
            <div className="flex gap-1 text-secondary">
              {Array.from({ length: active.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary" />
              ))}
            </div>

            {/* Review text */}
            <blockquote className="text-lg md:text-xl font-serif text-text-primary italic leading-relaxed">
              &ldquo;{active.review}&rdquo;
            </blockquote>

            {/* Reviewer info */}
            <div>
              <cite className="font-sans text-xs uppercase tracking-mega font-bold text-primary not-italic">
                {active.name}
              </cite>
              <p className="font-sans text-[10px] uppercase tracking-wider text-text-muted mt-0.5">
                Verified Importer / Buyer
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel controls */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-accent">
          {/* Numbers list */}
          <div className="font-sans text-xs text-text-muted font-medium">
            <span className="text-primary font-bold">0{current + 1}</span>
            <span className="opacity-30"> / 0{testimonials.length}</span>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                handlePrev()
                resetAutoplay()
              }}
              className="p-2.5 border border-accent hover:border-primary text-text-primary hover:text-primary rounded-none transition-colors duration-200"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                handleNext()
                resetAutoplay()
              }}
              className="p-2.5 border border-accent hover:border-primary text-text-primary hover:text-primary rounded-none transition-colors duration-200"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
