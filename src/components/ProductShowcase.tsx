'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: number
  title: string
  slug: string
  featuredImage: string
  category: Category
}

interface ProductShowcaseProps {
  products: Product[]
  categories: Category[]
}

export default function ProductShowcase({ products, categories }: ProductShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category.slug === selectedCategory)

  return (
    <div className="flex flex-col gap-12">
      {/* Category Filter Nav Bar */}
      <div className="flex flex-wrap items-center justify-center gap-4 border-b border-accent pb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2 text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 ${
            selectedCategory === 'all'
              ? 'text-primary border-b-2 border-secondary'
              : 'text-text-secondary hover:text-primary'
          }`}
        >
          All Commodities
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-5 py-2 text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 ${
              selectedCategory === cat.slug
                ? 'text-primary border-b-2 border-secondary'
                : 'text-text-secondary hover:text-primary'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid Container */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((prod, index) => (
            <motion.div
              layout
              key={prod.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard
                id={prod.id}
                title={prod.title}
                slug={prod.slug}
                featuredImage={prod.featuredImage}
                categoryName={prod.category.name}
                index={index}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
