'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface ProductCardProps {
  id: number
  title: string
  slug: string
  featuredImage: string
  categoryName: string
  index: number
  hideCategory?: boolean
}

export default function ProductCard({ title, slug, featuredImage, categoryName, index, hideCategory = false }: ProductCardProps) {
  const paddedIndex = (index + 1).toString().padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1], delay: index * 0.05 }}
      className="group relative flex flex-col justify-between bg-bg-card border border-accent hover:border-primary/20 p-5 shadow-premium hover:shadow-premium-hover transition-all duration-500 overflow-hidden"
    >
      <div>
        {/* Card Number & Category */}
        <div className="flex justify-between items-center mb-4">
          <span className="font-sans text-xs tracking-wider text-secondary font-semibold">
            {!hideCategory && categoryName}
          </span>
          <span className="font-sans text-xs font-semibold text-text-muted opacity-30">
            {paddedIndex}
          </span>
        </div>

        {/* Product Image Frame */}
        <div className="relative h-64 w-full bg-bg-secondary overflow-hidden mb-6 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-emerald-950/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <div className="relative h-48 w-48 transition-transform duration-700 ease-out group-hover:scale-110">
            <Image
              src={featuredImage}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 300px"
              priority={index < 4}
            />
          </div>
        </div>

        {/* Product Title */}
        <h3 className="text-xl font-serif text-text-primary tracking-wide mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
      </div>

      <div className="mt-4 pt-4 border-t border-accent flex justify-between items-center">
        {/* Detail Link */}
        <Link
          href={`/products/${slug}`}
          className="text-xs font-sans font-bold uppercase tracking-wider text-text-primary group-hover:text-primary transition-colors duration-200 flex items-center gap-1"
        >
          View Specifications
          <ArrowUpRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
        </Link>
      </div>
    </motion.div>
  )
}
