// Client-Side Browser operations for Static Hostinger Premium
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
  where 
} from 'firebase/firestore'
import { auth, firestore } from './firebase'
import {
  getWebsiteSettings,
  getThemeSettings,
  getHeroSlides,
  getCategories,
  getProducts,
  getPartners,
  getTestimonials,
  getInquiries,
  getLogisticsNodes,
  getGalleryImages
} from './firebaseDb'

const CLOUD_NAME = 'kzmbkpoo'
const UPLOAD_PRESET = 'sat_saheb_uploads'

export async function uploadToCloudinaryBrowser(file: File, folder?: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  if (folder) {
    formData.append('folder', `sat_saheb/${folder}`)
  }

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || 'Direct Cloudinary browser upload failed')
  }

  const data = await res.json()
  return data.secure_url
}

export async function createAdminUserBrowser(user: {
  name: string
  email: string
  password?: string
  role: string
  status: string
  permissions: any
}) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyA3gPgl5S4IaWP5rrJ-wQcGDBD6rmDxb-I'
  
  // 1. Create User via Google Identity Toolkit REST API
  const signupRes = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: user.password || 'TempPass@2026' })
    }
  )

  if (!signupRes.ok) {
    const errData = await signupRes.json().catch(() => ({}))
    throw new Error(errData.error?.message || 'Authentication creation failed')
  }

  const signupData = await signupRes.json()
  const uid = signupData.localId

  // Send invitation password reset email
  try {
    await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestType: 'PASSWORD_RESET', email: user.email })
      }
    )
  } catch (e) {
    console.error('Failed to send invitation email:', e)
  }

  // 2. Save user profile metadata in Cloud Firestore
  const userDocRef = doc(firestore, 'users', uid)
  const userPayload = {
    uid,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status || 'active',
    profileImageUrl: '',
    permissions: user.permissions || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  await setDoc(userDocRef, userPayload)
  return userPayload
}

export async function listAdminUsersBrowser() {
  const snap = await getDocs(collection(firestore, 'users'))
  const users: any[] = []
  snap.forEach(d => users.push(d.data()))
  return users
}

export async function deleteAdminUserBrowser(uid: string) {
  await deleteDoc(doc(firestore, 'users', uid))
  return true
}

export async function submitInquiryBrowser(inquiryData: any) {
  const inquiriesRef = collection(firestore, 'inquiries')
  const newDoc = {
    ...inquiryData,
    createdAt: new Date().toISOString(),
    status: 'New',
    isRead: false
  }
  const ref = await addDoc(inquiriesRef, newDoc)
  return { id: ref.id, ...newDoc }
}

export {
  getWebsiteSettings,
  getThemeSettings,
  getHeroSlides,
  getCategories,
  getProducts,
  getPartners,
  getTestimonials,
  getInquiries,
  getLogisticsNodes,
  getGalleryImages
}
