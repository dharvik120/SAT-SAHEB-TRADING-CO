import { getWebsiteSettings, getProducts, getCategories } from '@/lib/firebaseDb'
import ProductShowcase from '@/components/ProductShowcase'

export const dynamic = 'force-static'

export default async function ProductsPage() {
  const categories = await getCategories()
  const allProducts = await getProducts()
  const products = allProducts
    .filter((p: any) => p.isEnabled)
    .map((prod: any) => {
      const cat = categories.find((c: any) => c.id.toString() === prod.categoryId?.toString())
      return {
        ...prod,
        category: cat || { name: 'General' }
      }
    })
  const settings = await getWebsiteSettings()

  return (
    <div className="flex flex-col w-full bg-bg-primary overflow-hidden pt-24 font-sans">
      
      {/* Editorial Title Banner */}
      <section className="bg-bg-secondary py-20 px-6 border-b border-accent">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-mega text-secondary font-bold block mb-4">
            {settings?.productPageLabel || 'Import Export Portfolio'}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-text-primary tracking-wide leading-tight mb-6">
            {settings?.productPageTitle || 'Our Commodities'}
          </h1>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            {settings?.productPageDescription || 'Browse our verified inventory of high-quality grains, pulses, and spices sourced directly from fertile cultivation belts across India.'}
          </p>
        </div>
      </section>

      {/* Main product listings grid showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full min-h-[50vh]">
        <ProductShowcase products={products} categories={categories} />
      </section>

    </div>
  )
}

