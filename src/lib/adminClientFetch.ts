// Direct client-side Firestore router for AdminDashboard
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  orderBy, 
  where,
  writeBatch 
} from 'firebase/firestore'
import { firestore } from './firebase'
import {
  getWebsiteSettings,
  updateWebsiteSettings,
  getThemeSettings,
  updateThemeSettings,
  getHeroSlides,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getPartners,
  addPartner,
  updatePartner,
  deletePartner,
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
  getLogisticsNodes,
  addLogisticsNode,
  updateLogisticsNode,
  deleteLogisticsNode,
  getGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} from './firebaseDb'

function mockResponse(data: any, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data)
  }
}

export async function adminClientFetch(inputUrl: string, init?: RequestInit): Promise<any> {
  const method = (init?.method || 'GET').toUpperCase()
  const body = init?.body ? (typeof init.body === 'string' ? JSON.parse(init.body) : init.body) : null
  const urlObj = new URL(inputUrl, 'http://localhost')
  const pathname = urlObj.pathname
  const searchParams = urlObj.searchParams

  try {
    // 1. SETTINGS & THEME
    if (pathname === '/api/admin/settings') {
      if (method === 'GET') {
        const settings = await getWebsiteSettings()
        const theme = await getThemeSettings()
        return mockResponse({ settings, theme })
      }
      if (method === 'POST') {
        const updated = await updateWebsiteSettings(body)
        return mockResponse({ success: true, settings: updated })
      }
      if (method === 'PUT') {
        const updated = await updateThemeSettings(body)
        return mockResponse({ success: true, theme: updated })
      }
    }

    // 2. SLIDES
    if (pathname === '/api/admin/slides') {
      if (method === 'GET') {
        const slides = await getHeroSlides()
        return mockResponse({ slides })
      }
      if (method === 'POST') {
        const created = await addHeroSlide(body)
        return mockResponse({ success: true, slide: created })
      }
      if (method === 'PUT') {
        if (body.action === 'reorder') {
          const batch = writeBatch(firestore)
          body.orderedIds.forEach((id: string | number, idx: number) => {
            const docRef = doc(firestore, 'heroSlides', id.toString())
            batch.update(docRef, { order: idx })
          })
          await batch.commit()
          return mockResponse({ success: true })
        }
        const updated = await updateHeroSlide(body.id, body)
        return mockResponse({ success: true, slide: updated })
      }
      if (method === 'DELETE') {
        const id = searchParams.get('id')
        if (id) await deleteHeroSlide(id)
        return mockResponse({ success: true })
      }
    }

    // 3. PRODUCTS
    if (pathname === '/api/admin/products') {
      if (method === 'GET') {
        const products = await getProducts()
        return mockResponse({ products })
      }
      if (method === 'POST') {
        const created = await addProduct(body)
        return mockResponse({ success: true, product: created })
      }
      if (method === 'PUT') {
        if (body.action === 'reorder' || body.action === 'reorder-featured') {
          const batch = writeBatch(firestore)
          const field = body.action === 'reorder-featured' ? 'featuredOrder' : 'order'
          body.orderedIds.forEach((id: string | number, idx: number) => {
            const docRef = doc(firestore, 'products', id.toString())
            batch.update(docRef, { [field]: idx })
          })
          await batch.commit()
          return mockResponse({ success: true })
        }
        const updated = await updateProduct(body.id, body)
        return mockResponse({ success: true, product: updated })
      }
      if (method === 'DELETE') {
        const id = searchParams.get('id')
        if (id) await deleteProduct(id)
        return mockResponse({ success: true })
      }
    }

    // 4. CATEGORIES
    if (pathname === '/api/admin/categories') {
      if (method === 'GET') {
        const categories = await getCategories()
        return mockResponse({ categories })
      }
      if (method === 'POST') {
        const created = await addCategory(body)
        return mockResponse({ success: true, category: created })
      }
      if (method === 'PUT') {
        const updated = await updateCategory(body.id, body)
        return mockResponse({ success: true, category: updated })
      }
      if (method === 'DELETE') {
        const id = searchParams.get('id')
        if (id) await deleteCategory(id)
        return mockResponse({ success: true })
      }
    }

    // 5. PARTNERS
    if (pathname === '/api/admin/partners') {
      if (method === 'GET') {
        const partners = await getPartners()
        return mockResponse({ partners })
      }
      if (method === 'POST') {
        const created = await addPartner(body)
        return mockResponse({ success: true, partner: created })
      }
      if (method === 'PUT') {
        if (body.action === 'reorder') {
          const batch = writeBatch(firestore)
          body.orderedIds.forEach((id: string | number, idx: number) => {
            const docRef = doc(firestore, 'partners', id.toString())
            batch.update(docRef, { order: idx })
          })
          await batch.commit()
          return mockResponse({ success: true })
        }
        const updated = await updatePartner(body.id, body)
        return mockResponse({ success: true, partner: updated })
      }
      if (method === 'DELETE') {
        const id = searchParams.get('id')
        if (id) await deletePartner(id)
        return mockResponse({ success: true })
      }
    }

    // 6. TESTIMONIALS
    if (pathname === '/api/admin/testimonials') {
      if (method === 'GET') {
        const testimonials = await getTestimonials()
        return mockResponse({ testimonials })
      }
      if (method === 'POST') {
        const created = await addTestimonial(body)
        return mockResponse({ success: true, testimonial: created })
      }
      if (method === 'PUT') {
        if (body.action === 'reorder') {
          const batch = writeBatch(firestore)
          body.orderedIds.forEach((id: string | number, idx: number) => {
            const docRef = doc(firestore, 'testimonials', id.toString())
            batch.update(docRef, { order: idx })
          })
          await batch.commit()
          return mockResponse({ success: true })
        }
        const updated = await updateTestimonial(body.id, body)
        return mockResponse({ success: true, testimonial: updated })
      }
      if (method === 'DELETE') {
        const id = searchParams.get('id')
        if (id) await deleteTestimonial(id)
        return mockResponse({ success: true })
      }
    }

    // 7. INQUIRIES
    if (pathname === '/api/admin/inquiries') {
      if (method === 'GET') {
        const inquiries = await getInquiries()
        return mockResponse({ inquiries })
      }
      if (method === 'PUT') {
        if (body.isRead !== undefined) {
          const docRef = doc(firestore, 'inquiries', body.id.toString())
          await updateDoc(docRef, { isRead: body.isRead, status: body.isRead ? 'Read' : 'New' })
        } else if (body.status) {
          await updateInquiryStatus(body.id, body.status)
        }
        return mockResponse({ success: true })
      }
      if (method === 'DELETE') {
        const id = searchParams.get('id')
        if (id) await deleteInquiry(id)
        return mockResponse({ success: true })
      }
    }

    // 8. LOGISTICS
    if (pathname === '/api/admin/logistics') {
      if (method === 'GET') {
        const nodes = await getLogisticsNodes()
        return mockResponse({ nodes })
      }
      if (method === 'POST') {
        const created = await addLogisticsNode(body)
        return mockResponse({ success: true, node: created })
      }
      if (method === 'PUT') {
        if (body.action === 'reorder') {
          const batch = writeBatch(firestore)
          body.orderedIds.forEach((id: string | number, idx: number) => {
            const docRef = doc(firestore, 'logisticsNodes', id.toString())
            batch.update(docRef, { order: idx })
          })
          await batch.commit()
          return mockResponse({ success: true })
        }
        const updated = await updateLogisticsNode(body.id, body)
        return mockResponse({ success: true, node: updated })
      }
      if (method === 'DELETE') {
        const id = searchParams.get('id')
        if (id) await deleteLogisticsNode(id)
        return mockResponse({ success: true })
      }
    }

    // 9. GALLERY
    if (pathname === '/api/admin/gallery') {
      if (method === 'GET') {
        const images = await getGalleryImages()
        return mockResponse({ images })
      }
      if (method === 'POST') {
        const created = await addGalleryImage(body)
        return mockResponse({ success: true, image: created })
      }
      if (method === 'PUT') {
        if (body.action === 'reorder') {
          const batch = writeBatch(firestore)
          body.orderedIds.forEach((id: string | number, idx: number) => {
            const docRef = doc(firestore, 'galleryImages', id.toString())
            batch.update(docRef, { order: idx })
          })
          await batch.commit()
          return mockResponse({ success: true })
        }
        const updated = await updateGalleryImage(body.id, body)
        return mockResponse({ success: true, image: updated })
      }
      if (method === 'DELETE') {
        const id = searchParams.get('id')
        if (id) await deleteGalleryImage(id)
        return mockResponse({ success: true })
      }
    }

    // Fallback: standard browser fetch
    return window.fetch(inputUrl, init)
  } catch (err: any) {
    console.error('adminClientFetch error on', inputUrl, err)
    return mockResponse({ error: err.message || 'Operation failed' }, 500)
  }
}
