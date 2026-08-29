import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
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
  getGalleryImages,
  migrateDbToFirestore
} from '@/lib/firebaseDb'
import AdminDashboard from '@/components/AdminDashboard'

export const revalidate = 0 // Disable cache for admin operations

export default async function AdminPage() {
  // 1. Secure Server-Side Session check
  const session = getSession()
  if (!session) {
    redirect('/admin/login')
  }

  // Trigger one-time migration if needed
  await migrateDbToFirestore()

  // 2. Query all database collections for the administrator dashboard panels from Firebase
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

  // 3. Render client side interactive dashboard container
  return (
    <AdminDashboard
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
      username={session.name || session.email}
    />
  )
}
