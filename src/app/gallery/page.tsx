import { getWebsiteSettings, getGalleryImages } from '@/lib/firebaseDb'
import GalleryClient from './GalleryClient'

export const revalidate = 0

export default async function GalleryPage() {
  const allImages = await getGalleryImages()
  const images = allImages.filter((img: any) => img.isEnabled)

  const settings = await getWebsiteSettings()

  // Get distinct categories for filter tabs
  const allCategories = ['All', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))]

  return (
    <GalleryClient
      images={images}
      categories={allCategories}
      pageLabel={settings?.galleryPageLabel}
      pageTitle={settings?.galleryPageTitle}
      pageDescription={settings?.galleryPageDescription}
    />
  )
}
