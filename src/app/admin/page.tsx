import { 
  getWebsiteSettings, 
  getThemeSettings, 
  getHeroSlides, 
  getProducts, 
  getCategories, 
  getPartners, 
  getTestimonials, 
  getInquiries, 
  getLogisticsNodes, 
  getGalleryImages
} from '@/lib/firebaseDb'
import AdminClientWrapper from './AdminClientWrapper'

export const dynamic = 'force-static'

export default async function AdminPage() {
  // Query all database collections for the administrator dashboard panels from Firebase
  const settings = await getWebsiteSettings()
  const theme = await getThemeSettings()
  const slides = await getHeroSlides()
  const products = await getProducts()
  const categories = await getCategories()
  const partners = await getPartners()
  const testimonials = await getTestimonials()
  const inquiries = await getInquiries()
  const nodes = await getLogisticsNodes()
  const gallery = await getGalleryImages()

  return (
    <AdminClientWrapper
      initialSettings={settings}
      initialTheme={theme}
      initialSlides={slides}
      initialProducts={products}
      initialCategories={categories}
      initialPartners={partners}
      initialTestimonials={testimonials}
      initialInquiries={inquiries}
      initialNodes={nodes}
      initialGallery={gallery}
    />
  )
}
