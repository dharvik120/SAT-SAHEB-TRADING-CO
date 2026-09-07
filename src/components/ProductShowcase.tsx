'use client'

import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'

interface Category {
  id: number | string
  name: string
  slug: string
}

interface Product {
  id: number | string
  title: string
  slug: string
  featuredImage: string
  category: Category
  categoryId?: number | string
  isEnabled?: boolean
}

interface ProductShowcaseProps {
  products: Product[]
  categories: Category[]
}

export default function ProductShowcase({ products: initialProducts, categories: initialCategories }: ProductShowcaseProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Real-time listener for products and categories changes from Firestore
  useEffect(() => {
    try {
      const unsubProd = onSnapshot(collection(firestore, 'products'), (prodSnap) => {
        if (!prodSnap.empty) {
          const freshProducts: any[] = []
          prodSnap.forEach((doc) => {
            const data = doc.data()
            if (data.isEnabled !== false) {
              freshProducts.push({ id: doc.id, ...data })
            }
          })
          
          setProducts((current) => {
            const mapped = freshProducts.map((p) => {
              const cat = categories.find((c) => c.id?.toString() === p.categoryId?.toString())
              return {
                ...p,
                category: cat || { id: 'general', name: 'General', slug: 'general' }
              }
            })
            return mapped.length > 0 ? mapped : current
          })
        }
      })

      const unsubCat = onSnapshot(collection(firestore, 'categories'), (catSnap) => {
        if (!catSnap.empty) {
          const freshCats: Category[] = []
          catSnap.forEach((doc) => {
            freshCats.push({ id: doc.id, ...doc.data() } as Category)
          })
          if (freshCats.length > 0) setCategories(freshCats)
        }
      })

      return () => {
        unsubProd()
        unsubCat()
      }
    } catch (err) {
      console.warn('Firestore live listener bypassed:', err)
    }
  }, [categories])

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category?.slug === selectedCategory)

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
                id={typeof prod.id === 'number' ? prod.id : index + 1}
                title={prod.title}
                slug={prod.slug}
                featuredImage={prod.featuredImage}
                categoryName={prod.category?.name || 'General'}
                index={index}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
