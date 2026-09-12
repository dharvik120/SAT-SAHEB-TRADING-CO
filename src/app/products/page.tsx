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
      <ProductShowcase
        products={products}
        categories={categories}
        headerLabel={settings?.productPageLabel}
        headerTitle={settings?.productPageTitle}
        headerDescription={settings?.productPageDescription}
      />
    </div>
  )
}

