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
import { db as prismaDb } from './db'

const SETTINGS_DOC_ID = 'id_1'
const THEME_DOC_ID = 'id_1'

// Check if Firebase Client environment variables are available
export const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
)

/**
 * One-time automated database migration from SQLite to Firestore.
 * Runs on startup if Firebase is configured but Firestore settings are missing.
 */
export async function migrateDbToFirestore() {
  if (!isFirebaseConfigured) return

  // Seed default Super Admin user in Firebase Auth and Firestore
  try {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    const email = 'satsahebtrading126@gmail.com'
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'SatSaheb@2026'

    const signUpRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: defaultPassword,
          returnSecureToken: true
        })
      }
    )

    let uid = ''
    if (signUpRes.ok) {
      const data = await signUpRes.json()
      uid = data.localId
      console.log(`Created default Firebase Auth Super Admin account with UID: ${uid}`)
    } else {
      const errData = await signUpRes.json()
      if (errData.error?.message === 'EMAIL_EXISTS') {
        console.log('Default Super Admin account email already exists in Firebase Auth.')
      } else {
        console.error('Error seeding default Super Admin:', errData.error?.message)
      }
    }

    if (uid) {
      const userDocRef = doc(firestore, 'users', uid)
      await setDoc(userDocRef, {
        uid,
        email,
        name: 'admin',
        role: 'SUPER_ADMIN',
        status: 'active',
        profileImageUrl: '',
        permissions: {
          dashboard: { view: true, create: true, edit: true, delete: true },
          settings: { view: true, create: true, edit: true, delete: true },
          theme: { view: true, create: true, edit: true, delete: true },
          footer: { view: true, create: true, edit: true, delete: true },
          about: { view: true, create: true, edit: true, delete: true },
          contact: { view: true, create: true, edit: true, delete: true },
          formBuilder: { view: true, create: true, edit: true, delete: true },
          inquiries: { view: true, create: true, edit: true, delete: true },
          products: { view: true, create: true, edit: true, delete: true },
          categories: { view: true, create: true, edit: true, delete: true },
          gallery: { view: true, create: true, edit: true, delete: true },
          partners: { view: true, create: true, edit: true, delete: true },
          testimonials: { view: true, create: true, edit: true, delete: true },
          users: { view: true, create: true, edit: true, delete: true }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })
      console.log('Seeded default Super Admin Firestore document.')
    }
  } catch (err) {
    console.error('Failed to seed default Super Admin:', err)
  }

  try {
    const settingsRef = doc(firestore, 'websiteSettings', SETTINGS_DOC_ID)
    const settingsSnap = await getDoc(settingsRef)

    if (settingsSnap.exists()) {
      // Migration already done
      return
    }

    console.log('--- STARTING ONE-TIME SQLITE TO CLOUD FIRESTORE MIGRATION ---')

    // 1. Website Settings
    const settings = await prismaDb.websiteSettings.findUnique({ where: { id: 1 } })
    if (settings) {
      const data = { ...settings }
      delete (data as any).id
      await setDoc(doc(firestore, 'websiteSettings', SETTINGS_DOC_ID), data)
    }

    // 2. Theme Settings
    const theme = await prismaDb.themeSettings.findUnique({ where: { id: 1 } })
    if (theme) {
      const data = { ...theme }
      delete (data as any).id
      await setDoc(doc(firestore, 'themeSettings', THEME_DOC_ID), data)
    }

    // 3. Hero Slides
    const slides = await prismaDb.heroSlide.findMany()
    for (const slide of slides) {
      const data = { ...slide }
      delete (data as any).id
      await setDoc(doc(firestore, 'heroSlides', slide.id.toString()), data)
    }

    // 4. Categories
    const categories = await prismaDb.category.findMany()
    for (const cat of categories) {
      const data = { ...cat }
      delete (data as any).id
      await setDoc(doc(firestore, 'categories', cat.id.toString()), data)
    }

    // 5. Products
    const products = await prismaDb.product.findMany({
      include: { images: true }
    })
    for (const prod of products) {
      const data = { ...prod }
      delete (data as any).id
      // Convert relations to standard arrays
      const imageList = prod.images.map(img => {
        const item = { ...img }
        delete (item as any).id
        delete (item as any).productId
        return item
      })
      delete (data as any).images
      ;(data as any).images = imageList
      await setDoc(doc(firestore, 'products', prod.id.toString()), data)
    }

    // 6. Partners
    const partners = await prismaDb.partner.findMany()
    for (const part of partners) {
      const data = { ...part }
      delete (data as any).id
      await setDoc(doc(firestore, 'partners', part.id.toString()), data)
    }

    // 7. Testimonials
    const testimonials = await prismaDb.testimonial.findMany()
    for (const test of testimonials) {
      const data = { ...test }
      delete (data as any).id
      await setDoc(doc(firestore, 'testimonials', test.id.toString()), data)
    }

    // 8. Inquiries
    const inquiries = await prismaDb.inquiry.findMany()
    for (const inq of inquiries) {
      const data = { 
        ...inq,
        createdAt: inq.createdAt.toISOString()
      }
      delete (data as any).id
      await setDoc(doc(firestore, 'inquiries', inq.id.toString()), data)
    }

    // 9. Logistics Nodes
    const nodes = await prismaDb.logisticsNode.findMany()
    for (const node of nodes) {
      const data = { ...node }
      delete (data as any).id
      await setDoc(doc(firestore, 'logisticsNodes', node.id.toString()), data)
    }

    // 10. Gallery Images
    const gallery = await prismaDb.galleryImage.findMany()
    for (const img of gallery) {
      const data = { 
        ...img,
        createdAt: img.createdAt.toISOString()
      }
      delete (data as any).id
      await setDoc(doc(firestore, 'galleryImages', img.id.toString()), data)
    }

    console.log('--- SQLITE TO CLOUD FIRESTORE MIGRATION COMPLETED SUCCESSFULLY ---')
  } catch (err) {
    console.error('Migration failed:', err)
  }
}

// Helper: Convert firestore doc array to plain objects
function docsToArr(querySnapshot: any) {
  const arr: any[] = []
  querySnapshot.forEach((doc: any) => {
    arr.push({ id: doc.id, ...doc.data() })
  })
  return arr
}

// ==========================================
// DB OPERATIONS LAYER (FIRESTORE / PRISMA FALLBACK)
// ==========================================

export async function getWebsiteSettings() {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(firestore, 'websiteSettings', SETTINGS_DOC_ID)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        return { id: 1, ...snap.data() } as any
      }
    } catch (err) {
      console.error('Firestore getWebsiteSettings failed, falling back to SQLite:', err)
    }
  }
  return prismaDb.websiteSettings.findUnique({ where: { id: 1 } })
}

export async function updateWebsiteSettings(data: any) {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(firestore, 'websiteSettings', SETTINGS_DOC_ID)
      const payload = { ...data }
      delete payload.id
      await setDoc(docRef, payload, { merge: true })
      return { id: 1, ...data }
    } catch (err) {
      console.error('Firestore updateWebsiteSettings failed:', err)
    }
  }
  return prismaDb.websiteSettings.update({
    where: { id: 1 },
    data
  })
}

export async function getThemeSettings() {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(firestore, 'themeSettings', THEME_DOC_ID)
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        return { id: 1, ...snap.data() } as any
      }
    } catch (err) {
      console.error('Firestore getThemeSettings failed, falling back to SQLite:', err)
    }
  }
  return prismaDb.themeSettings.findUnique({ where: { id: 1 } })
}

export async function updateThemeSettings(data: any) {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(firestore, 'themeSettings', THEME_DOC_ID)
      const payload = { ...data }
      delete payload.id
      await setDoc(docRef, payload, { merge: true })
      return { id: 1, ...data }
    } catch (err) {
      console.error('Firestore updateThemeSettings failed:', err)
    }
  }
  return prismaDb.themeSettings.update({
    where: { id: 1 },
    data
  })
}

export async function getHeroSlides() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(firestore, 'heroSlides'), orderBy('order', 'asc'))
      const snap = await getDocs(q)
      const arr = docsToArr(snap)
      if (arr.length > 0) return arr
    } catch (err) {
      console.error('Firestore getHeroSlides failed, falling back to SQLite:', err)
    }
  }
  return prismaDb.heroSlide.findMany({ orderBy: { order: 'asc' } })
}

export async function addHeroSlide(data: any) {
  if (isFirebaseConfigured) {
    const docId = 'slide_' + Date.now().toString()
    await setDoc(doc(firestore, 'heroSlides', docId), data)
    return { id: docId, ...data }
  }
  return prismaDb.heroSlide.create({ data })
}

export async function updateHeroSlide(id: string | number, data: any) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(firestore, 'heroSlides', id.toString()), data)
    return { id, ...data }
  }
  return prismaDb.heroSlide.update({
    where: { id: Number(id) },
    data
  })
}

export async function deleteHeroSlide(id: string | number) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(firestore, 'heroSlides', id.toString()))
    return true
  }
  await prismaDb.heroSlide.delete({ where: { id: Number(id) } })
  return true
}

export async function getCategories() {
  if (isFirebaseConfigured) {
    try {
      const snap = await getDocs(collection(firestore, 'categories'))
      const arr = docsToArr(snap)
      if (arr.length > 0) return arr
    } catch (err) {
      console.error('Firestore getCategories failed, falling back to SQLite:', err)
    }
  }
  return prismaDb.category.findMany()
}

export async function addCategory(data: any) {
  if (isFirebaseConfigured) {
    const docId = 'cat_' + Date.now().toString()
    await setDoc(doc(firestore, 'categories', docId), data)
    return { id: docId, ...data }
  }
  return prismaDb.category.create({ data })
}

export async function updateCategory(id: string | number, data: any) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(firestore, 'categories', id.toString()), data)
    return { id, ...data }
  }
  return prismaDb.category.update({
    where: { id: Number(id) },
    data
  })
}

export async function deleteCategory(id: string | number) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(firestore, 'categories', id.toString()))
    return true
  }
  await prismaDb.category.delete({ where: { id: Number(id) } })
  return true
}

export async function getProducts() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(firestore, 'products'), orderBy('order', 'asc'))
      const snap = await getDocs(q)
      const arr = docsToArr(snap)
      if (arr.length > 0) return arr
    } catch (err) {
      console.error('Firestore getProducts failed, falling back to SQLite:', err)
    }
  }
  return prismaDb.product.findMany({
    orderBy: { order: 'asc' },
    include: { images: { orderBy: { order: 'asc' } } }
  })
}

export async function addProduct(data: any) {
  if (isFirebaseConfigured) {
    const docId = 'prod_' + Date.now().toString()
    const payload = { ...data }
    if (!payload.images) payload.images = []
    await setDoc(doc(firestore, 'products', docId), payload)
    return { id: docId, ...payload }
  }
  const images = data.images || []
  const payload = { ...data }
  delete payload.images
  return prismaDb.product.create({
    data: {
      ...payload,
      images: {
        create: images
      }
    },
    include: { images: true }
  })
}

export async function updateProduct(id: string | number, data: any) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(firestore, 'products', id.toString()), data)
    return { id, ...data }
  }
  const images = data.images || []
  const payload = { ...data }
  delete payload.images
  // Delete existing images and recreate
  await prismaDb.productImage.deleteMany({ where: { productId: Number(id) } })
  return prismaDb.product.update({
    where: { id: Number(id) },
    data: {
      ...payload,
      images: {
        create: images.map((img: any) => ({
          imageUrl: img.imageUrl,
          order: img.order
        }))
      }
    },
    include: { images: true }
  })
}

export async function deleteProduct(id: string | number) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(firestore, 'products', id.toString()))
    return true
  }
  await prismaDb.product.delete({ where: { id: Number(id) } })
  return true
}

export async function getPartners() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(firestore, 'partners'), orderBy('order', 'asc'))
      const snap = await getDocs(q)
      const arr = docsToArr(snap)
      if (arr.length > 0) return arr
    } catch (err) {
      console.error('Firestore getPartners failed, falling back to SQLite:', err)
    }
  }
  return prismaDb.partner.findMany({ orderBy: { order: 'asc' } })
}

export async function addPartner(data: any) {
  if (isFirebaseConfigured) {
    const docId = 'part_' + Date.now().toString()
    await setDoc(doc(firestore, 'partners', docId), data)
    return { id: docId, ...data }
  }
  return prismaDb.partner.create({ data })
}

export async function updatePartner(id: string | number, data: any) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(firestore, 'partners', id.toString()), data)
    return { id, ...data }
  }
  return prismaDb.partner.update({
    where: { id: Number(id) },
    data
  })
}

export async function deletePartner(id: string | number) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(firestore, 'partners', id.toString()))
    return true
  }
  await prismaDb.partner.delete({ where: { id: Number(id) } })
  return true
}

export async function getTestimonials() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(firestore, 'testimonials'), orderBy('order', 'asc'))
      const snap = await getDocs(q)
      const arr = docsToArr(snap)
      if (arr.length > 0) return arr
    } catch (err) {
      console.error('Firestore getTestimonials failed, falling back to SQLite:', err)
    }
  }
  return prismaDb.testimonial.findMany({ orderBy: { order: 'asc' } })
}

export async function addTestimonial(data: any) {
  if (isFirebaseConfigured) {
    const docId = 'test_' + Date.now().toString()
    await setDoc(doc(firestore, 'testimonials', docId), data)
    return { id: docId, ...data }
  }
  return prismaDb.testimonial.create({ data })
}

export async function updateTestimonial(id: string | number, data: any) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(firestore, 'testimonials', id.toString()), data)
    return { id, ...data }
  }
  return prismaDb.testimonial.update({
    where: { id: Number(id) },
    data
  })
}

export async function deleteTestimonial(id: string | number) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(firestore, 'testimonials', id.toString()))
    return true
  }
  await prismaDb.testimonial.delete({ where: { id: Number(id) } })
  return true
}

export async function getInquiries() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(firestore, 'inquiries'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      return docsToArr(snap)
    } catch (err) {
      console.error('Firestore getInquiries failed, falling back to SQLite:', err)
    }
  }
  return prismaDb.inquiry.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function addInquiry(data: any) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString()
  }
  if (isFirebaseConfigured) {
    const docId = 'inq_' + Date.now().toString()
    await setDoc(doc(firestore, 'inquiries', docId), payload)
    return { id: docId, ...payload }
  }
  return prismaDb.inquiry.create({
    data: {
      ...data,
      createdAt: new Date()
    }
  })
}

export async function updateInquiryStatus(id: string | number, status: string) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(firestore, 'inquiries', id.toString()), { status })
    return true
  }
  await prismaDb.inquiry.update({
    where: { id: Number(id) },
    data: { status }
  })
  return true
}

export async function deleteInquiry(id: string | number) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(firestore, 'inquiries', id.toString()))
    return true
  }
  await prismaDb.inquiry.delete({ where: { id: Number(id) } })
  return true
}

export async function getLogisticsNodes() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(firestore, 'logisticsNodes'), orderBy('order', 'asc'))
      const snap = await getDocs(q)
      const arr = docsToArr(snap)
      if (arr.length > 0) return arr
    } catch (err) {
      console.error('Firestore getLogisticsNodes failed, falling back to SQLite:', err)
    }
  }
  return prismaDb.logisticsNode.findMany({ orderBy: { order: 'asc' } })
}

export async function addLogisticsNode(data: any) {
  if (isFirebaseConfigured) {
    const docId = 'node_' + Date.now().toString()
    await setDoc(doc(firestore, 'logisticsNodes', docId), data)
    return { id: docId, ...data }
  }
  return prismaDb.logisticsNode.create({ data })
}

export async function updateLogisticsNode(id: string | number, data: any) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(firestore, 'logisticsNodes', id.toString()), data)
    return { id, ...data }
  }
  return prismaDb.logisticsNode.update({
    where: { id: Number(id) },
    data
  })
}

export async function deleteLogisticsNode(id: string | number) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(firestore, 'logisticsNodes', id.toString()))
    return true
  }
  await prismaDb.logisticsNode.delete({ where: { id: Number(id) } })
  return true
}

export async function getGalleryImages() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(firestore, 'galleryImages'), orderBy('order', 'asc'))
      const snap = await getDocs(q)
      const arr = docsToArr(snap)
      if (arr.length > 0) return arr
    } catch (err) {
      console.error('Firestore getGalleryImages failed, falling back to SQLite:', err)
    }
  }
  return prismaDb.galleryImage.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
}

export async function addGalleryImage(data: any) {
  const payload = {
    ...data,
    createdAt: new Date().toISOString()
  }
  if (isFirebaseConfigured) {
    const docId = 'gal_' + Date.now().toString()
    await setDoc(doc(firestore, 'galleryImages', docId), payload)
    return { id: docId, ...payload }
  }
  return prismaDb.galleryImage.create({
    data: {
      ...data,
      createdAt: new Date()
    }
  })
}

export async function updateGalleryImage(id: string | number, data: any) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(firestore, 'galleryImages', id.toString()), data)
    return { id, ...data }
  }
  return prismaDb.galleryImage.update({
    where: { id: Number(id) },
    data
  })
}

export async function deleteGalleryImage(id: string | number) {
  if (isFirebaseConfigured) {
    await deleteDoc(doc(firestore, 'galleryImages', id.toString()))
    return true
  }
  await prismaDb.galleryImage.delete({ where: { id: Number(id) } })
  return true
}
