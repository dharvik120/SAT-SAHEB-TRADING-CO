import { getWebsiteSettings, getProducts, getCategories } from '@/lib/firebaseDb'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, MessageSquare, PhoneCall } from 'lucide-react'
import ProductGallery from '@/components/ProductGallery'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p: any) => ({
    slug: p.slug || String(p.id),
  }))
}

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = params

  const allProducts = await getProducts()
  const dbProduct = allProducts.find((p: any) => p.slug === slug)

  if (!dbProduct) {
    notFound()
  }

  const categories = await getCategories()
  const cat = categories.find((c: any) => c.id.toString() === dbProduct.categoryId?.toString())
  const product = {
    ...dbProduct,
    category: cat || { name: 'General' }
  }

  // Get previous and next products for navigation
  const sorted = allProducts.filter((p: any) => p.isEnabled).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
  const idx = sorted.findIndex((p: any) => p.slug === slug)
  const prevProduct = idx > 0 ? sorted[idx - 1] : null
  const nextProduct = idx > -1 && idx < sorted.length - 1 ? sorted[idx + 1] : null

  // Parse specifications
  let specifications: { key: string; value: string }[] = []
  try {
    specifications = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : (product.specifications || [])
  } catch (e) {
    console.error('Failed to parse product specifications', e)
  }

  // Compile WhatsApp link
  const settings = await getWebsiteSettings()
  const whatsappNumber = settings?.whatsappNumber?.replace(/[^\d+]/g, '') || '+919099667113'
  const waMessage = encodeURIComponent(
    `Hello SAT SAHEB TRADING CO., I am interested in importing your product: ${product.title}. Please provide pricing, packaging sizes, and trade terms.`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${waMessage}`

  // Gather gallery image URLs
  const galleryImages = (product.images || []).length > 0
    ? product.images.map((img: any) => img.url)
    : [product.featuredImage]

  return (
    <div className="flex flex-col w-full bg-bg-primary overflow-hidden pt-24 font-sans">
      
      {/* Back Button & Category Banner */}
      <div className="max-w-7xl mx-auto px-6 w-full pt-8 flex items-center justify-between border-b border-accent pb-4">
        <Link
          href="/products"
          className="text-xs font-sans font-bold uppercase tracking-wider text-text-primary hover:text-primary flex items-center gap-1.5 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Commodities
        </Link>
        <span className="text-[10px] uppercase tracking-mega text-secondary font-bold border border-secondary/20 px-3 py-1 bg-secondary/5">
          {product.category.name}
        </span>
      </div>

      {/* Main product display grid */}
      <section className="py-12 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-b border-accent">
        
        {/* Left Column: Premium Lightbox Gallery */}
        <div className="lg:col-span-6 w-full">
          <ProductGallery images={galleryImages} />
        </div>

        {/* Right Column: Text & Specs Info */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          <h1 className="text-3xl md:text-5xl font-serif text-text-primary tracking-wide leading-tight mb-4">
            {product.title}
          </h1>
          
          <div className="h-1 w-20 bg-secondary mb-6" />

          {/* Overview text */}
          <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-6 font-semibold">
            {product.overview}
          </p>

          {/* Full description */}
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed mb-8 whitespace-pre-line">
            {product.description}
          </p>

          {/* Inquiry buttons actions */}
          <div className="flex flex-wrap items-center gap-4 mb-10 pt-4 border-t border-accent">
            <Link
              href={`/contact?interest=${encodeURIComponent(product.title)}`}
              className="px-8 py-3.5 text-xs font-sans uppercase font-bold tracking-widest text-white bg-primary hover:bg-primary-light transition-all duration-300 shadow-premium flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" /> Request Specifications Quote
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 text-xs font-sans uppercase font-bold tracking-widest text-white bg-[#25D366] hover:bg-[#20ba5a] transition-all duration-300 shadow-premium flex items-center gap-2"
            >
              <PhoneCall className="h-4 w-4 fill-white text-[#25D366]" /> Chat on WhatsApp
            </a>
          </div>

          {/* Specifications Sheet Table */}
          {specifications.length > 0 && (
            <div className="bg-bg-secondary border border-accent p-6 shadow-premium">
              <h3 className="font-serif text-lg text-text-primary font-semibold mb-4 border-b border-accent pb-2">
                Technical Specifications
              </h3>
              <table className="w-full text-left font-sans text-xs md:text-sm text-text-secondary">
                <tbody>
                  {specifications.map((spec, idx) => (
                    <tr key={idx} className="border-b border-accent/40 last:border-b-0">
                      <td className="py-2.5 font-bold text-text-primary pr-4 uppercase tracking-wider text-[10px]">
                        {spec.key}
                      </td>
                      <td className="py-2.5 text-text-secondary">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Previous / Next Product Navigation Bar */}
      <section className="py-12 px-6 bg-bg-secondary w-full border-b border-accent">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            {prevProduct ? (
              <Link
                href={`/products/${prevProduct.slug}`}
                className="group flex flex-col items-start gap-1"
              >
                <span className="text-[9px] uppercase tracking-wider text-text-muted">Previous Product</span>
                <span className="font-serif text-sm md:text-base text-text-primary group-hover:text-primary transition-colors flex items-center gap-1">
                  &larr; {prevProduct.title}
                </span>
              </Link>
            ) : (
              <div className="opacity-0" />
            )}
          </div>

          <div className="w-[1px] h-10 bg-accent hidden sm:block" />

          <div>
            {nextProduct ? (
              <Link
                href={`/products/${nextProduct.slug}`}
                className="group flex flex-col items-end gap-1"
              >
                <span className="text-[9px] uppercase tracking-wider text-text-muted">Next Product</span>
                <span className="font-serif text-sm md:text-base text-text-primary group-hover:text-primary transition-colors flex items-center gap-1">
                  {nextProduct.title} &rarr;
                </span>
              </Link>
            ) : (
              <div className="opacity-0" />
            )}
          </div>
        </div>
      </section>

    </div>
  )
}
