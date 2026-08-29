'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Maximize2, X } from 'lucide-react'

interface GalleryImageData {
  id: number
  title: string
  caption?: string | null
  url: string
  category: string
  order: number
  isEnabled: boolean
}

interface Props {
  images: GalleryImageData[]
  categories: string[]
  pageLabel?: string
  pageTitle?: string
  pageDescription?: string
}

export default function GalleryClient({ images, categories, pageLabel, pageTitle, pageDescription }: Props) {
  const [selectedImg, setSelectedImg] = useState<GalleryImageData | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const filtered = activeCategory === 'All'
    ? images
    : images.filter(img => img.category === activeCategory)

  return (
    <div className="flex flex-col w-full bg-bg-primary overflow-hidden pt-24 font-sans">

      {/* Editorial Title Banner */}
      <section className="bg-bg-secondary py-20 px-6 border-b border-accent">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-mega text-secondary font-bold block mb-4">
            {pageLabel || 'Visual Registry'}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-text-primary tracking-wide leading-tight mb-6">
            {pageTitle || 'Corporate Gallery'}
          </h1>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            {pageDescription || 'A premium collection of our verified agricultural products and cargo consignments. All images are managed from the admin dashboard.'}
          </p>
        </div>
      </section>

      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <section className="border-b border-accent bg-bg-secondary/50 sticky top-[72px] z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest font-sans border transition-colors duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white border-primary'
                    : 'border-accent text-text-secondary hover:border-primary hover:text-primary bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-text-muted font-sans text-sm">
            No gallery images found. Add images from the admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onClick={() => setSelectedImg(item)}
                className="group bg-bg-secondary border border-accent hover:border-primary/20 p-5 cursor-zoom-in shadow-premium hover:shadow-premium-hover transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] w-full bg-white flex items-center justify-center overflow-hidden mb-4">
                  {/* Zoom badge */}
                  <div className="absolute right-3 top-3 p-1.5 bg-white/95 border border-accent rounded-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <Maximize2 className="h-3.5 w-3.5 text-text-primary" />
                  </div>
                  <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-105">
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                </div>

                {/* Caption */}
                <div className="flex items-start justify-between mt-2 pt-2 border-t border-accent/40 gap-2">
                  <div>
                    <span className="text-text-primary font-serif font-semibold text-base group-hover:text-primary transition-colors block">
                      {item.title}
                    </span>
                    {item.caption && (
                      <span className="text-[11px] text-text-secondary font-sans mt-0.5 block leading-relaxed">
                        {item.caption}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-secondary font-bold font-sans shrink-0 mt-0.5">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute right-6 top-6 z-[1001] p-3 text-white/70 hover:text-white bg-white/5 border border-white/10 rounded-none transition-colors"
              aria-label="Close image"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl max-h-[75vh]"
              style={{ aspectRatio: '4/3' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImg.url}
                alt={selectedImg.title}
                fill
                className="object-contain"
                sizes="1200px"
              />
              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 py-4 text-white">
                <span className="font-serif font-bold text-lg block">{selectedImg.title}</span>
                {selectedImg.caption && (
                  <span className="text-white/70 text-sm mt-0.5 block">{selectedImg.caption}</span>
                )}
                <span className="text-[10px] uppercase tracking-widest text-secondary font-bold mt-1 block">{selectedImg.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
