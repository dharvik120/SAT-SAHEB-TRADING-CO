'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  productId?: string | number
}

export default function ProductGallery({ images: initialImages, productId }: ProductGalleryProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [activeIdx, setActiveIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Real-time listener for product gallery updates
  useEffect(() => {
    if (!productId) return
    try {
      import('firebase/firestore').then(({ doc, onSnapshot }) => {
        import('@/lib/firebase').then(({ firestore }) => {
          onSnapshot(doc(firestore, 'products', productId.toString()), (snap) => {
            if (snap.exists()) {
              const data = snap.data()
              const rawGal = (data as any).gallery
              const rawImgs = (data as any).images
              let freshImgs: string[] = []
              if (Array.isArray(rawGal) && rawGal.length > 0) {
                freshImgs = rawGal.map((i: any) => typeof i === 'string' ? i : i.url).filter(Boolean)
              } else if (Array.isArray(rawImgs) && rawImgs.length > 0) {
                freshImgs = rawImgs.map((i: any) => typeof i === 'string' ? i : i.url).filter(Boolean)
              }
              if (freshImgs.length === 0 && data.featuredImage) {
                freshImgs = [data.featuredImage]
              }
              if (freshImgs.length > 0) {
                setImages(freshImgs)
              }
            }
          })
        })
      })
    } catch (e) {}
  }, [productId])

  if (!images || images.length === 0) return null

  const activeImage = images[activeIdx]

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveIdx((prev) => (prev + 1) % images.length)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Featured Image Display Frame */}
      <div 
        onClick={() => setLightboxOpen(true)}
        className="relative aspect-square w-full bg-bg-secondary border border-accent hover:border-primary/20 flex items-center justify-center p-6 cursor-zoom-in group shadow-premium transition-all duration-300"
      >
        <div className="absolute right-4 top-4 z-10 p-2 bg-white/80 border border-accent hover:bg-primary hover:text-white rounded-none opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm">
          <Maximize2 className="h-4 w-4" />
        </div>
        
        <div className="relative h-4/5 w-4/5">
          <Image
            src={activeImage}
            alt="Featured Product Image"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>
      </div>

      {/* Thumbnails list */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {images.map((imgUrl, idx) => {
            const isActive = idx === activeIdx
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative aspect-square bg-bg-secondary border p-1 transition-all duration-200 ${
                  isActive ? 'border-primary shadow-sm scale-[1.02]' : 'border-accent opacity-65 hover:opacity-100'
                }`}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={imgUrl}
                    alt={`Product thumbnail ${idx + 1}`}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Lightbox full-screen modal overlay */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute right-6 top-6 z-[1001] p-3 text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-none transition-colors"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Slider arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-[1001] p-4 text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-none transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-[1001] p-4 text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-none transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Lightbox Center Image */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[85vh] aspect-square"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
            >
              <Image
                src={activeImage}
                alt="Product High-Res Image"
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </motion.div>

            {/* Image Indicator number */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs font-sans tracking-widest">
              {activeIdx + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
