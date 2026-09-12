'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Preloader({ enabled = true }: { enabled?: boolean }) {
  const [loading, setLoading] = useState(enabled)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    // Check if user already saw preloader in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('sst_preloader_shown') === 'true') {
      setLoading(false)
      return
    }

    // Fast, crisp progress load (completes in ~300ms)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('sst_preloader_shown', 'true')
          }
          setTimeout(() => setLoading(false), 200)
          return 100
        }
        const step = Math.floor(Math.random() * 25) + 20
        return Math.min(prev + step, 100)
      });
    }, 40)

    return () => clearInterval(interval)
  }, [enabled])

  if (!enabled) return null

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%', 
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#032318] text-white"
        >
          {/* Logo Reveal */}
          <div className="relative mb-8 h-40 w-40 overflow-hidden rounded-full border border-secondary/20 flex items-center justify-center p-2 bg-[#032318]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full w-full relative flex items-center justify-center p-2 bg-[#032318]"
            >
              <Image
                src="/images/logo-circular.jpg"
                alt="SAT SAHEB TRADING CO."
                width={160}
                height={160}
                className="object-cover rounded-full h-full w-full"
                priority
              />
            </motion.div>
          </div>

          {/* Branded text reveal */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-xl tracking-mega uppercase font-sans text-secondary font-semibold">
              Sat Saheb Trading Co.
            </h1>
            <p className="text-xs uppercase tracking-widest text-emerald-100/50 mt-1">
              Import Export WorldWide
            </p>
          </motion.div>

          {/* Elegant Loading Progress Bar */}
          <div className="mt-12 w-64 h-[2px] bg-emerald-950 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 top-0 h-full bg-secondary"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut' }}
            />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="text-xs font-sans mt-3 text-secondary"
          >
            {progress}%
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
