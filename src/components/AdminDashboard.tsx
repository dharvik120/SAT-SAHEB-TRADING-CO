'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  Settings,
  Sliders,
  ShoppingBag,
  Users,
  MessageSquare,
  Mail,
  Palette,
  LogOut,
  Plus,
  Trash,
  ChevronUp,
  ChevronDown,
  Edit,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  Search,
  Check,
  Star,
  Building2,
  BookOpen,
  Globe,
  Phone,
  ToggleLeft,
  FolderOpen,
  Compass,
  FileText,
  Upload,
  Image as ImageIcon,
  User,
  ShieldCheck,
  Key
} from 'lucide-react'
import { auth, firestore } from '@/lib/firebase'
import { adminClientFetch as fetch } from '@/lib/adminClientFetch'

// Define typings based on Prisma models
interface SettingsData {
  companyName: string
  address: string
  email: string
  phone1: string
  phone2: string
  whatsappNumber: string
  whatsappDefaultMessage: string
  googleMapUrl: string
  preloaderEnabled: boolean
  whatsappEnabled: boolean
  
  storyEnabled: boolean
  storyLabel: string
  storyTitle: string
  storyDescription: string
  storyBtnText: string
  storyBtnLink: string
  storyBtnVisible: boolean
  storyImage: string
  storyPillar1Title: string
  storyPillar1Desc: string
  storyPillar2Title: string
  storyPillar2Desc: string
  storyPillar3Title: string
  storyPillar3Desc: string
  storyPillar4Title: string
  storyPillar4Desc: string

  featuredProductsEnabled: boolean
  featuredProductsLabel: string
  featuredProductsTitle: string
  featuredProductsSubtitle: string

  aboutSectionEnabled: boolean
  aboutSectionLabel: string
  aboutSectionTitle: string
  aboutSectionDescription: string
  aboutSectionImage: string
  aboutSectionBtnText: string
  aboutSectionBtnLink: string
  aboutSectionBtnVisible: boolean

  logisticsEnabled: boolean
  logisticsLabel: string
  logisticsTitle: string
  logisticsOriginTitle: string
  logisticsOriginDesc: string

  reviewsEnabled: boolean
  reviewsLabel: string
  reviewsTitle: string
  reviewsSubtitle: string

  contactSectionEnabled: boolean
  contactSectionLabel: string
  contactSectionTitle: string
  contactSectionDescription: string
  contactFormTitle: string
  contactFormSubtitle: string
  contactSuccessMsg: string
  contactErrorMsg: string
  contactBtnText: string

  footerDescription: string
  footerCopyright: string
  socialFacebook: string
  socialTwitter: string
  socialLinkedIn: string
  socialInstagram: string
  socialYoutube: string
  customSocialName: string
  customSocialUrl: string
  customSocialSvg: string

  // Logo & Favicon
  logo: string
  favicon: string

  // SEO & OpenGraph Settings
  seoTitle: string
  seoDescription: string
  ogTitle: string
  ogDescription: string
  ogImage: string

  // About Us Page
  aboutCorporateProfileEnabled: boolean
  aboutCorporateProfileLabel: string
  aboutCorporateProfileTitle: string
  aboutCorporateProfileDesc: string
  aboutCorporateProfileImage: string
  aboutCorporateProfileParagraphs: string
  aboutCoreOperationsEnabled: boolean
  aboutCoreOperationsLabel: string
  aboutCoreOperationsTitle: string
  aboutCoreOperationsDesc1: string
  aboutCoreOperationsDesc2: string
  aboutCards: string
  aboutCtaEnabled: boolean
  aboutCtaLabel: string
  aboutCtaTitle: string
  aboutCtaDesc: string
  aboutCtaPrimaryText: string
  aboutCtaPrimaryLink: string
  aboutCtaSecondaryText: string
  aboutCtaSecondaryLink: string
  aboutCtaBgImage: string

  // Dynamic Inquiry Form & Footer Links
  formFields: string
  footerLinks: string

  // Visual Customizations & Details Lists
  contactOfficeTitle: string
  contactPhones: string
  contactEmails: string
  footerCategories: string
  productPageLabel: string
  productPageTitle: string
  productPageDescription: string
  galleryPageLabel: string
  galleryPageTitle: string
  galleryPageDescription: string
  contactPageLabel: string
  contactPageTitle: string
  contactPageDescription: string
  socialLinksList: string
}

interface ThemeData {
  themeName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bgPrimary: string
  bgSecondary: string
  textPrimary: string
  textSecondary: string
  buttonStyle: string
}

interface SlideData {
  id: number
  title: string
  subtitle: string
  description: string
  imageUrl: string
  mobileImageUrl?: string | null
  primaryCtaText?: string | null
  primaryCtaLink?: string | null
  secondaryCtaText?: string | null
  secondaryCtaLink?: string | null
  alignment: string
  order: number
  isEnabled: boolean
}

interface ProductData {
  id: number
  title: string
  slug: string
  featuredImage: string
  overview: string
  description: string
  specifications: string
  categoryId: number
  metaTitle?: string | null
  metaDescription?: string | null
  isEnabled: boolean
  isFeatured: boolean
  order: number
  featuredOrder: number
  gallery?: string[]
}

interface CategoryData {
  id: number
  name: string
  slug: string
  description?: string | null
}

interface PartnerData {
  id: number
  name: string
  role: string
  description: string
  phone?: string | null
  imageUrl: string
  order: number
  isVisible: boolean
}

interface TestimonialData {
  id: number
  name: string
  role?: string | null
  company?: string | null
  location?: string | null
  imageUrl?: string | null
  review: string
  rating: number
  order: number
  isEnabled: boolean
}

interface InquiryData {
  id: number
  name: string
  email: string
  phone: string
  company?: string | null
  country?: string | null
  state?: string | null
  productInterest?: string | null
  message: string
  isRead: boolean
  isReplied: boolean
  status?: string | null
  createdAt: string | Date
}

interface GalleryImageData {
  id: number
  title: string
  caption?: string | null
  url: string
  category: string
  order: number
  isEnabled: boolean
}

interface LogisticsNodeData {
  id: number
  name: string
  xCoord: number
  yCoord: number
  info: string
  type: string
  isEnabled: boolean
  order: number
}

interface AdminDashboardProps {
  initialSettings: any
  initialTheme: any
  initialSlides: any[]
  initialProducts: any[]
  initialCategories: any[]
  initialPartners: any[]
  initialTestimonials: any[]
  initialInquiries: any[]
  initialNodes: any[]
  initialGallery: any[]
  username: string
}

function formatDate(dateString: string | Date) {
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return 'N/A'
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

function formatDateTime(dateString: string | Date) {
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return 'N/A'
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day}/${month}/${year}, ${hours}:${minutes}`
}

export default function AdminDashboard({
  initialSettings,
  initialTheme,
  initialSlides,
  initialProducts,
  initialCategories,
  initialPartners,
  initialTestimonials,
  initialInquiries,
  initialNodes,
  initialGallery,
  username
}: AdminDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'homepage-overview'
    | 'slides'
    | 'story-settings'
    | 'featured-products-settings'
    | 'about-section-settings'
    | 'logistics-settings'
    | 'global-reviews-settings'
    | 'contact-settings'
    | 'general-homepage-settings'
    | 'products'
    | 'categories-settings'
    | 'partners'
    | 'testimonials'
    | 'inquiries'
    | 'gallery'
    | 'settings'
    | 'theme'
    | 'footer-settings'
    | 'about-us-page-settings'
    | 'inquiry-form-settings'
    | 'footer-links-settings'
    | 'users'
    | 'profile'
  >('overview')

  // Notification States
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  // DB States
  const [settings, setSettings] = useState<SettingsData>(initialSettings)
  const [theme, setTheme] = useState<ThemeData>(initialTheme)
  const [slides, setSlides] = useState<SlideData[]>(initialSlides)
  const [products, setProducts] = useState<ProductData[]>(initialProducts)
  const [categories, setCategories] = useState<CategoryData[]>(initialCategories)
  const [partners, setPartners] = useState<PartnerData[]>(initialPartners)
  const [testimonials, setTestimonials] = useState<TestimonialData[]>(initialTestimonials)
  const [inquiries, setInquiries] = useState<InquiryData[]>(initialInquiries)
  const [nodes, setNodes] = useState<LogisticsNodeData[]>(initialNodes || [])
  const [gallery, setGallery] = useState<GalleryImageData[]>(initialGallery || [])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Submitting States
  const [saving, setSaving] = useState(false)

  // Edit Modals / Form States
  const [editProduct, setEditProduct] = useState<Partial<ProductData> | null>(null)
  const [editSlide, setEditSlide] = useState<Partial<SlideData> | null>(null)
  const [editPartner, setEditPartner] = useState<Partial<PartnerData> | null>(null)
  const [editTestimonial, setEditTestimonial] = useState<Partial<TestimonialData> | null>(null)
  const [editGalleryImage, setEditGalleryImage] = useState<Partial<GalleryImageData> | null>(null)
  const [editNode, setEditNode] = useState<Partial<LogisticsNodeData> | null>(null)
  const [editCategory, setEditCategory] = useState<Partial<CategoryData> | null>(null)

  // Dynamic lists states (for About Page, Inquiry Form Builder, Footer Links)
  const [aboutCards, setAboutCards] = useState<any[]>([])
  const [formFields, setFormFields] = useState<any[]>([])
  const [footerLinks, setFooterLinks] = useState<any[]>([])
  const [editAboutCard, setEditAboutCard] = useState<any | null>(null)
  const [editFormField, setEditFormField] = useState<any | null>(null)
  const [editFooterLink, setEditFooterLink] = useState<any | null>(null)

  // SECTION 2 - Direct hotlines & emails
  const [contactPhones, setContactPhones] = useState<string[]>([])
  const [contactEmails, setContactEmails] = useState<string[]>([])

  // SECTION 3 - Nested Categories & Links list
  const [footerCategories, setFooterCategories] = useState<any[]>([])
  const [editFooterCategory, setEditFooterCategory] = useState<any | null>(null)

  // User Management State declarations
  const [userList, setUserList] = useState<any[]>([])
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
    status: 'active',
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
    }
  })

  // Profile management State declarations
  const [profileName, setProfileName] = useState(username)
  const [profilePassword, setProfilePassword] = useState('')
  const [profileNewPassword, setProfileNewPassword] = useState('')
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('')
  const [showProfilePassword, setShowProfilePassword] = useState(false)
  const [showProfileNewPassword, setShowProfileNewPassword] = useState(false)
  const [showProfileConfirmPassword, setShowProfileConfirmPassword] = useState(false)
  const [profileNewEmail, setProfileNewEmail] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileImage, setProfileImage] = useState('')
  const [profileRole, setProfileRole] = useState('ADMIN')

  // Fetch current user details on mount
  useEffect(() => {
    const loadCurrentUserDetails = async () => {
      try {
        const currentUser = auth.currentUser
        if (currentUser) {
          setProfileImage(currentUser.photoURL || '')
          const { doc, getDoc } = await import('firebase/firestore')
          const snap = await getDoc(doc(firestore, 'users', currentUser.uid))
          if (snap.exists()) {
            const data = snap.data()
            if (data.role) setProfileRole(data.role)
            if (data.profileImageUrl) setProfileImage(data.profileImageUrl)
            if (data.name) setProfileName(data.name)
          }
        }
      } catch (err) {
        console.error('Failed to load current admin user profile details:', err)
      }
    }
    loadCurrentUserDetails()
  }, [])

  // Fetch users when active tab becomes users
  useEffect(() => {
    if (activeTab === 'users') {
      import('@/lib/firebaseClientOperations')
        .then(({ listAdminUsersBrowser }) => listAdminUsersBrowser())
        .then(users => {
          setUserList(users)
        })
        .catch(err => {
          console.error('Failed to retrieve administrators list', err)
          showToast('error', 'Failed to retrieve administrators list')
        })
    }
  }, [activeTab])

  // SECTION 8 - Social Link List
  const [socialLinksList, setSocialLinksList] = useState<any[]>([])
  const [editSocialLink, setEditSocialLink] = useState<any | null>(null)

  // Sync state with settings on initial settings load
  useState(() => {
    let parsedCards = []
    if (initialSettings?.aboutCards) {
      try { parsedCards = JSON.parse(initialSettings.aboutCards) } catch(e) {}
    }
    if (!parsedCards || parsedCards.length === 0) {
      parsedCards = [
        { id: '1', title: 'Business Philosophy', description: 'Pillared on transparency, integrity, and client success. We foster fair-trade parameters with local growers while assuring top compliance standards for global buyers.', icon: 'Landmark', customSvg: '', imageUrl: '', isEnabled: true, order: 0 },
        { id: '2', title: 'Global Positioning', description: 'Strategically localized near Mundra Port, Kutches major marine terminal, simplifying logistics customs and accelerating container sea transit timelines.', icon: 'Compass', customSvg: '', imageUrl: '', isEnabled: true, order: 1 }
      ]
    }
    setAboutCards(parsedCards)

    let parsedFields = []
    if (initialSettings?.formFields) {
      try { parsedFields = JSON.parse(initialSettings.formFields) } catch(e) {}
    }
    if (!parsedFields || parsedFields.length === 0) {
      parsedFields = [
        { id: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe', required: true, enabled: true, order: 0 },
        { id: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g. john@company.com', required: true, enabled: true, order: 1 },
        { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'e.g. +91 90996 67113', required: true, enabled: true, order: 2 },
        { id: 'company', label: 'Company Name', type: 'text', placeholder: 'e.g. Acme Import Export', required: false, enabled: true, order: 3 },
        { id: 'country', label: 'Country', type: 'text', placeholder: 'e.g. United Arab Emirates', required: false, enabled: true, order: 4 },
        { id: 'state', label: 'State', type: 'text', placeholder: 'e.g. Gujarat', required: false, enabled: true, order: 5 },
        { id: 'productInterest', label: 'Product Interest', type: 'select', placeholder: 'Select a commodity...', required: false, enabled: true, order: 6 },
        { id: 'message', label: 'Message / Inquiry Details', type: 'textarea', placeholder: 'Please detail your quantity and packaging requirements...', required: true, enabled: true, order: 7 }
      ]
    }
    setFormFields(parsedFields)

    let parsedLinks = []
    if (initialSettings?.footerLinks) {
      try { parsedLinks = JSON.parse(initialSettings.footerLinks) } catch(e) {}
    }
    if (!parsedLinks || parsedLinks.length === 0) {
      parsedLinks = [
        { id: '1', label: 'Home', url: '/', isEnabled: true, order: 0 },
        { id: '2', label: 'About Us', url: '/about', isEnabled: true, order: 1 },
        { id: '3', label: 'Products', url: '/products', isEnabled: true, order: 2 },
        { id: '4', label: 'Gallery', url: '/gallery', isEnabled: true, order: 3 },
        { id: '5', label: 'Contact Us', url: '/contact', isEnabled: true, order: 4 },
      ]
    }
    setFooterLinks(parsedLinks)

    // Parse phones list
    let parsedPhones = []
    if (initialSettings?.contactPhones) {
      try { parsedPhones = JSON.parse(initialSettings.contactPhones) } catch(e) {}
    }
    if (!parsedPhones || parsedPhones.length === 0) {
      parsedPhones = [initialSettings?.phone1, initialSettings?.phone2].filter(Boolean)
    }
    setContactPhones(parsedPhones)

    // Parse emails list
    let parsedEmails = []
    if (initialSettings?.contactEmails) {
      try { parsedEmails = JSON.parse(initialSettings.contactEmails) } catch(e) {}
    }
    if (!parsedEmails || parsedEmails.length === 0) {
      parsedEmails = [initialSettings?.email].filter(Boolean)
    }
    setContactEmails(parsedEmails)

    // Parse footer categories
    let parsedCategories = []
    if (initialSettings?.footerCategories) {
      try { parsedCategories = JSON.parse(initialSettings.footerCategories) } catch(e) {}
    }
    if (!parsedCategories || parsedCategories.length === 0) {
      parsedCategories = [
        {
          id: 'quick-nav',
          name: 'Quick Navigation',
          order: 0,
          links: parsedLinks
        },
        {
          id: 'key-commodities',
          name: 'Key Commodities',
          order: 1,
          links: [
            { id: 'c1', label: 'Red Kidney Beans', url: '/products', isEnabled: true, order: 0 },
            { id: 'c2', label: 'Kabuli Chana', url: '/products', isEnabled: true, order: 1 },
            { id: 'c3', label: 'Toor Dal', url: '/products', isEnabled: true, order: 2 },
            { id: 'c4', label: 'Cumin Seeds', url: '/products', isEnabled: true, order: 3 }
          ]
        }
      ]
    }
    setFooterCategories(parsedCategories)

    // Parse social links list
    let parsedSocials = []
    if (initialSettings?.socialLinksList) {
      try { parsedSocials = JSON.parse(initialSettings.socialLinksList) } catch(e) {}
    }
    if (!parsedSocials || parsedSocials.length === 0) {
      parsedSocials = [
        { id: 'fb', platform: 'facebook', url: initialSettings?.socialFacebook || 'https://facebook.com', isEnabled: true, order: 0, isCustom: false },
        { id: 'ig', platform: 'instagram', url: initialSettings?.socialInstagram || 'https://instagram.com', isEnabled: true, order: 1, isCustom: false },
        { id: 'li', platform: 'linkedin', url: initialSettings?.socialLinkedIn || 'https://linkedin.com', isEnabled: true, order: 2, isCustom: false },
        { id: 'yt', platform: 'youtube', url: initialSettings?.socialYoutube || 'https://youtube.com', isEnabled: true, order: 3, isCustom: false }
      ]
    }
    setSocialLinksList(parsedSocials)
  })

  // REAL-TIME FIRESTORE SYNC: Keep AdminDashboard live-updated across refreshes and multiple tabs
  useEffect(() => {
    let unsubSettings: (() => void) | null = null
    let unsubTheme: (() => void) | null = null
    let unsubProducts: (() => void) | null = null
    let unsubSlides: (() => void) | null = null
    let unsubCategories: (() => void) | null = null
    let unsubPartners: (() => void) | null = null
    let unsubTestimonials: (() => void) | null = null
    let unsubInquiries: (() => void) | null = null
    let unsubGallery: (() => void) | null = null
    let unsubNodes: (() => void) | null = null

    try {
      import('firebase/firestore').then(({ doc, collection, onSnapshot }) => {
        // 1. Settings
        unsubSettings = onSnapshot(doc(firestore, 'websiteSettings', 'id_1'), (snap) => {
          if (snap.exists() && !snap.metadata?.hasPendingWrites) {
            const data = snap.data() as any
            setSettings(prev => ({ ...prev, ...data }))
            if (data.aboutCards) {
              try { setAboutCards(JSON.parse(data.aboutCards)) } catch (e) {}
            }
            if (data.formFields) {
              try { setFormFields(JSON.parse(data.formFields)) } catch (e) {}
            }
            if (data.footerLinks) {
              try { setFooterLinks(JSON.parse(data.footerLinks)) } catch (e) {}
            }
            if (data.contactPhones) {
              try { setContactPhones(JSON.parse(data.contactPhones)) } catch (e) {}
            }
            if (data.contactEmails) {
              try { setContactEmails(JSON.parse(data.contactEmails)) } catch (e) {}
            }
            if (data.footerCategories) {
              try { setFooterCategories(JSON.parse(data.footerCategories)) } catch (e) {}
            }
            if (data.socialLinksList) {
              try { setSocialLinksList(JSON.parse(data.socialLinksList)) } catch (e) {}
            }
          }
        })

        // 2. Theme
        unsubTheme = onSnapshot(doc(firestore, 'themeSettings', 'id_1'), (snap) => {
          if (snap.exists()) {
            setTheme(prev => ({ ...prev, ...snap.data() } as any))
          }
        })

        // 3. Products
        unsubProducts = onSnapshot(collection(firestore, 'products'), (snap) => {
          if (!snap.empty) {
            const prods: any[] = []
            snap.forEach(d => prods.push({ id: d.id, ...d.data() }))
            prods.sort((a, b) => (a.order || 0) - (b.order || 0))
            setProducts(prods)
          }
        })

        // 4. Hero Slides
        unsubSlides = onSnapshot(collection(firestore, 'heroSlides'), (snap) => {
          if (!snap.empty) {
            const s: any[] = []
            snap.forEach(d => s.push({ id: d.id, ...d.data() }))
            s.sort((a, b) => (a.order || 0) - (b.order || 0))
            setSlides(s)
          }
        })

        // 5. Categories
        unsubCategories = onSnapshot(collection(firestore, 'categories'), (snap) => {
          if (!snap.empty) {
            const cats: any[] = []
            snap.forEach(d => cats.push({ id: d.id, ...d.data() }))
            setCategories(cats)
          }
        })

        // 6. Partners
        unsubPartners = onSnapshot(collection(firestore, 'partners'), (snap) => {
          if (!snap.empty) {
            const parts: any[] = []
            snap.forEach(d => parts.push({ id: d.id, ...d.data() }))
            parts.sort((a, b) => (a.order || 0) - (b.order || 0))
            setPartners(parts)
          }
        })

        // 7. Testimonials
        unsubTestimonials = onSnapshot(collection(firestore, 'testimonials'), (snap) => {
          if (!snap.empty) {
            const tests: any[] = []
            snap.forEach(d => tests.push({ id: d.id, ...d.data() }))
            tests.sort((a, b) => (a.order || 0) - (b.order || 0))
            setTestimonials(tests)
          }
        })

        // 8. Inquiries
        unsubInquiries = onSnapshot(collection(firestore, 'inquiries'), (snap) => {
          const inqs: any[] = []
          snap.forEach(d => inqs.push({ id: d.id, ...d.data() }))
          inqs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          setInquiries(inqs)
        })

        // 9. Gallery
        unsubGallery = onSnapshot(collection(firestore, 'galleryImages'), (snap) => {
          const gals: any[] = []
          snap.forEach(d => gals.push({ id: d.id, ...d.data() }))
          gals.sort((a, b) => (a.order || 0) - (b.order || 0))
          setGallery(gals)
        })

        // 10. Logistics Nodes
        unsubNodes = onSnapshot(collection(firestore, 'logisticsNodes'), (snap) => {
          const nds: any[] = []
          snap.forEach(d => nds.push({ id: d.id, ...d.data() }))
          nds.sort((a, b) => (a.order || 0) - (b.order || 0))
          setNodes(nds)
        })
      })
    } catch (e) {
      console.warn('AdminDashboard live listener initialization skipped:', e)
    }

    return () => {
      if (unsubSettings) unsubSettings()
      if (unsubTheme) unsubTheme()
      if (unsubProducts) unsubProducts()
      if (unsubSlides) unsubSlides()
      if (unsubCategories) unsubCategories()
      if (unsubPartners) unsubPartners()
      if (unsubTestimonials) unsubTestimonials()
      if (unsubInquiries) unsubInquiries()
      if (unsubGallery) unsubGallery()
      if (unsubNodes) unsubNodes()
    }
  }, [])


  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  const handleUploadImage = async (file: File, folder: 'products' | 'partners' | 'slides' | 'logo' | 'gallery') => {
    try {
      const { uploadToCloudinaryBrowser } = await import('@/lib/firebaseClientOperations')
      const url = await uploadToCloudinaryBrowser(file, folder)
      return url
    } catch (err: any) {
      console.error('Upload failed:', err)
      showToast('error', err.message || 'Image upload failed')
      return null
    }
  }

  const ImageUploadInput = ({
    value,
    onChange,
    folder,
    label = "Upload File"
  }: {
    value: string;
    onChange: (val: string) => void;
    folder: 'products' | 'partners' | 'slides' | 'logo' | 'gallery';
    label?: string;
  }) => {
    const [uploading, setUploading] = useState(false)
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
            placeholder="Image path or URL"
          />
          <label className="cursor-pointer px-4 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors text-xs font-bold uppercase tracking-wider block whitespace-nowrap">
            <span className="flex items-center gap-1">
              <Upload className="h-3.5 w-3.5" />
              {uploading ? 'Uploading...' : label}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setUploading(true)
                  const url = await handleUploadImage(file, folder)
                  setUploading(false)
                  if (url) onChange(url)
                }
              }}
            />
          </label>
        </div>
        {value && (
          <div className="relative h-20 w-32 border border-accent overflow-hidden bg-bg-secondary flex items-center justify-center p-1 mt-2">
            <img src={value} alt="Preview" className="h-full w-full object-contain" />
          </div>
        )}
      </div>
    )
  }

  // LOGOUT
  const handleLogout = async () => {
    try {
      const { signOut } = await import('firebase/auth')
      await signOut(auth)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sst_admin_logged_in')
        localStorage.removeItem('sst_admin_email')
      }
      router.push('/admin/login/')
    } catch {
      showToast('error', 'Logout failed')
    }
  }

  // UPDATE SETTINGS
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to save settings')
      showToast('success', 'General settings saved successfully')
    } catch (e: any) {
      showToast('error', e.message)
    } finally {
      setSaving(false)
    }
  }

  // UPDATE THEME Styles
  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(theme),
      })
      if (!res.ok) throw new Error('Failed to save theme')
      showToast('success', 'Theme settings updated successfully')
      router.refresh()
    } catch (e: any) {
      showToast('error', e.message)
    } finally {
      setSaving(false)
    }
  }

  // INQUIRIES: Toggle read status
  const handleToggleRead = async (id: number, currentRead: boolean) => {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: !currentRead }),
      })
      if (!res.ok) throw new Error()
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, isRead: !currentRead } : inq))
      showToast('success', `Marked inquiry as ${!currentRead ? 'read' : 'unread'}`)
    } catch {
      showToast('error', 'Failed to update status')
    }
  }

  // INQUIRIES: Delete
  const handleDeleteInquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setInquiries(prev => prev.filter(inq => inq.id !== id))
      showToast('success', 'Inquiry deleted successfully')
    } catch {
      showToast('error', 'Failed to delete inquiry')
    }
  }

  // CRM: Export to Excel/CSV
  const handleExportExcel = () => {
    if (inquiries.length === 0) {
      showToast('error', 'No inquiries to export')
      return
    }
    const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Company', 'State', 'Country', 'Product Interest', 'Message', 'Status']
    const rows = inquiries.map(inq => [
      inq.id,
      formatDateTime(inq.createdAt),
      inq.name,
      inq.email,
      `\t${inq.phone}`, // Force excel to treat phone as text string
      inq.company || '',
      inq.state || '',
      inq.country || '',
      inq.productInterest || 'General Inquiry',
      inq.message.replace(/"/g, '""'),
      inq.status || (inq.isRead ? 'Read' : 'New')
    ])

    const csvContent = "\uFEFF" + [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${val}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `SAT_SAHEB_Inquiries_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('success', 'Inquiries exported to Excel/CSV successfully')
  }

  // CRM: Export to PDF (Clean printing layout)
  const handleExportPDF = () => {
    if (inquiries.length === 0) {
      showToast('error', 'No inquiries to export')
      return
    }
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      showToast('error', 'Popup blocker prevented exporting PDF')
      return
    }

    const rowsHtml = inquiries.map(inq => {
      const companyStr = inq.company || '-'
      const locationParts = [inq.state, inq.country].filter(Boolean).join(', ') || '-'
      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 10px; font-size: 11px;">${formatDate(inq.createdAt)}</td>
          <td style="padding: 10px; font-size: 11px; font-weight: bold;">${inq.name}</td>
          <td style="padding: 10px; font-size: 11px;">${inq.email}<br/>${inq.phone}</td>
          <td style="padding: 10px; font-size: 11px;">${companyStr}<br/>${locationParts}</td>
          <td style="padding: 10px; font-size: 11px; color: #06402b; font-weight: bold;">${inq.productInterest || 'General'}</td>
          <td style="padding: 10px; font-size: 10px; line-height: 1.4; max-width: 250px; word-wrap: break-word;">${inq.message}</td>
          <td style="padding: 10px; font-size: 11px; text-transform: uppercase;">${inq.status || (inq.isRead ? 'Read' : 'New')}</td>
        </tr>
      `
    }).join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>SAT SAHEB TRADING CO. - Inquiry Registry Export</title>
          <style>
            body { font-family: 'Inter', Helvetica, Arial, sans-serif; color: #333; margin: 40px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #06402b; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-text { font-family: Georgia, serif; font-size: 24px; color: #06402b; letter-spacing: 2px; font-weight: bold; }
            .meta-text { text-align: right; font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #06402b; color: white; padding: 12px 10px; font-size: 11px; text-transform: uppercase; font-weight: bold; text-align: left; }
            @media print {
              body { margin: 20px; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo-text">SAT SAHEB TRADING CO.</div>
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-top: 5px;">Corporate Trade Desk Inquiries Report</div>
            </div>
            <div class="meta-text">
              <strong>Export Date:</strong> ${new Date().toLocaleString()}<br/>
              <strong>Total Records:</strong> ${inquiries.length}
            </div>
          </div>
          <h3>Client Inquiries Registry</h3>
          <table>
            <thead>
              <tr>
                <th style="width: 10%;">Date</th>
                <th style="width: 15%;">Client Name</th>
                <th style="width: 18%;">Contact</th>
                <th style="width: 15%;">Company/Country</th>
                <th style="width: 15%;">Interest</th>
                <th style="width: 20%;">Message Summary</th>
                <th style="width: 7%;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  // SLIDES: Reorder UP / DOWN
  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= slides.length) return

    const newSlides = [...slides]
    const [moved] = newSlides.splice(index, 1)
    newSlides.splice(nextIndex, 0, moved)

    setSlides(newSlides)

    try {
      const res = await fetch('/api/admin/slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', orderedIds: newSlides.map(s => s.id) }),
      })
      if (!res.ok) throw new Error()
    } catch {
      showToast('error', 'Failed to save slide order')
    }
  }

  // PRODUCTS: Reorder UP / DOWN
  const handleMoveProduct = async (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= products.length) return

    const newProducts = [...products]
    const [moved] = newProducts.splice(index, 1)
    newProducts.splice(nextIndex, 0, moved)

    setProducts(newProducts)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', orderedIds: newProducts.map(p => p.id) }),
      })
      if (!res.ok) throw new Error()
    } catch {
      showToast('error', 'Failed to save product order')
    }
  }

  // SLIDES: Save
  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editSlide) return
    setSaving(true)
    try {
      const isEdit = !!editSlide.id
      const res = await fetch('/api/admin/slides', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editSlide),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      
      if (isEdit) {
        setSlides(prev => prev.map(s => s.id === editSlide.id ? { ...s, ...editSlide } as SlideData : s))
        showToast('success', 'Slide updated successfully')
      } else {
        setSlides(prev => [...prev, data.slide])
        showToast('success', 'Slide created successfully')
      }
      setEditSlide(null)
    } catch {
      showToast('error', 'Failed to save slide')
    } finally {
      setSaving(false)
    }
  }

  // SLIDES: Delete
  const handleDeleteSlide = async (id: number) => {
    if (!confirm('Are you sure you want to delete this slide?')) return
    try {
      const res = await fetch(`/api/admin/slides?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setSlides(prev => prev.filter(s => s.id !== id))
      showToast('success', 'Slide deleted successfully')
    } catch {
      showToast('error', 'Failed to delete slide')
    }
  }

  // PRODUCTS: Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editProduct) return
    setSaving(true)
    try {
      const isEdit = !!editProduct.id
      const galleryList = Array.isArray(editProduct.gallery) ? editProduct.gallery : []
      const productPayload = {
        ...editProduct,
        gallery: galleryList,
        images: galleryList.map((url: string, idx: number) => ({ url, order: idx })),
      }
      const res = await fetch('/api/admin/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      
      if (isEdit) {
        setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...productPayload } as ProductData : p))
        showToast('success', 'Product updated successfully')
      } else {
        setProducts(prev => [...prev, data.product])
        showToast('success', 'Product created successfully')
      }

      // Sync product gallery images to global gallery automatically
      if (editProduct.gallery && Array.isArray(editProduct.gallery) && editProduct.gallery.length > 0) {
        for (const url of editProduct.gallery) {
          const existsInGallery = gallery.find(g => g.url === url)
          if (!existsInGallery) {
            try {
              const gRes = await fetch('/api/admin/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  title: `${editProduct.title} Showcase`,
                  caption: `Showcase image for ${editProduct.title}`,
                  url: url,
                  category: editProduct.title,
                  isEnabled: true,
                  order: 0
                })
              })
              if (gRes.ok) {
                const newGal = await gRes.json()
                setGallery(prev => [...prev, newGal])
              }
            } catch (err) {
              console.error('Failed to sync gallery image', err)
            }
          }
        }
      }

      setEditProduct(null)
    } catch {
      showToast('error', 'Failed to save product details')
    } finally {
      setSaving(false)
    }
  }

  // PARTNERS: Save
  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editPartner) return
    setSaving(true)
    try {
      const isEdit = !!editPartner.id
      const res = await fetch('/api/admin/partners', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editPartner),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      
      if (isEdit) {
        setPartners(prev => prev.map(p => p.id === editPartner.id ? { ...p, ...editPartner } as PartnerData : p))
        showToast('success', 'Partner profile updated successfully')
      } else {
        setPartners(prev => [...prev, data.partner])
        showToast('success', 'Partner profile created successfully')
      }
      setEditPartner(null)
    } catch {
      showToast('error', 'Failed to save partner profile')
    } finally {
      setSaving(false)
    }
  }

  // PARTNERS: Delete
  const handleDeletePartner = async (id: number) => {
    if (!confirm('Are you sure you want to delete this partner profile?')) return
    try {
      const res = await fetch(`/api/admin/partners?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setPartners(prev => prev.filter(p => p.id !== id))
      showToast('success', 'Partner profile deleted successfully')
    } catch {
      showToast('error', 'Failed to delete partner profile')
    }
  }

  // TESTIMONIALS: Save
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTestimonial) return
    setSaving(true)
    try {
      const isEdit = !!editTestimonial.id
      const res = await fetch('/api/admin/testimonials', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTestimonial),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      
      if (isEdit) {
        setTestimonials(prev => prev.map(t => t.id === editTestimonial.id ? { ...t, ...editTestimonial } as TestimonialData : t))
        showToast('success', 'Testimonial updated successfully')
      } else {
        setTestimonials(prev => [...prev, data.testimonial])
        showToast('success', 'Testimonial created successfully')
      }
      setEditTestimonial(null)
    } catch {
      showToast('error', 'Failed to save testimonial')
    } finally {
      setSaving(false)
    }
  }

  // TESTIMONIALS: Delete
  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial/review?')) return
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setTestimonials(prev => prev.filter(t => t.id !== id))
      showToast('success', 'Testimonial deleted successfully')
    } catch {
      showToast('error', 'Failed to delete testimonial')
    }
  }

  // PRODUCTS: Delete
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setProducts(prev => prev.filter(p => p.id !== id))
      showToast('success', 'Product deleted successfully')
    } catch {
      showToast('error', 'Failed to delete product')
    }
  }

  // CATEGORIES: Save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCategory) return
    setSaving(true)
    try {
      const isEdit = !!editCategory.id
      const res = await fetch('/api/admin/categories', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCategory),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      
      if (isEdit) {
        setCategories(prev => prev.map(c => c.id === editCategory.id ? { ...c, ...editCategory } as CategoryData : c))
        showToast('success', 'Category updated successfully')
      } else {
        setCategories(prev => [...prev, data.category])
        showToast('success', 'Category created successfully')
      }
      setEditCategory(null)
    } catch {
      showToast('error', 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  // CATEGORIES: Delete
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category? Ensure no products are using it.')) return
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      setCategories(prev => prev.filter(c => c.id !== id))
      showToast('success', 'Category deleted successfully')
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete category')
    }
  }

  // MAP NODES: Save
  const handleSaveNode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editNode) return
    setSaving(true)
    try {
      const isEdit = !!editNode.id
      const res = await fetch('/api/admin/logistics', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editNode),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      
      if (isEdit) {
        setNodes(prev => prev.map(n => n.id === editNode.id ? { ...n, ...editNode } as LogisticsNodeData : n).sort((a,b)=>a.order - b.order))
        showToast('success', 'Logistics node updated successfully')
      } else {
        setNodes(prev => [...prev, data.node].sort((a,b)=>a.order - b.order))
        showToast('success', 'Logistics node created successfully')
      }
      setEditNode(null)
    } catch {
      showToast('error', 'Failed to save logistics node')
    } finally {
      setSaving(false)
    }
  }

  // MAP NODES: Delete
  const handleDeleteNode = async (id: number) => {
    if (!confirm('Are you sure you want to delete this logistics node?')) return
    try {
      const res = await fetch(`/api/admin/logistics?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setNodes(prev => prev.filter(n => n.id !== id))
      showToast('success', 'Logistics node deleted successfully')
    } catch {
      showToast('error', 'Failed to delete logistics node')
    }
  }

  // MAP NODES: Reorder UP / DOWN
  const handleMoveNode = async (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= nodes.length) return

    const newNodes = [...nodes]
    const temp = newNodes[index]
    newNodes[index] = newNodes[nextIndex]
    newNodes[nextIndex] = temp

    setNodes(newNodes)

    try {
      await fetch('/api/admin/logistics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          orderedIds: newNodes.map((n) => n.id),
        }),
      })
    } catch {
      showToast('error', 'Failed to save order sequence')
    }
  }

  // FEATURED PRODUCTS: Reorder UP / DOWN
  const handleMoveFeaturedProduct = async (index: number, direction: 'up' | 'down') => {
    const featuredProds = products.filter(p => p.isFeatured).sort((a,b) => a.featuredOrder - b.featuredOrder)
    const nextIndex = direction === 'up' ? index - 1 : index + 1
    if (nextIndex < 0 || nextIndex >= featuredProds.length) return

    const reorderedFeatured = [...featuredProds]
    const temp = reorderedFeatured[index]
    reorderedFeatured[index] = reorderedFeatured[nextIndex]
    reorderedFeatured[nextIndex] = temp

    // Reassemble products list with updated featuredOrder values
    const updatedProducts = products.map(p => {
      const featuredIdx = reorderedFeatured.findIndex(rf => rf.id === p.id)
      if (featuredIdx !== -1) {
        return { ...p, isFeatured: true, featuredOrder: featuredIdx }
      }
      return p
    })

    setProducts(updatedProducts)

    try {
      await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder-featured',
          orderedIds: reorderedFeatured.map(p => p.id),
        }),
      })
      showToast('success', 'Featured products order updated')
    } catch {
      showToast('error', 'Failed to save featured order sequence')
    }
  }

  // FEATURED PRODUCTS: Toggle status
  const handleToggleFeaturedProduct = async (id: number, currentVal: boolean) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isFeatured: !currentVal }),
      })
      if (!res.ok) throw new Error()
      
      setProducts(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !currentVal } : p))
      showToast('success', `Product ${!currentVal ? 'added to' : 'removed from'} featured list`)
    } catch {
      showToast('error', 'Failed to update featured status')
    }
  }

  // Dynamic Sidebar tab groups config
  const tabGroups = [
    {
      groupName: 'Core Desk',
      items: [
        { id: 'overview', name: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', name: 'My Profile', icon: User },
      ]
    },
    {
      groupName: 'Homepage CMS',
      items: [
        { id: 'homepage-overview', name: 'Overview Checklist', icon: FileText },
        { id: 'slides', name: 'Hero / Slides', icon: Sliders },
        { id: 'story-settings', name: 'Company Story', icon: BookOpen },
        { id: 'featured-products-settings', name: 'Featured Products', icon: Star },
        { id: 'about-section-settings', name: 'About Our Company', icon: Building2 },
        { id: 'logistics-settings', name: 'Global Logistics', icon: Globe },
        { id: 'global-reviews-settings', name: 'Global Reviews', icon: MessageSquare },
        { id: 'contact-settings', name: 'Contact Section', icon: Phone },
        { id: 'general-homepage-settings', name: 'General Settings', icon: ToggleLeft },
      ]
    },
    {
      groupName: 'Portfolio Hub',
      items: [
        { id: 'products', name: 'Products Manager', icon: ShoppingBag },
        { id: 'categories-settings', name: 'Product Categories', icon: FolderOpen },
      ]
    },
    {
      groupName: 'Corporate',
      items: [
        { id: 'partners', name: 'Partners/Leadership', icon: Users },
        { id: 'testimonials', name: 'Testimonials/Reviews', icon: MessageSquare },
        { id: 'inquiries', name: 'Inquiries & Leads', icon: Mail },
        { id: 'gallery', name: 'Gallery Manager', icon: ImageIcon },
      ]
    },
    {
      groupName: 'Global Config',
      items: [
        { id: 'settings', name: 'Website Settings', icon: Settings },
        { id: 'theme', name: 'Theme Settings', icon: Palette },
        { id: 'footer-settings', name: 'Footer Settings', icon: Compass },
        { id: 'footer-links-settings', name: 'Footer Navigation Links', icon: FileText },
        { id: 'about-us-page-settings', name: 'About Page Sections', icon: Building2 },
        { id: 'inquiry-form-settings', name: 'Inquiry Form Builder', icon: LayoutDashboard },
        { id: 'users', name: 'Users & Permissions', icon: ShieldCheck },
      ]
    }
  ]

  const unreadInquiriesCount = inquiries.filter(i => {
    const status = i.status || (i.isRead ? 'Read' : 'New')
    return status === 'New'
  }).length

  return (
    <div className="min-h-screen bg-bg-secondary text-text-primary font-sans flex flex-col md:flex-row">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#032318] text-white flex flex-col justify-between shrink-0 p-6 md:min-h-screen border-r border-emerald-950">
        <div>
          {/* Circular logo badge and name */}
          <div className="flex items-center gap-3 border-b border-emerald-900/60 pb-6 mb-8">
            <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0">
              <Image
                src="/images/logo-circular.jpg"
                alt="SAT SAHEB TRADING"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-mega font-bold text-secondary">
                SAT SAHEB
              </h2>
              <span className="text-[9px] uppercase tracking-wider text-emerald-100/50">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-5 overflow-y-auto max-h-[70vh] pr-1">
            {tabGroups.map((group) => (
              <div key={group.groupName} className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-100/40 px-4 mb-1">
                  {group.groupName}
                </span>
                {group.items.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any)
                        setEditProduct(null)
                        setEditSlide(null)
                        setEditPartner(null)
                        setEditTestimonial(null)
                        setEditNode(null)
                        setEditCategory(null)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold rounded-none text-left transition-colors duration-200 ${
                        isActive
                          ? 'bg-secondary text-[#032318]'
                          : 'text-emerald-100/70 hover:bg-emerald-900/40 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-3.5 w-3.5" />
                        {tab.name}
                      </span>
                      {tab.id === 'inquiries' && unreadInquiriesCount > 0 && (
                        <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 font-bold rounded-full">
                          {unreadInquiriesCount}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="border-t border-emerald-900/60 pt-6 mt-8 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-emerald-100/45 uppercase tracking-wider">Logged in as</span>
            <span className="text-xs font-semibold text-secondary">{username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 border border-emerald-900 hover:border-red-500 hover:bg-red-950/40 text-emerald-100/60 hover:text-red-200 transition-colors"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT DESK */}
      <main className="flex-1 p-6 md:p-10 relative overflow-y-auto max-h-screen">
        
        {/* Floating Toast Notification */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[200] px-5 py-4 shadow-xl text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-2.5 border ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <CheckCircle className="h-4.5 w-4.5" />
            {toast.msg}
          </div>
        )}

        {/* Tab Header title */}
        <div className="border-b border-accent pb-6 mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-serif text-text-primary capitalize tracking-wide">
            {activeTab.replace('-', ' ')} Control
          </h1>
          <span className="text-[10px] font-sans text-text-muted font-medium uppercase tracking-wider">
            SAT SAHEB TRADING CO. &bull; Registered Panel
          </span>
        </div>

        {/* TAB CONTENTS */}
        
        {/* T1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-white border border-accent p-6 shadow-premium flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Total Inquiries</span>
                <span className="text-3xl font-serif text-primary font-bold mt-2">{inquiries.length}</span>
              </div>
              {/* Card 2 */}
              <div className="bg-white border border-accent p-6 shadow-premium flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Unread Messages</span>
                <span className="text-3xl font-serif text-red-600 font-bold mt-2">{unreadInquiriesCount}</span>
              </div>
              {/* Card 3 */}
              <div className="bg-white border border-accent p-6 shadow-premium flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Total Products</span>
                <span className="text-3xl font-serif text-primary font-bold mt-2">{products.length}</span>
              </div>
              {/* Card 4 */}
              <div className="bg-white border border-accent p-6 shadow-premium flex flex-col justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Hero Slides</span>
                <span className="text-3xl font-serif text-primary font-bold mt-2">{slides.length}</span>
              </div>
            </div>

            {/* Recent inquiries table log */}
            <div className="bg-white border border-accent p-6 shadow-premium">
              <h3 className="text-lg font-serif text-text-primary font-bold mb-4 border-b border-accent pb-2">
                Recent Direct Inquiries
              </h3>
              {inquiries.length === 0 ? (
                <div className="text-center py-8 text-xs text-text-muted">No inquiries received yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-accent text-text-muted uppercase text-[10px] tracking-wider font-bold">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email / Phone</th>
                        <th className="pb-3">Product Interest</th>
                        <th className="pb-3">Submitted</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.slice(0, 5).map((inq) => (
                        <tr key={inq.id} className="border-b border-accent/40 last:border-b-0 hover:bg-bg-secondary/40">
                          <td className="py-3 font-semibold text-text-primary">{inq.name}</td>
                          <td className="py-3 text-text-secondary">
                            <div>{inq.email}</div>
                            <div className="text-[10px] mt-0.5 text-text-muted">{inq.phone}</div>
                          </td>
                          <td className="py-3 font-medium text-primary">{inq.productInterest || 'N/A'}</td>
                          <td className="py-3 text-text-muted" suppressHydrationWarning>
                            {formatDate(inq.createdAt)}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${
                              inq.isRead ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                            }`}>
                              {inq.isRead ? 'read' : 'unread'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* T1.5: HOMEPAGE OVERVIEW */}
        {activeTab === 'homepage-overview' && (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white border border-accent p-6 shadow-premium">
              <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-4 mb-6">Homepage Sections Status Checklist</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-accent/40 bg-bg-secondary/20">
                  <div>
                    <h4 className="font-serif font-semibold text-sm">1. Hero Slider Carousel</h4>
                    <p className="text-xs text-text-secondary mt-1">Status: Active with {slides.length} slides loaded.</p>
                  </div>
                  <button onClick={() => setActiveTab('slides')} className="text-xs font-semibold text-primary hover:underline uppercase">Manage Slides &rarr;</button>
                </div>

                <div className="flex items-center justify-between p-4 border border-accent/40 bg-bg-secondary/20">
                  <div>
                    <h4 className="font-serif font-semibold text-sm">2. Company Story & Pillars</h4>
                    <p className="text-xs text-text-secondary mt-1">Status: {settings.storyEnabled ? 'Published' : 'Hidden'} (Title: "{settings.storyTitle}")</p>
                  </div>
                  <button onClick={() => setActiveTab('story-settings')} className="text-xs font-semibold text-primary hover:underline uppercase">Configure Story &rarr;</button>
                </div>

                <div className="flex items-center justify-between p-4 border border-accent/40 bg-bg-secondary/20">
                  <div>
                    <h4 className="font-serif font-semibold text-sm">3. Featured Products Showcase</h4>
                    <p className="text-xs text-text-secondary mt-1">Status: {settings.featuredProductsEnabled ? 'Published' : 'Hidden'} ({products.filter(p => p.isFeatured).length} products featured)</p>
                  </div>
                  <button onClick={() => setActiveTab('featured-products-settings')} className="text-xs font-semibold text-primary hover:underline uppercase">Featured List &rarr;</button>
                </div>

                <div className="flex items-center justify-between p-4 border border-accent/40 bg-bg-secondary/20">
                  <div>
                    <h4 className="font-serif font-semibold text-sm">4. About Our Company Summary</h4>
                    <p className="text-xs text-text-secondary mt-1">Status: {settings.aboutSectionEnabled ? 'Published' : 'Hidden'} (Image: {settings.aboutSectionImage})</p>
                  </div>
                  <button onClick={() => setActiveTab('about-section-settings')} className="text-xs font-semibold text-primary hover:underline uppercase">Edit Summary &rarr;</button>
                </div>

                <div className="flex items-center justify-between p-4 border border-accent/40 bg-bg-secondary/20">
                  <div>
                    <h4 className="font-serif font-semibold text-sm">5. Global Logistics Interactive Map</h4>
                    <p className="text-xs text-text-secondary mt-1">Status: {settings.logisticsEnabled ? 'Published' : 'Hidden'} ({nodes.length} mapped trade nodes)</p>
                  </div>
                  <button onClick={() => setActiveTab('logistics-settings')} className="text-xs font-semibold text-primary hover:underline uppercase">Edit Map Points &rarr;</button>
                </div>

                <div className="flex items-center justify-between p-4 border border-accent/40 bg-bg-secondary/20">
                  <div>
                    <h4 className="font-serif font-semibold text-sm">6. Global Reviews / Testimonials</h4>
                    <p className="text-xs text-text-secondary mt-1">Status: {settings.reviewsEnabled ? 'Published' : 'Hidden'} ({testimonials.length} reviews loaded)</p>
                  </div>
                  <button onClick={() => setActiveTab('global-reviews-settings')} className="text-xs font-semibold text-primary hover:underline uppercase">Manage Reviews &rarr;</button>
                </div>

                <div className="flex items-center justify-between p-4 border border-accent/40 bg-bg-secondary/20">
                  <div>
                    <h4 className="font-serif font-semibold text-sm">7. Contact Section & Map</h4>
                    <p className="text-xs text-text-secondary mt-1">Status: {settings.contactSectionEnabled ? 'Published' : 'Hidden'}</p>
                  </div>
                  <button onClick={() => setActiveTab('contact-settings')} className="text-xs font-semibold text-primary hover:underline uppercase">Edit Info &rarr;</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* T1.6: COMPANY STORY SETTINGS */}
        {activeTab === 'story-settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl">
            <div className="flex justify-between items-center border-b border-accent pb-2">
              <h3 className="text-xl font-serif font-bold text-text-primary">Company Story Settings</h3>
              <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                <input
                  type="checkbox"
                  checked={settings.storyEnabled}
                  onChange={(e) => setSettings({ ...settings, storyEnabled: e.target.checked })}
                  className="h-4 w-4 text-primary"
                />
                Publish Story Section
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Label / Tag</label>
                <input
                  type="text"
                  required
                  value={settings.storyLabel || ''}
                  onChange={(e) => setSettings({ ...settings, storyLabel: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Title Heading</label>
                <input
                  type="text"
                  required
                  value={settings.storyTitle || ''}
                  onChange={(e) => setSettings({ ...settings, storyTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Story Paragraph Description</label>
              <textarea
                rows={3}
                required
                value={settings.storyDescription || ''}
                onChange={(e) => setSettings({ ...settings, storyDescription: e.target.value })}
                className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-accent/40">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={settings.storyBtnText || ''}
                  onChange={(e) => setSettings({ ...settings, storyBtnText: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">CTA Button URL Link</label>
                <input
                  type="text"
                  value={settings.storyBtnLink || ''}
                  onChange={(e) => setSettings({ ...settings, storyBtnLink: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.storyBtnVisible}
                    onChange={(e) => setSettings({ ...settings, storyBtnVisible: e.target.checked })}
                    className="h-4 w-4 text-primary"
                  />
                  Show CTA Button
                </label>
              </div>
            </div>

            <div className="border-t border-accent pt-6 space-y-6">
              <h4 className="font-serif font-bold text-lg text-text-primary border-b border-accent/40 pb-2">Story Pillars Grid</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-accent p-4 bg-bg-secondary/20">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-secondary">Pillar 1 (Top Left)</span>
                  <input
                    type="text"
                    required
                    value={settings.storyPillar1Title || ''}
                    onChange={(e) => setSettings({ ...settings, storyPillar1Title: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary mt-2 font-semibold"
                  />
                  <textarea
                    rows={2}
                    required
                    value={settings.storyPillar1Desc || ''}
                    onChange={(e) => setSettings({ ...settings, storyPillar1Desc: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary mt-2 resize-none"
                  />
                </div>

                <div className="border border-accent p-4 bg-bg-secondary/20">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-secondary">Pillar 2 (Top Right)</span>
                  <input
                    type="text"
                    required
                    value={settings.storyPillar2Title || ''}
                    onChange={(e) => setSettings({ ...settings, storyPillar2Title: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary mt-2 font-semibold"
                  />
                  <textarea
                    rows={2}
                    required
                    value={settings.storyPillar2Desc || ''}
                    onChange={(e) => setSettings({ ...settings, storyPillar2Desc: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary mt-2 resize-none"
                  />
                </div>

                <div className="border border-accent p-4 bg-bg-secondary/20">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-secondary">Pillar 3 (Bottom Left)</span>
                  <input
                    type="text"
                    required
                    value={settings.storyPillar3Title || ''}
                    onChange={(e) => setSettings({ ...settings, storyPillar3Title: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary mt-2 font-semibold"
                  />
                  <textarea
                    rows={2}
                    required
                    value={settings.storyPillar3Desc || ''}
                    onChange={(e) => setSettings({ ...settings, storyPillar3Desc: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary mt-2 resize-none"
                  />
                </div>

                <div className="border border-accent p-4 bg-bg-secondary/20">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-secondary">Pillar 4 (Bottom Right)</span>
                  <input
                    type="text"
                    required
                    value={settings.storyPillar4Title || ''}
                    onChange={(e) => setSettings({ ...settings, storyPillar4Title: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary mt-2 font-semibold"
                  />
                  <textarea
                    rows={2}
                    required
                    value={settings.storyPillar4Desc || ''}
                    onChange={(e) => setSettings({ ...settings, storyPillar4Desc: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary mt-2 resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}

        {/* T1.7: FEATURED PRODUCTS CMS */}
        {activeTab === 'featured-products-settings' && (
          <div className="space-y-6 max-w-4xl">
            <form onSubmit={handleSaveSettings} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6">
              <div className="flex justify-between items-center border-b border-accent pb-2">
                <h3 className="text-xl font-serif font-bold text-text-primary">Featured Products Section Settings</h3>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.featuredProductsEnabled}
                    onChange={(e) => setSettings({ ...settings, featuredProductsEnabled: e.target.checked })}
                    className="h-4 w-4 text-primary"
                  />
                  Publish Section
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Label</label>
                  <input
                    type="text"
                    required
                    value={settings.featuredProductsLabel || ''}
                    onChange={(e) => setSettings({ ...settings, featuredProductsLabel: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Heading</label>
                  <input
                    type="text"
                    required
                    value={settings.featuredProductsTitle || ''}
                    onChange={(e) => setSettings({ ...settings, featuredProductsTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Subtitle / Description</label>
                <textarea
                  rows={2}
                  required
                  value={settings.featuredProductsSubtitle || ''}
                  onChange={(e) => setSettings({ ...settings, featuredProductsSubtitle: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                {saving ? 'Saving...' : 'Save Section Details'}
              </button>
            </form>

            <div className="bg-white border border-accent p-6 shadow-premium space-y-6">
              <h4 className="font-serif font-bold text-lg text-text-primary border-b border-accent pb-2">Select and Order Featured Products</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-accent text-text-muted uppercase text-[10px] tracking-wider font-bold">
                      <th className="pb-3 w-16">Featured?</th>
                      <th className="pb-3">Image</th>
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3 w-28">Featured Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .sort((a, b) => {
                        if (a.isFeatured && b.isFeatured) return a.featuredOrder - b.featuredOrder
                        if (a.isFeatured) return -1
                        if (b.isFeatured) return 1
                        return a.order - b.order
                      })
                      .map((prod, idx, arr) => {
                        const featuredList = arr.filter(p => p.isFeatured)
                        const featuredIdx = featuredList.findIndex(p => p.id === prod.id)
                        return (
                          <tr key={prod.id} className="border-b border-accent/40 last:border-b-0 hover:bg-bg-secondary/40">
                            <td className="py-3">
                              <input
                                type="checkbox"
                                checked={prod.isFeatured}
                                onChange={() => handleToggleFeaturedProduct(prod.id, prod.isFeatured)}
                                className="h-4.5 w-4.5 text-primary cursor-pointer animate-none"
                              />
                            </td>
                            <td className="py-3">
                              <div className="relative h-10 w-10 bg-bg-secondary border border-accent overflow-hidden flex items-center justify-center p-1">
                                <Image src={prod.featuredImage} alt={prod.title} fill className="object-contain" />
                              </div>
                            </td>
                            <td className="py-3 font-semibold text-text-primary">
                              {prod.title}
                              {!prod.isEnabled && <span className="text-[9px] uppercase bg-red-100 text-red-700 px-2 py-0.5 ml-2 font-bold">Disabled</span>}
                            </td>
                            <td className="py-3">
                              {prod.isFeatured ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleMoveFeaturedProduct(featuredIdx, 'up')}
                                    disabled={featuredIdx === 0}
                                    className="p-1 border border-accent hover:border-primary disabled:opacity-20"
                                  >
                                    <ChevronUp className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleMoveFeaturedProduct(featuredIdx, 'down')}
                                    disabled={featuredIdx === featuredList.length - 1}
                                    className="p-1 border border-accent hover:border-primary disabled:opacity-20"
                                  >
                                    <ChevronDown className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-text-muted">Not featured</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* T1.8: ABOUT OUR COMPANY CMS */}
        {activeTab === 'about-section-settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl">
            <div className="flex justify-between items-center border-b border-accent pb-2">
              <h3 className="text-xl font-serif font-bold text-text-primary">About Our Company Section Settings</h3>
              <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                <input
                  type="checkbox"
                  checked={settings.aboutSectionEnabled}
                  onChange={(e) => setSettings({ ...settings, aboutSectionEnabled: e.target.checked })}
                  className="h-4 w-4 text-primary"
                />
                Publish Section
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Label</label>
                <input
                  type="text"
                  required
                  value={settings.aboutSectionLabel || ''}
                  onChange={(e) => setSettings({ ...settings, aboutSectionLabel: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Heading Title</label>
                <input
                  type="text"
                  required
                  value={settings.aboutSectionTitle || ''}
                  onChange={(e) => setSettings({ ...settings, aboutSectionTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Image Path (Media link or trade lane map)</label>
              <input
                type="text"
                required
                value={settings.aboutSectionImage || ''}
                onChange={(e) => setSettings({ ...settings, aboutSectionImage: e.target.value })}
                className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Corporate Profile Summary Paragraph</label>
              <textarea
                rows={5}
                required
                value={settings.aboutSectionDescription || ''}
                onChange={(e) => setSettings({ ...settings, aboutSectionDescription: e.target.value })}
                className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-accent/40">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Button Label</label>
                <input
                  type="text"
                  value={settings.aboutSectionBtnText || ''}
                  onChange={(e) => setSettings({ ...settings, aboutSectionBtnText: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Button Action URL Link</label>
                <input
                  type="text"
                  value={settings.aboutSectionBtnLink || ''}
                  onChange={(e) => setSettings({ ...settings, aboutSectionBtnLink: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.aboutSectionBtnVisible}
                    onChange={(e) => setSettings({ ...settings, aboutSectionBtnVisible: e.target.checked })}
                    className="h-4 w-4 text-primary"
                  />
                  Show CTA Button
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              {saving ? 'Saving...' : 'Save Section Details'}
            </button>
          </form>
        )}

        {/* T1.9: GLOBAL LOGISTICS CMS */}
        {activeTab === 'logistics-settings' && (
          <div className="space-y-6 max-w-4xl">
            <form onSubmit={handleSaveSettings} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6">
              <div className="flex justify-between items-center border-b border-accent pb-2">
                <h3 className="text-xl font-serif font-bold text-text-primary">Global Logistics Section Settings</h3>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.logisticsEnabled}
                    onChange={(e) => setSettings({ ...settings, logisticsEnabled: e.target.checked })}
                    className="h-4 w-4 text-primary"
                  />
                  Publish Section
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Label</label>
                  <input
                    type="text"
                    required
                    value={settings.logisticsLabel || ''}
                    onChange={(e) => setSettings({ ...settings, logisticsLabel: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Heading Title</label>
                  <input
                    type="text"
                    required
                    value={settings.logisticsTitle || ''}
                    onChange={(e) => setSettings({ ...settings, logisticsTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-accent/40">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Map Origin Hub Port Title</label>
                  <input
                    type="text"
                    required
                    value={settings.logisticsOriginTitle || ''}
                    onChange={(e) => setSettings({ ...settings, logisticsOriginTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Hub Port details description</label>
                  <textarea
                    rows={2}
                    required
                    value={settings.logisticsOriginDesc || ''}
                    onChange={(e) => setSettings({ ...settings, logisticsOriginDesc: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                {saving ? 'Saving...' : 'Save Logistics Header'}
              </button>
            </form>

            <div className="bg-white border border-accent p-6 shadow-premium space-y-6">
              <div className="flex justify-between items-center border-b border-accent pb-2">
                <h4 className="font-serif font-bold text-lg text-text-primary">Interactive Map Nodes</h4>
                <button
                  onClick={() => setEditNode({ name: '', xCoord: 50, yCoord: 50, info: '', type: 'destination', isEnabled: true })}
                  className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white font-sans text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="h-3 w-3" />
                  Add Mapped Location
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-accent text-text-muted uppercase text-[10px] tracking-wider font-bold">
                      <th className="pb-3">Location Label</th>
                      <th className="pb-3 w-20">Type</th>
                      <th className="pb-3 w-32">SVG Coordinates (X%, Y%)</th>
                      <th className="pb-3 w-20">Status</th>
                      <th className="pb-3 w-24">Order</th>
                      <th className="pb-3 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node, idx) => (
                      <tr key={node.id} className="border-b border-accent/40 last:border-b-0 hover:bg-bg-secondary/40">
                        <td className="py-3 font-semibold text-text-primary">
                          {node.name}
                          <div className="text-[10px] text-text-secondary mt-0.5 leading-relaxed font-normal">{node.info}</div>
                        </td>
                        <td className="py-3 uppercase font-mono text-[10px] font-bold text-secondary">{node.type}</td>
                        <td className="py-3 font-mono text-[11px] text-text-muted">{node.xCoord}%, {node.yCoord}%</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full ${node.isEnabled ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
                            {node.isEnabled ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveNode(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 border border-accent hover:border-primary disabled:opacity-20"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveNode(idx, 'down')}
                              disabled={idx === nodes.length - 1}
                              className="p-1 border border-accent hover:border-primary disabled:opacity-20"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditNode(node)}
                              className="p-2 border border-accent hover:border-primary text-text-primary"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNode(node.id)}
                              className="p-2 border border-accent hover:border-red-500 text-text-primary hover:text-red-500"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit/Create Map Node Form Overlay */}
            {editNode && (
              <form
                onSubmit={handleSaveNode}
                className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 border-t-4 border-t-primary"
              >
                <h4 className="font-serif font-bold text-lg text-text-primary border-b border-accent pb-2">
                  {editNode.id ? 'Modify Mapped Location Node' : 'Register New Mapped Node'}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Location Name</label>
                    <input
                      type="text"
                      required
                      value={editNode.name || ''}
                      onChange={(e) => setEditNode({ ...editNode, name: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-sm text-text-primary rounded-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Node Type</label>
                    <select
                      value={editNode.type || 'destination'}
                      onChange={(e) => setEditNode({ ...editNode, type: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-sm text-text-primary rounded-none"
                    >
                      <option value="hub">Origin Hub (Pulses pulsating Anchored center)</option>
                      <option value="destination">Destination Route (Receiving terminal)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                      <input
                        type="checkbox"
                        checked={editNode.isEnabled !== false}
                        onChange={(e) => setEditNode({ ...editNode, isEnabled: e.target.checked })}
                        className="h-4 w-4 text-primary"
                      />
                      Enable Node
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">SVG Map X% (Horizontal 0-100% position on layout canvas)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={editNode.xCoord || 0}
                      onChange={(e) => setEditNode({ ...editNode, xCoord: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-sm text-text-primary rounded-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">SVG Map Y% (Vertical 0-100% position on layout canvas)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={editNode.yCoord || 0}
                      onChange={(e) => setEditNode({ ...editNode, yCoord: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-sm text-text-primary rounded-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Node Info Description text (Appears in details popup drawer)</label>
                  <textarea
                    rows={2}
                    required
                    value={editNode.info || ''}
                    onChange={(e) => setEditNode({ ...editNode, info: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-sm text-text-primary rounded-none resize-none"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3.5 bg-primary text-white font-sans text-xs font-bold uppercase tracking-wider hover:bg-primary-light"
                  >
                    {saving ? 'Saving...' : 'Save Location Point'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditNode(null)}
                    className="px-6 py-3.5 border border-accent font-sans text-xs text-text-primary font-bold uppercase tracking-wider hover:bg-bg-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* T2.0: GLOBAL REVIEWS CMS */}
        {activeTab === 'global-reviews-settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl">
            <div className="flex justify-between items-center border-b border-accent pb-2">
              <h3 className="text-xl font-serif font-bold text-text-primary">Global Reviews / Testimonials Section Settings</h3>
              <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                <input
                  type="checkbox"
                  checked={settings.reviewsEnabled}
                  onChange={(e) => setSettings({ ...settings, reviewsEnabled: e.target.checked })}
                  className="h-4 w-4 text-primary"
                />
                Publish Reviews Section
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Label</label>
                <input
                  type="text"
                  required
                  value={settings.reviewsLabel || ''}
                  onChange={(e) => setSettings({ ...settings, reviewsLabel: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Heading Title</label>
                <input
                  type="text"
                  required
                  value={settings.reviewsTitle || ''}
                  onChange={(e) => setSettings({ ...settings, reviewsTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Section Subtitle Paragraph</label>
              <textarea
                rows={2}
                required
                value={settings.reviewsSubtitle || ''}
                onChange={(e) => setSettings({ ...settings, reviewsSubtitle: e.target.value })}
                className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t border-accent/40">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('testimonials')}
                className="px-8 py-3.5 border border-primary text-primary hover:bg-bg-secondary font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
              >
                Manage Testimonials List &rarr;
              </button>
            </div>
          </form>
        )}

        {/* T2.1: CONTACT SECTION CMS */}
        {activeTab === 'contact-settings' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setSaving(true)
              try {
                const updated = {
                  ...settings,
                  contactPhones: JSON.stringify(contactPhones),
                  contactEmails: JSON.stringify(contactEmails),
                }
                const res = await fetch('/api/admin/settings', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updated),
                })
                if (!res.ok) throw new Error()
                setSettings(updated)
                showToast('success', 'Contact information and page settings saved')
                router.refresh()
              } catch {
                showToast('error', 'Failed to save contact settings')
              } finally {
                setSaving(false)
              }
            }}
            className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl"
          >
            <div className="flex justify-between items-center border-b border-accent pb-2">
              <h3 className="text-xl font-serif font-bold text-text-primary">Contact Page & Desk Settings</h3>
              <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                <input
                  type="checkbox"
                  checked={settings.contactSectionEnabled}
                  onChange={(e) => setSettings({ ...settings, contactSectionEnabled: e.target.checked })}
                  className="h-4 w-4 text-primary"
                />
                Publish Contact Section
              </label>
            </div>

            {/* Sub-section 1: Contact Page Hero Banner Details */}
            <div className="border border-accent/60 p-4 space-y-4 bg-bg-secondary/40">
              <h4 className="font-serif font-bold text-sm text-text-primary border-b border-accent/40 pb-1">Contact Page Hero Banner</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Hero Label / Eyebrow</label>
                  <input
                    type="text"
                    value={settings.contactPageLabel || ''}
                    onChange={(e) => setSettings({ ...settings, contactPageLabel: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Hero Heading Title</label>
                  <input
                    type="text"
                    value={settings.contactPageTitle || ''}
                    onChange={(e) => setSettings({ ...settings, contactPageTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Hero Description Paragraph</label>
                <textarea
                  rows={2}
                  value={settings.contactPageDescription || ''}
                  onChange={(e) => setSettings({ ...settings, contactPageDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary"
                />
              </div>
            </div>

            {/* Sub-section 2: Get In Touch section on homepage */}
            <div className="border border-accent/60 p-4 space-y-4">
              <h4 className="font-serif font-bold text-sm text-text-primary border-b border-accent/40 pb-1">Homepage Contact Area Heading</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Section Label</label>
                  <input
                    type="text"
                    value={settings.contactSectionLabel || ''}
                    onChange={(e) => setSettings({ ...settings, contactSectionLabel: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Section Title</label>
                  <input
                    type="text"
                    value={settings.contactSectionTitle || ''}
                    onChange={(e) => setSettings({ ...settings, contactSectionTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Section Description</label>
                <textarea
                  rows={2}
                  value={settings.contactSectionDescription || ''}
                  onChange={(e) => setSettings({ ...settings, contactSectionDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                />
              </div>
            </div>

            {/* Sub-section 3: Corporate location details */}
            <div className="border border-accent/60 p-4 space-y-4 bg-bg-secondary/40">
              <h4 className="font-serif font-bold text-sm text-text-primary border-b border-accent/40 pb-1">Registered Office Location & Google Maps</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Office Section Title Heading</label>
                  <input
                    type="text"
                    value={settings.contactOfficeTitle || ''}
                    onChange={(e) => setSettings({ ...settings, contactOfficeTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Registered address text</label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">
                  Google Map Embed Code (Accepts Direct URL OR Full `&lt;iframe&gt;` HTML Embed block)
                </label>
                <textarea
                  rows={3}
                  value={settings.googleMapUrl || ''}
                  onChange={(e) => setSettings({ ...settings, googleMapUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary font-mono"
                  placeholder="Paste direct link or <iframe src='...'></iframe>"
                />
              </div>
            </div>

            {/* Sub-section 4: Phones list builder */}
            <div className="border border-accent/60 p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-accent/40 pb-1">
                <h4 className="font-serif font-bold text-sm text-text-primary">Corporate Desk Hotlines</h4>
                <button
                  type="button"
                  onClick={() => setContactPhones(prev => [...prev, ''])}
                  className="text-xs uppercase font-bold tracking-wider text-primary hover:underline"
                >
                  + Add Hotline
                </button>
              </div>
              {contactPhones.length === 0 ? (
                <p className="text-[10px] text-text-muted">No hotlines configured. Click Add Hotline to register one.</p>
              ) : (
                <div className="space-y-2">
                  {contactPhones.map((p, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        required
                        value={p}
                        onChange={(e) => {
                          const updated = [...contactPhones]
                          updated[idx] = e.target.value
                          setContactPhones(updated)
                        }}
                        className="flex-1 px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                        placeholder="e.g. +91 90996 67113"
                      />
                      <button
                        type="button"
                        onClick={() => setContactPhones(prev => prev.filter((_, i) => i !== idx))}
                        className="p-2 border border-accent hover:border-red-500 text-text-secondary hover:text-red-500 transition-colors"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sub-section 5: Emails list builder */}
            <div className="border border-accent/60 p-4 space-y-4">
              <div className="flex justify-between items-center border-b border-accent/40 pb-1">
                <h4 className="font-serif font-bold text-sm text-text-primary">Email Trade Desks</h4>
                <button
                  type="button"
                  onClick={() => setContactEmails(prev => [...prev, ''])}
                  className="text-xs uppercase font-bold tracking-wider text-primary hover:underline"
                >
                  + Add Email Desk
                </button>
              </div>
              {contactEmails.length === 0 ? (
                <p className="text-[10px] text-text-muted">No emails configured. Click Add Email Desk to register one.</p>
              ) : (
                <div className="space-y-2">
                  {contactEmails.map((eStr, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="email"
                        required
                        value={eStr}
                        onChange={(e) => {
                          const updated = [...contactEmails]
                          updated[idx] = e.target.value
                          setContactEmails(updated)
                        }}
                        className="flex-1 px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                        placeholder="e.g. trade@satsahebtrading.com"
                      />
                      <button
                        type="button"
                        onClick={() => setContactEmails(prev => prev.filter((_, i) => i !== idx))}
                        className="p-2 border border-accent hover:border-red-500 text-text-secondary hover:text-red-500 transition-colors"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sub-section 6: Form labels customization */}
            <div className="border border-accent/60 p-4 space-y-4 bg-bg-secondary/40">
              <h4 className="font-serif font-bold text-sm text-text-primary border-b border-accent/40 pb-1">Inquiry Form Submissions Content</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Form Card Title</label>
                  <input
                    type="text"
                    value={settings.contactFormTitle || ''}
                    onChange={(e) => setSettings({ ...settings, contactFormTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Form Card Subtitle</label>
                  <input
                    type="text"
                    value={settings.contactFormSubtitle || ''}
                    onChange={(e) => setSettings({ ...settings, contactFormSubtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Success Alert Text</label>
                  <input
                    type="text"
                    value={settings.contactSuccessMsg || ''}
                    onChange={(e) => setSettings({ ...settings, contactSuccessMsg: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Error Alert Text</label>
                  <input
                    type="text"
                    value={settings.contactErrorMsg || ''}
                    onChange={(e) => setSettings({ ...settings, contactErrorMsg: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Submit Button Text</label>
                  <input
                    type="text"
                    value={settings.contactBtnText || ''}
                    onChange={(e) => setSettings({ ...settings, contactBtnText: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 w-full"
            >
              {saving ? 'Saving...' : 'Save Contact Details & Content'}
            </button>
          </form>
        )}

        {/* T2.2: HOMEPAGE GENERAL SETTINGS */}
        {activeTab === 'general-homepage-settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl">
            <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">Global Homepage Toggles</h3>
            <div className="space-y-4 pt-2">
              <label className="flex items-center gap-3 cursor-pointer font-sans text-sm uppercase tracking-wider font-semibold">
                <input
                  type="checkbox"
                  checked={settings.preloaderEnabled}
                  onChange={(e) => setSettings({ ...settings, preloaderEnabled: e.target.checked })}
                  className="h-4.5 w-4.5 text-primary animate-none"
                />
                Enable Branded Page Preloader
              </label>
              <label className="flex items-center gap-3 cursor-pointer font-sans text-sm uppercase tracking-wider font-semibold">
                <input
                  type="checkbox"
                  checked={settings.whatsappEnabled}
                  onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                  className="h-4.5 w-4.5 text-primary animate-none"
                />
                Enable Floating WhatsApp Help Widget
              </label>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 mt-6"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}

        {/* T2.3: PRODUCT CATEGORIES CMS */}
        {activeTab === 'categories-settings' && (
          <div className="space-y-6 max-w-4xl">
            {/* Create Category form */}
            <form
              onSubmit={handleSaveCategory}
              className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6"
            >
              <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">
                {editCategory && editCategory.id ? 'Modify Product Category' : 'Register New Product Category'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={editCategory?.name || ''}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value, slug: editCategory?.id ? (editCategory.slug || '') : e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm text-text-primary rounded-none"
                    placeholder="e.g. Grains & Pulses"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Slug URL filter tag</label>
                  <input
                    type="text"
                    required
                    value={editCategory?.slug || ''}
                    onChange={(e) => setEditCategory({ ...editCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm text-text-primary rounded-none font-mono"
                    placeholder="e.g. grains-pulses"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Description</label>
                <textarea
                  rows={2}
                  value={editCategory?.description || ''}
                  onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm text-text-primary rounded-none resize-none"
                  placeholder="Supporting copy for portfolio filters..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-primary text-white font-sans text-xs font-bold uppercase tracking-wider hover:bg-primary-light transition-all duration-300"
                >
                  {saving ? 'Saving...' : editCategory?.id ? 'Update Category' : 'Create Category'}
                </button>
                {editCategory && (
                  <button
                    type="button"
                    onClick={() => setEditCategory(null)}
                    className="px-6 py-3 border border-accent font-sans text-xs text-text-primary font-bold uppercase tracking-wider hover:bg-bg-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* List current categories */}
            <div className="bg-white border border-accent p-6 shadow-premium space-y-6">
              <h4 className="font-serif font-bold text-lg text-text-primary border-b border-accent pb-2">Active Categories</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-accent text-text-muted uppercase text-[10px] tracking-wider font-bold">
                      <th className="pb-3">Category Name</th>
                      <th className="pb-3 w-40">Slug</th>
                      <th className="pb-3 w-32">Products Attached</th>
                      <th className="pb-3 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => {
                      const count = products.filter(p => p.categoryId === cat.id).length
                      return (
                        <tr key={cat.id} className="border-b border-accent/40 last:border-b-0 hover:bg-bg-secondary/40">
                          <td className="py-3 font-semibold text-text-primary">
                            {cat.name}
                            {cat.description && <div className="text-[10px] text-text-muted mt-0.5">{cat.description}</div>}
                          </td>
                          <td className="py-3 font-mono text-[11px] text-text-secondary">{cat.slug}</td>
                          <td className="py-3 font-medium text-primary">{count} products</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditCategory(cat)}
                                className="p-2 border border-accent hover:border-primary text-text-primary"
                                title="Edit category info"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-2 border border-accent hover:border-red-500 text-text-primary hover:text-red-500"
                                title="Delete category"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* T2.4: FOOTER SETTINGS CMS */}
        {activeTab === 'footer-settings' && (
          <div className="space-y-8 max-w-4xl">
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setSaving(true)
                try {
                  const updated = { ...settings, socialLinksList: JSON.stringify(socialLinksList) }
                  const res = await fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                  })
                  if (!res.ok) throw new Error()
                  setSettings(updated)
                  showToast('success', 'Footer settings updated successfully')
                  router.refresh()
                } catch {
                  showToast('error', 'Failed to update footer settings')
                } finally {
                  setSaving(false)
                }
              }}
              className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6"
            >
              <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">Footer Details & Visual Social Profiles</h3>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Corporate description text</label>
                <textarea
                  rows={3}
                  required
                  value={settings.footerDescription || ''}
                  onChange={(e) => setSettings({ ...settings, footerDescription: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Copyright Text</label>
                <input
                  type="text"
                  required
                  value={settings.footerCopyright || ''}
                  onChange={(e) => setSettings({ ...settings, footerCopyright: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>

              {/* SAVE BUTTON FOR GENERAL SECTION */}
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 w-full"
              >
                {saving ? 'Saving...' : 'Save Footer Details'}
              </button>
            </form>

            {/* Social Network Profiles Visual builder */}
            <div className="bg-white border border-accent p-6 shadow-premium space-y-4">
              <div className="flex justify-between items-center border-b border-accent pb-3">
                <div>
                  <h4 className="font-serif font-bold text-lg text-text-primary">Social Network Channels</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Define pre-installed channels or upload custom SVG icons.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditSocialLink({ id: 'social_' + Date.now().toString(), platform: 'facebook', url: '', isEnabled: true, order: socialLinksList.length, isCustom: false, customIconUrl: '' })}
                  className="px-3 py-1.5 bg-secondary text-[#032318] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Social link
                </button>
              </div>

              {/* Edit Social Form */}
              {editSocialLink && (
                <div className="border border-secondary p-4 space-y-4 bg-bg-secondary mb-4">
                  <h5 className="font-serif font-bold text-sm text-text-primary">{editSocialLink.url ? 'Edit Profile' : 'New Social Profile'}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Link Type</label>
                      <select
                        value={editSocialLink.isCustom ? 'custom' : 'preset'}
                        onChange={(e) => setEditSocialLink({ ...editSocialLink, isCustom: e.target.value === 'custom', platform: e.target.value === 'custom' ? 'Custom' : 'facebook', customIconUrl: '' })}
                        className="w-full px-3 py-2.5 border border-accent bg-white text-xs text-text-primary rounded-none"
                      >
                        <option value="preset">Pre-installed Icon</option>
                        <option value="custom">Custom Upload (.SVG File)</option>
                      </select>
                    </div>

                    {!editSocialLink.isCustom ? (
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Visual Icon / Platform</label>
                        <select
                          value={editSocialLink.platform || ''}
                          onChange={(e) => setEditSocialLink({ ...editSocialLink, platform: e.target.value })}
                          className="w-full px-3 py-2.5 border border-accent bg-white text-xs text-text-primary rounded-none font-semibold"
                        >
                          <option value="facebook">Facebook</option>
                          <option value="instagram">Instagram</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="twitter">X / Twitter</option>
                          <option value="youtube">YouTube</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="telegram">Telegram</option>
                          <option value="pinterest">Pinterest</option>
                          <option value="tiktok">TikTok</option>
                          <option value="snapchat">Snapchat</option>
                          <option value="threads">Threads</option>
                          <option value="discord">Discord</option>
                          <option value="reddit">Reddit</option>
                          <option value="google">Google</option>
                          <option value="globe">Website / Globe</option>
                          <option value="email">Email / Mail</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Platform Name</label>
                        <input
                          type="text"
                          required
                          value={editSocialLink.platform || ''}
                          onChange={(e) => setEditSocialLink({ ...editSocialLink, platform: e.target.value })}
                          className="w-full px-3 py-2.5 border border-accent bg-white text-xs text-text-primary rounded-none font-semibold"
                          placeholder="e.g. Skype"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Display Order</label>
                      <input
                        type="number"
                        value={editSocialLink.order ?? 0}
                        onChange={(e) => setEditSocialLink({ ...editSocialLink, order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-accent bg-white text-xs text-text-primary rounded-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Profile / Target URL</label>
                      <input
                        type="text"
                        required
                        value={editSocialLink.url || ''}
                        onChange={(e) => setEditSocialLink({ ...editSocialLink, url: e.target.value })}
                        className="w-full px-3 py-2.5 border border-accent bg-white text-xs text-text-primary rounded-none font-semibold"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold mt-4">
                        <input
                          type="checkbox"
                          checked={editSocialLink.isEnabled ?? true}
                          onChange={(e) => setEditSocialLink({ ...editSocialLink, isEnabled: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        Enable Channel (Publish live)
                      </label>
                    </div>
                  </div>

                  {editSocialLink.isCustom && (
                    <div className="border-t border-accent/40 pt-3">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Upload Platform Icon (.SVG File Only)</label>
                      <ImageUploadInput
                        value={editSocialLink.customIconUrl || ''}
                        onChange={(url) => {
                          if (url && !url.toLowerCase().endsWith('.svg')) {
                            showToast('error', 'Only .SVG files are accepted for custom social icons!')
                            return
                          }
                          setEditSocialLink({ ...editSocialLink, customIconUrl: url })
                        }}
                        folder="logo"
                      />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!editSocialLink.url || !editSocialLink.platform) {
                          showToast('error', 'Platform and URL are required')
                          return
                        }
                        if (editSocialLink.isCustom && !editSocialLink.customIconUrl) {
                          showToast('error', 'Please upload an SVG file for the custom icon')
                          return
                        }
                        setSocialLinksList(prev => {
                          const idx = prev.findIndex(s => s.id === editSocialLink.id)
                          if (idx > -1) {
                            return prev.map(s => s.id === editSocialLink.id ? editSocialLink : s)
                          } else {
                            return [...prev, editSocialLink]
                          }
                        })
                        setEditSocialLink(null)
                        showToast('success', 'Social channel details updated locally. Click Save Footer Details to save live.')
                      }}
                      className="px-4 py-2 bg-primary text-white font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      Apply Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditSocialLink(null)}
                      className="px-4 py-2 border border-accent hover:bg-white text-text-primary font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Social Channels List */}
              <div className="space-y-2">
                {socialLinksList.sort((a, b) => (a.order || 0) - (b.order || 0)).map((social, idx) => (
                  <div key={social.id || idx} className={`flex justify-between items-center p-3 border border-accent ${social.isEnabled ? 'bg-white' : 'bg-accent/20 opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      {social.isCustom && social.customIconUrl ? (
                        <img src={social.customIconUrl} alt={social.platform} className="h-6 w-6 object-contain bg-emerald-950 p-1" />
                      ) : (
                        <Globe className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <span className="font-serif font-bold text-sm text-text-primary block capitalize">{social.platform}</span>
                        <span className="text-[10px] text-text-secondary block mt-0.5">
                          URL: <span className="font-mono text-primary">{social.url}</span> — Order: {social.order ?? 0} {social.isCustom && ' (Custom SVG Icon)'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setEditSocialLink(social)}
                        className="p-1.5 border border-accent text-text-primary hover:text-primary hover:border-primary"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!confirm('Delete this social link profile?')) return
                          setSocialLinksList(prev => prev.filter(s => s.id !== social.id))
                          showToast('success', 'Social channel removed locally. Click Save Footer Details to apply live.')
                        }}
                        className="p-1.5 border border-accent text-text-primary hover:text-red-600 hover:border-red-600"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* T2: WEBSITE SETTINGS FORM */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl">
            <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">Company Contacts & Branding</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Company Name</label>
                <input
                  type="text"
                  required
                  value={settings.companyName || ''}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Primary Trade Email</label>
                <input
                  type="email"
                  required
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Primary Phone Line</label>
                <input
                  type="text"
                  required
                  value={settings.phone1 || ''}
                  onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Secondary Phone Line</label>
                <input
                  type="text"
                  value={settings.phone2 || ''}
                  onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">WhatsApp Contact Number</label>
                <input
                  type="text"
                  required
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">WhatsApp Default Preset Message</label>
                <input
                  type="text"
                  value={settings.whatsappDefaultMessage || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappDefaultMessage: e.target.value })}
                  className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Registered Corporate Address</label>
              <textarea
                rows={3}
                required
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Google Map Embed Source URL</label>
              <input
                type="text"
                required
                value={settings.googleMapUrl || ''}
                onChange={(e) => setSettings({ ...settings, googleMapUrl: e.target.value })}
                className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
              />
            </div>

            {/* Brand Assets */}
            <div className="border-t border-accent pt-6 space-y-6">
              <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">Brand Graphic Identity Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Corporate Circular Logo (Header/Sidebar)</label>
                  <ImageUploadInput
                    value={settings.logo || ''}
                    onChange={(url) => setSettings({ ...settings, logo: url })}
                    folder="logo"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Browser Favicon Icon (.ico or .png)</label>
                  <ImageUploadInput
                    value={settings.favicon || ''}
                    onChange={(url) => setSettings({ ...settings, favicon: url })}
                    folder="logo"
                  />
                </div>
              </div>
            </div>

            {/* SEO & Meta Tags */}
            <div className="border-t border-accent pt-6 space-y-6">
              <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">Global Search Engine Optimization (SEO)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Homepage SEO Title (Browser Tab Title)</label>
                  <input
                    type="text"
                    required
                    value={settings.seoTitle || ''}
                    onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                    placeholder="e.g. Sat Saheb Trading Co. | Premium Agricultural Exports"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Meta Description Tag</label>
                  <textarea
                    rows={2}
                    required
                    value={settings.seoDescription || ''}
                    onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary resize-none"
                    placeholder="Meta description summary shown in search listings..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-accent/40">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary block mb-1">OpenGraph Link Share Title</label>
                    <input
                      type="text"
                      value={settings.ogTitle || ''}
                      onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary block mb-1">OpenGraph Link Share Description</label>
                    <textarea
                      rows={2}
                      value={settings.ogDescription || ''}
                      onChange={(e) => setSettings({ ...settings, ogDescription: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary resize-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary block mb-1">OpenGraph Share Preview Graphic</label>
                  <ImageUploadInput
                    value={settings.ogImage || ''}
                    onChange={(url) => setSettings({ ...settings, ogImage: url })}
                    folder="logo"
                  />
                </div>
              </div>
            </div>

            {/* Page Header Customizations */}
            <div className="border-t border-accent pt-6 space-y-6">
              <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">Individual Page Custom Header Content</h3>
              
              {/* Product Page Header CMS */}
              <div className="border border-accent/60 p-4 space-y-4 bg-bg-secondary/40">
                <h4 className="font-serif font-bold text-sm text-text-primary border-b border-accent/40 pb-1">Products Showcase Page Header</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Section Label</label>
                    <input
                      type="text"
                      value={settings.productPageLabel || ''}
                      onChange={(e) => setSettings({ ...settings, productPageLabel: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Main Heading</label>
                    <input
                      type="text"
                      value={settings.productPageTitle || ''}
                      onChange={(e) => setSettings({ ...settings, productPageTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Description Paragraph</label>
                  <textarea
                    rows={2}
                    value={settings.productPageDescription || ''}
                    onChange={(e) => setSettings({ ...settings, productPageDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary"
                  />
                </div>
              </div>

              {/* Gallery Page Header CMS */}
              <div className="border border-accent/60 p-4 space-y-4 bg-bg-secondary/40">
                <h4 className="font-serif font-bold text-sm text-text-primary border-b border-accent/40 pb-1">Corporate Gallery Page Header</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Section Label</label>
                    <input
                      type="text"
                      value={settings.galleryPageLabel || ''}
                      onChange={(e) => setSettings({ ...settings, galleryPageLabel: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Main Heading</label>
                    <input
                      type="text"
                      value={settings.galleryPageTitle || ''}
                      onChange={(e) => setSettings({ ...settings, galleryPageTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Description Paragraph</label>
                  <textarea
                    rows={2}
                    value={settings.galleryPageDescription || ''}
                    onChange={(e) => setSettings({ ...settings, galleryPageDescription: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-8 pt-4 border-t border-accent">
              <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                <input
                  type="checkbox"
                  checked={settings.preloaderEnabled || false}
                  onChange={(e) => setSettings({ ...settings, preloaderEnabled: e.target.checked })}
                  className="h-4 w-4 text-primary"
                />
                Enable Branded Preloader
              </label>
              <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                <input
                  type="checkbox"
                  checked={settings.whatsappEnabled || false}
                  onChange={(e) => setSettings({ ...settings, whatsappEnabled: e.target.checked })}
                  className="h-4 w-4 text-primary"
                />
                Enable Floating WhatsApp Button
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}

        {/* T3: THEME STYLING */}
        {activeTab === 'theme' && (
          <form onSubmit={handleSaveTheme} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl">
            <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">Visual Theme Preset</h3>

            {/* Theme Preset Selector */}
            <div className="space-y-4">
              <p className="text-xs text-text-secondary font-sans">Select a preset theme to apply a curated colour palette across the entire website. You can fine-tune individual colours below.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {([
                  { key: 'theme-premium-green', label: 'Premium Green', desc: 'Emerald / Gold — Classic luxury agricultural trading', colors: ['#052e16', '#16a34a', '#ca8a04'] },
                  { key: 'theme-oceanic-minimal', label: 'Oceanic Minimal', desc: 'Indigo / Coral — Modern ocean logistics blue', colors: ['#1e1b4b', '#4f46e5', '#f97316'] },
                  { key: 'theme-bold-luxury', label: 'Bold Luxury', desc: 'Pitch Black / Crimson — Executive dark prestige', colors: ['#0c0c0c', '#1a1a1a', '#b91c1c'] },
                ] as { key: string; label: string; desc: string; colors: string[] }[]).map(preset => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={async () => {
                      setSaving(true)
                      try {
                        const newTheme = {
                          ...theme,
                          themeName: preset.key,
                          primaryColor: preset.key === 'theme-premium-green' ? '#06402b' : preset.key === 'theme-oceanic-minimal' ? '#0f4c81' : '#1a1a1a',
                          secondaryColor: preset.key === 'theme-premium-green' ? '#d69317' : preset.key === 'theme-oceanic-minimal' ? '#f4a261' : '#ff3e3e',
                          accentColor: preset.key === 'theme-premium-green' ? '#f3f4f6' : preset.key === 'theme-oceanic-minimal' ? '#eef2f6' : '#262626',
                          bgPrimary: preset.key === 'theme-premium-green' ? '#ffffff' : preset.key === 'theme-oceanic-minimal' ? '#ffffff' : '#0a0a0a',
                          bgSecondary: preset.key === 'theme-premium-green' ? '#f9fafb' : preset.key === 'theme-oceanic-minimal' ? '#f8fafc' : '#121212',
                          textPrimary: preset.key === 'theme-premium-green' ? '#111827' : preset.key === 'theme-oceanic-minimal' ? '#0f172a' : '#ffffff',
                          textSecondary: preset.key === 'theme-premium-green' ? '#4b5563' : preset.key === 'theme-oceanic-minimal' ? '#475569' : '#a3a3a3',
                        }
                        const res = await fetch('/api/admin/settings', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(newTheme),
                        })
                        if (!res.ok) throw new Error()
                        setTheme(newTheme)
                        showToast('success', `Theme "${preset.label}" applied to live website`)
                        router.refresh()
                      } catch {
                        showToast('error', 'Failed to apply preset theme')
                      } finally {
                        setSaving(false)
                      }
                    }}
                    className={`border-2 p-4 text-left transition-all duration-300 ${
                      theme.themeName === preset.key
                        ? 'border-primary bg-primary/5'
                        : 'border-accent hover:border-primary/60'
                    }`}
                  >
                    <div className="flex gap-2 mb-3">
                      {preset.colors.map((c, i) => (
                        <div key={i} className="h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <span className="block font-serif font-bold text-sm text-text-primary">{preset.label}</span>
                    <span className="block font-sans text-[10px] text-text-secondary mt-0.5 leading-relaxed">{preset.desc}</span>
                    {theme.themeName === preset.key && (
                      <span className="inline-block mt-2 text-[9px] uppercase font-bold tracking-wider bg-primary text-white px-2 py-0.5">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2 pt-4">Custom Color Palette Hex Pickers</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="h-10 w-10 border border-accent"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-accent text-xs rounded-none text-text-primary uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="h-10 w-10 border border-accent"
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-accent text-xs rounded-none text-text-primary uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Background Main</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.bgPrimary}
                    onChange={(e) => setTheme({ ...theme, bgPrimary: e.target.value })}
                    className="h-10 w-10 border border-accent"
                  />
                  <input
                    type="text"
                    value={theme.bgPrimary}
                    onChange={(e) => setTheme({ ...theme, bgPrimary: e.target.value })}
                    className="flex-1 px-3 py-2 border border-accent text-xs rounded-none text-text-primary uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Background Split</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.bgSecondary}
                    onChange={(e) => setTheme({ ...theme, bgSecondary: e.target.value })}
                    className="h-10 w-10 border border-accent"
                  />
                  <input
                    type="text"
                    value={theme.bgSecondary}
                    onChange={(e) => setTheme({ ...theme, bgSecondary: e.target.value })}
                    className="flex-1 px-3 py-2 border border-accent text-xs rounded-none text-text-primary uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Text Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={theme.textPrimary}
                    onChange={(e) => setTheme({ ...theme, textPrimary: e.target.value })}
                    className="h-10 w-10 border border-accent"
                  />
                  <input
                    type="text"
                    value={theme.textPrimary}
                    onChange={(e) => setTheme({ ...theme, textPrimary: e.target.value })}
                    className="flex-1 px-3 py-2 border border-accent text-xs rounded-none text-text-primary uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Button Shape & Sizing</label>
                <select
                  value={theme.buttonStyle}
                  onChange={(e) => setTheme({ ...theme, buttonStyle: e.target.value })}
                  className="w-full px-4 py-2.5 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                >
                  <option value="editorial">Editorial (Sharp, thin borders)</option>
                  <option value="rounded">Rounded Corners</option>
                  <option value="pill">Pill Shape (Fully circular)</option>
                  <option value="sharp">Sharp Edged blocks</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              {saving ? 'Saving...' : 'Apply Theme'}
            </button>
          </form>
        )}

        {/* T4: HERO SLIDER */}
        {activeTab === 'slides' && (
          <div className="space-y-6">
            {!editSlide ? (
              <div className="bg-white border border-accent p-6 shadow-premium">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-text-primary">Current Slides</h3>
                    <p className="text-xs text-text-secondary mt-1">Manage the hero slides carousel on the homepage.</p>
                  </div>
                  <button
                    onClick={() => setEditSlide({ title: '', subtitle: '', description: '', imageUrl: '', alignment: 'left', isEnabled: true })}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Slide
                  </button>
                </div>

                <div className="space-y-4">
                  {slides.map((slide, idx) => (
                    <div key={slide.id} className="border border-accent/60 p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-secondary/15">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-24 bg-emerald-950 border border-accent overflow-hidden shrink-0">
                          <img src={slide.imageUrl} alt={slide.title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-text-primary text-base">{slide.title}</h4>
                          <span className="text-[10px] text-secondary tracking-widest uppercase font-semibold block">{slide.subtitle || 'No Subtitle'}</span>
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-none mt-1.5 inline-block ${slide.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {slide.isEnabled ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                      </div>

                      {/* Navigation and edit controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/admin/slides', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: slide.id, isEnabled: !slide.isEnabled }),
                              })
                              if (!res.ok) throw new Error()
                              setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, isEnabled: !slide.isEnabled } : s))
                              showToast('success', `Slide ${!slide.isEnabled ? 'enabled' : 'disabled'} successfully`)
                            } catch {
                              showToast('error', 'Failed to toggle slide visibility')
                            }
                          }}
                          className="px-3 py-1.5 border border-accent hover:border-primary text-xs uppercase font-bold tracking-wider font-sans transition-colors"
                          title="Toggle visibility"
                        >
                          {slide.isEnabled ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => setEditSlide(slide)}
                          className="p-2 border border-accent hover:border-primary text-text-primary hover:text-primary transition-colors"
                          title="Edit slide details"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="p-2 border border-accent hover:border-red-500 text-text-primary hover:text-red-500 transition-colors"
                          title="Delete slide"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                        <div className="h-8 w-px bg-accent mx-2" />
                        <button
                          onClick={() => handleMoveSlide(idx, 'up')}
                          disabled={idx === 0}
                          className="p-2 border border-accent hover:border-primary disabled:opacity-30 disabled:hover:border-accent"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMoveSlide(idx, 'down')}
                          disabled={idx === slides.length - 1}
                          className="p-2 border border-accent hover:border-primary disabled:opacity-30 disabled:hover:border-accent"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveSlide} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl">
                <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">
                  {editSlide.id ? 'Edit Hero Slide' : 'Add New Hero Slide'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Heading Title</label>
                    <input
                      type="text"
                      required
                      value={editSlide.title || ''}
                      onChange={(e) => setEditSlide({ ...editSlide, title: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Subheading tag</label>
                    <input
                      type="text"
                      value={editSlide.subtitle || ''}
                      onChange={(e) => setEditSlide({ ...editSlide, subtitle: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Slide Description / Content</label>
                  <textarea
                    rows={3}
                    value={editSlide.description || ''}
                    onChange={(e) => setEditSlide({ ...editSlide, description: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Slide Background Image</label>
                  <ImageUploadInput
                    value={editSlide.imageUrl || ''}
                    onChange={(url) => setEditSlide({ ...editSlide, imageUrl: url })}
                    folder="slides"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-accent/40">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-text-primary mb-3">Primary CTA Button</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Button Text</label>
                        <input
                          type="text"
                          value={editSlide.primaryCtaText || ''}
                          onChange={(e) => setEditSlide({ ...editSlide, primaryCtaText: e.target.value })}
                          className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                          placeholder="e.g. View Products"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Button Link</label>
                        <input
                          type="text"
                          value={editSlide.primaryCtaLink || ''}
                          onChange={(e) => setEditSlide({ ...editSlide, primaryCtaLink: e.target.value })}
                          className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                          placeholder="e.g. /products"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-sm text-text-primary mb-3">Secondary CTA Button</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Button Text</label>
                        <input
                          type="text"
                          value={editSlide.secondaryCtaText || ''}
                          onChange={(e) => setEditSlide({ ...editSlide, secondaryCtaText: e.target.value })}
                          className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                          placeholder="e.g. Contact Us"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Button Link</label>
                        <input
                          type="text"
                          value={editSlide.secondaryCtaLink || ''}
                          onChange={(e) => setEditSlide({ ...editSlide, secondaryCtaLink: e.target.value })}
                          className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                          placeholder="e.g. /contact"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-accent/40">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Content Alignment</label>
                    <select
                      value={editSlide.alignment || 'left'}
                      onChange={(e) => setEditSlide({ ...editSlide, alignment: e.target.value })}
                      className="w-full px-4 py-2.5 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                    >
                      <option value="left">Left Aligned</option>
                      <option value="center">Center Aligned</option>
                      <option value="right">Right Aligned</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold mt-6">
                      <input
                        type="checkbox"
                        checked={editSlide.isEnabled ?? true}
                        onChange={(e) => setEditSlide({ ...editSlide, isEnabled: e.target.checked })}
                        className="h-4 w-4 text-primary"
                      />
                      Enable Slide Visibility
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-accent">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3.5 bg-primary text-white font-sans text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    {saving ? 'Saving...' : 'Save Slide'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditSlide(null)}
                    className="px-8 py-3.5 border border-accent hover:bg-bg-secondary font-sans text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* T5: PRODUCT LIST MANAGER */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {!editProduct ? (
              <div className="bg-white border border-accent p-6 shadow-premium">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-text-primary">Listed Products</h3>
                    <p className="text-xs text-text-secondary mt-1">Manage the catalog of agricultural commodities.</p>
                  </div>
                  <button
                    onClick={() => setEditProduct({ title: '', overview: '', description: '', featuredImage: '', specifications: '[]', categoryId: categories[0]?.id || 1, isEnabled: true, isFeatured: false, gallery: [] })}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-accent text-text-muted uppercase text-[10px] tracking-wider font-bold">
                        <th className="pb-3">Image</th>
                        <th className="pb-3">Product Name</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Slug</th>
                        <th className="pb-3">Featured</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Order</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((prod, idx) => (
                        <tr key={prod.id} className="border-b border-accent/40 last:border-b-0 hover:bg-bg-secondary/40">
                          <td className="py-3">
                            <div className="relative h-10 w-10 bg-bg-secondary border border-accent overflow-hidden flex items-center justify-center p-1">
                              <img src={prod.featuredImage} alt={prod.title} className="h-full w-full object-contain" />
                            </div>
                          </td>
                          <td className="py-3 font-semibold text-text-primary">{prod.title}</td>
                          <td className="py-3 text-xs">
                            {categories.find(c => c.id === prod.categoryId)?.name || 'Uncategorized'}
                          </td>
                          <td className="py-3 text-text-muted">{prod.slug}</td>
                          <td className="py-3">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch('/api/admin/products', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ id: prod.id, isFeatured: !prod.isFeatured }),
                                  })
                                  if (!res.ok) throw new Error()
                                  setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, isFeatured: !prod.isFeatured } : p))
                                  showToast('success', `Product ${!prod.isFeatured ? 'featured' : 'unfeatured'} successfully`)
                                } catch {
                                  showToast('error', 'Failed to toggle featured status')
                                }
                              }}
                              className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 ${prod.isFeatured ? 'bg-secondary text-white' : 'bg-accent/40 text-text-secondary'}`}
                            >
                              {prod.isFeatured ? 'Featured' : 'Standard'}
                            </button>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch('/api/admin/products', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ id: prod.id, isEnabled: !prod.isEnabled }),
                                  })
                                  if (!res.ok) throw new Error()
                                  setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, isEnabled: !prod.isEnabled } : p))
                                  showToast('success', `Product ${!prod.isEnabled ? 'published' : 'hidden'} successfully`)
                                } catch {
                                  showToast('error', 'Failed to toggle product status')
                                }
                              }}
                              className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 ${prod.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {prod.isEnabled ? 'Published' : 'Hidden'}
                            </button>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveProduct(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 border border-accent hover:border-primary disabled:opacity-20"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleMoveProduct(idx, 'down')}
                                disabled={idx === products.length - 1}
                                className="p-1 border border-accent hover:border-primary disabled:opacity-20"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  const rawGallery = (prod as any).gallery
                                  const rawImages = (prod as any).images
                                  let gList: string[] = []
                                  if (Array.isArray(rawGallery) && rawGallery.length > 0) {
                                    gList = rawGallery.map((i: any) => typeof i === 'string' ? i : i.url)
                                  } else if (Array.isArray(rawImages) && rawImages.length > 0) {
                                    gList = rawImages.map((i: any) => typeof i === 'string' ? i : i.url)
                                  } else if (prod.featuredImage) {
                                    gList = [prod.featuredImage]
                                  }
                                  setEditProduct({ ...prod, gallery: gList })
                                }}
                                className="p-2 border border-accent hover:border-primary text-text-primary hover:text-primary transition-colors"
                                title="Edit product"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-2 border border-accent hover:border-red-500 text-text-primary hover:text-red-500 transition-colors"
                                title="Delete product"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSaveProduct}
                className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl"
              >
                <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">
                  {editProduct.id ? `Edit Product: ${editProduct.title}` : 'Add New Product'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Product Name</label>
                    <input
                      type="text"
                      required
                      value={editProduct.title || ''}
                      onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Product Category</label>
                    <select
                      value={editProduct.categoryId || ''}
                      onChange={(e) => setEditProduct({ ...editProduct, categoryId: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Product Overview / Short description</label>
                  <textarea
                    rows={2}
                    required
                    value={editProduct.overview || ''}
                    onChange={(e) => setEditProduct({ ...editProduct, overview: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
                    placeholder="Short description for listing cards..."
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Full Description</label>
                  <textarea
                    rows={6}
                    required
                    value={editProduct.description || ''}
                    onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
                    placeholder="Full detailed product specifications or narrative..."
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Featured Main Image</label>
                  <ImageUploadInput
                    value={editProduct.featuredImage || ''}
                    onChange={(url) => setEditProduct({ ...editProduct, featuredImage: url })}
                    folder="products"
                  />
                </div>

                {/* Multiple Gallery Images Showcase */}
                <div className="space-y-4 pt-4 border-t border-accent/40">
                  <h4 className="font-serif font-bold text-sm text-text-primary">Product Gallery Showcase (Multiple Images)</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {(editProduct.gallery || []).map((imgUrl: string, imgIdx: number) => (
                      <div key={imgIdx} className="relative aspect-square border border-accent bg-bg-secondary flex flex-col justify-between p-2">
                        <div className="relative flex-1 w-full overflow-hidden">
                          <img src={imgUrl} alt={`Gallery ${imgIdx}`} className="h-full w-full object-contain" />
                        </div>
                        <div className="flex gap-1 mt-2">
                          <label className="flex-1 py-1 text-center text-[10px] bg-primary text-white hover:bg-primary-light uppercase font-bold tracking-wider cursor-pointer">
                            Change
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  showToast('success', 'Uploading replacement image...')
                                  const url = await handleUploadImage(file, 'products')
                                  if (url) {
                                    const updatedGallery = [...(editProduct.gallery || [])]
                                    updatedGallery[imgIdx] = url
                                    setEditProduct({ ...editProduct, gallery: updatedGallery })
                                    showToast('success', 'Image replaced')
                                  }
                                }
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedGallery = (editProduct.gallery || []).filter((_, idx) => idx !== imgIdx)
                              setEditProduct({ ...editProduct, gallery: updatedGallery })
                            }}
                            className="flex-1 py-1 text-[10px] bg-red-100 text-red-700 hover:bg-red-200 uppercase font-bold tracking-wider"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Add Image to Gallery</label>
                    <ImageUploadInput
                      value=""
                      onChange={(url) => {
                        if (url) {
                          const updatedGallery = [...(editProduct.gallery || []), url]
                          setEditProduct({ ...editProduct, gallery: updatedGallery })
                        }
                      }}
                      folder="products"
                      label="Add Gallery Image"
                    />
                  </div>
                </div>

                {/* Dynamic Specifications Editor */}
                <div className="space-y-4 pt-4 border-t border-accent/40">
                  <h4 className="font-serif font-bold text-sm text-text-primary font-serif">Product Specifications Table</h4>
                  {(() => {
                    let parsedSpecs: { key: string; value: string }[] = []
                    try {
                      parsedSpecs = JSON.parse(editProduct.specifications || '[]')
                      if (!Array.isArray(parsedSpecs)) parsedSpecs = []
                    } catch {
                      parsedSpecs = []
                    }

                    return (
                      <div className="space-y-3">
                        {parsedSpecs.map((spec, sIdx) => (
                          <div key={sIdx} className="flex gap-4 items-center">
                            <input
                              type="text"
                              placeholder="Specification Name (e.g. Size)"
                              value={spec.key}
                              onChange={(e) => {
                                const updated = [...parsedSpecs]
                                updated[sIdx].key = e.target.value
                                setEditProduct({ ...editProduct, specifications: JSON.stringify(updated) })
                              }}
                              className="flex-1 px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                            />
                            <input
                              type="text"
                              placeholder="Specification Value (e.g. 9mm)"
                              value={spec.value}
                              onChange={(e) => {
                                const updated = [...parsedSpecs]
                                updated[sIdx].value = e.target.value
                                setEditProduct({ ...editProduct, specifications: JSON.stringify(updated) })
                              }}
                              className="flex-1 px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = parsedSpecs.filter((_, idx) => idx !== sIdx)
                                setEditProduct({ ...editProduct, specifications: JSON.stringify(updated) })
                              }}
                              className="p-2 border border-accent hover:border-red-500 hover:text-red-500"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...parsedSpecs, { key: '', value: '' }]
                            setEditProduct({ ...editProduct, specifications: JSON.stringify(updated) })
                          }}
                          className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white font-sans text-[10px] font-bold uppercase tracking-wider block"
                        >
                          Add Specification Row
                        </button>
                      </div>
                    )
                  })()}
                </div>

                {/* SEO Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-accent/40">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Meta SEO Title (Browser tab)</label>
                    <input
                      type="text"
                      value={editProduct.metaTitle || ''}
                      onChange={(e) => setEditProduct({ ...editProduct, metaTitle: e.target.value })}
                      className="w-full px-4 py-2.5 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                      placeholder="e.g. Premium Chickpeas Wholesale"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Meta SEO Description</label>
                    <input
                      type="text"
                      value={editProduct.metaDescription || ''}
                      onChange={(e) => setEditProduct({ ...editProduct, metaDescription: e.target.value })}
                      className="w-full px-4 py-2.5 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                      placeholder="SEO meta tag description..."
                    />
                  </div>
                </div>

                <div className="flex gap-8 pt-4 border-t border-accent/40">
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                    <input
                      type="checkbox"
                      checked={editProduct.isEnabled ?? true}
                      onChange={(e) => setEditProduct({ ...editProduct, isEnabled: e.target.checked })}
                      className="h-4 w-4 text-primary"
                    />
                    Publish Product Visibility
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                    <input
                      type="checkbox"
                      checked={editProduct.isFeatured ?? false}
                      onChange={(e) => setEditProduct({ ...editProduct, isFeatured: e.target.checked })}
                      className="h-4 w-4 text-primary"
                    />
                    Feature on Homepage
                  </label>
                </div>

                <div className="flex gap-4 pt-4 border-t border-accent">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3.5 bg-primary text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    {saving ? 'Saving...' : 'Save Product Details'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProduct(null)}
                    className="px-8 py-3.5 border border-accent hover:bg-bg-secondary font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* PORTFOLIO: PRODUCT CATEGORIES CRUD */}
        {activeTab === 'categories-settings' && (
          <div className="space-y-6">
            {!editCategory ? (
              <div className="bg-white border border-accent p-6 shadow-premium">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-text-primary">Product Categories</h3>
                    <p className="text-xs text-text-secondary mt-1">Manage commodity grouping categories.</p>
                  </div>
                  <button
                    onClick={() => setEditCategory({ name: '', slug: '', description: '' })}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Category
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-accent text-text-muted uppercase text-[10px] tracking-wider font-bold">
                        <th className="pb-3">Category Name</th>
                        <th className="pb-3">Slug</th>
                        <th className="pb-3">Description</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr key={cat.id} className="border-b border-accent/40 last:border-b-0 hover:bg-bg-secondary/40">
                          <td className="py-3 font-semibold text-text-primary">{cat.name}</td>
                          <td className="py-3 text-text-muted">{cat.slug}</td>
                          <td className="py-3 text-text-secondary">{cat.description || '-'}</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditCategory(cat)}
                                className="p-2 border border-accent hover:border-primary text-text-primary hover:text-primary transition-colors"
                                title="Edit Category"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="p-2 border border-accent hover:border-red-500 text-text-primary hover:text-red-500 transition-colors"
                                title="Delete Category"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveCategory} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-xl">
                <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">
                  {editCategory.id ? 'Edit Category' : 'Add New Category'}
                </h3>
                
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={editCategory.name || ''}
                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value, slug: editCategory.id ? editCategory.slug : e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Slug (URL Path)</label>
                  <input
                    type="text"
                    required
                    value={editCategory.slug || ''}
                    onChange={(e) => setEditCategory({ ...editCategory, slug: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={editCategory.description || ''}
                    onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-accent">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3.5 bg-primary text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    {saving ? 'Saving...' : 'Save Category'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditCategory(null)}
                    className="px-8 py-3.5 border border-accent hover:bg-bg-secondary font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* T6: MANAGING PARTNERS */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            {!editPartner ? (
              <div className="bg-white border border-accent p-6 shadow-premium">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-text-primary">Partners & Leadership</h3>
                    <p className="text-xs text-text-secondary mt-1">Manage the profiles of the corporate team and founders.</p>
                  </div>
                  <button
                    onClick={() => setEditPartner({ name: '', role: '', description: '', phone: '', imageUrl: '', order: partners.length, isVisible: true })}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Team Member
                  </button>
                </div>

                <div className="space-y-4">
                  {partners.map((partner, idx) => (
                    <div key={partner.id} className="border border-accent/60 p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-secondary/15">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 bg-emerald-950 border border-accent overflow-hidden shrink-0">
                          <img src={partner.imageUrl} alt={partner.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-text-primary text-base">{partner.name}</h4>
                          <span className="text-[10px] text-secondary tracking-widest uppercase font-semibold block">{partner.role}</span>
                          {partner.phone && <span className="text-[11px] text-text-secondary block font-sans">Phone: {partner.phone}</span>}
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-none mt-1.5 inline-block ${partner.isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {partner.isVisible ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                      </div>

                      {/* Navigation and edit controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/admin/partners', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: partner.id, isVisible: !partner.isVisible }),
                              })
                              if (!res.ok) throw new Error()
                              setPartners(prev => prev.map(p => p.id === partner.id ? { ...p, isVisible: !partner.isVisible } : p))
                              showToast('success', `Partner visibility updated successfully`)
                            } catch {
                              showToast('error', 'Failed to toggle partner visibility')
                            }
                          }}
                          className="px-3 py-1.5 border border-accent hover:border-primary text-xs uppercase font-bold tracking-wider font-sans transition-colors"
                        >
                          {partner.isVisible ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => setEditPartner(partner)}
                          className="p-2 border border-accent hover:border-primary text-text-primary hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePartner(partner.id)}
                          className="p-2 border border-accent hover:border-red-500 text-text-primary hover:text-red-500 transition-colors"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSavePartner} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl">
                <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">
                  {editPartner.id ? `Edit Team Member: ${editPartner.name}` : 'Add New Team Member'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Member Name</label>
                    <input
                      type="text"
                      required
                      value={editPartner.name || ''}
                      onChange={(e) => setEditPartner({ ...editPartner, name: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Role / Designation</label>
                    <input
                      type="text"
                      required
                      value={editPartner.role || ''}
                      onChange={(e) => setEditPartner({ ...editPartner, role: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Phone Number</label>
                    <input
                      type="text"
                      value={editPartner.phone || ''}
                      onChange={(e) => setEditPartner({ ...editPartner, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                      placeholder="e.g. +91 90996 67113"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Corporate Biography / Description</label>
                  <textarea
                    rows={4}
                    required
                    value={editPartner.description || ''}
                    onChange={(e) => setEditPartner({ ...editPartner, description: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Profile Image</label>
                  <ImageUploadInput
                    value={editPartner.imageUrl || ''}
                    onChange={(url) => setEditPartner({ ...editPartner, imageUrl: url })}
                    folder="partners"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-accent/40">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Display Sequence Order</label>
                    <input
                      type="number"
                      required
                      value={editPartner.order ?? 0}
                      onChange={(e) => setEditPartner({ ...editPartner, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold mt-6">
                      <input
                        type="checkbox"
                        checked={editPartner.isVisible ?? true}
                        onChange={(e) => setEditPartner({ ...editPartner, isVisible: e.target.checked })}
                        className="h-4 w-4 text-primary"
                      />
                      Make Profile Visible on About Page
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-accent">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3.5 bg-primary text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPartner(null)}
                    className="px-8 py-3.5 border border-accent hover:bg-bg-secondary font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* T7: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            {!editTestimonial ? (
              <div className="bg-white border border-accent p-6 shadow-premium">
                <div className="flex justify-between items-center mb-6 border-b border-accent pb-3">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-text-primary">Testimonials & Client Reviews</h3>
                    <p className="text-xs text-text-secondary mt-1">Manage global reviews and satisfaction testimonials.</p>
                  </div>
                  <button
                    onClick={() => setEditTestimonial({ name: '', role: '', company: '', location: '', review: '', rating: 5, order: testimonials.length, isEnabled: true })}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Review
                  </button>
                </div>

                <div className="space-y-6">
                  {testimonials.map((t) => (
                    <div key={t.id} className="border border-accent/60 p-5 flex flex-col justify-between gap-4 bg-bg-secondary/15">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-sans font-bold text-base text-text-primary">{t.name}</span>
                            <div className="flex gap-0.5 text-secondary">
                              {Array.from({ length: t.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-secondary" />
                              ))}
                            </div>
                          </div>
                          <span className="text-[11px] text-text-secondary block">
                            {t.role || 'Partner'}{t.company ? `, ${t.company}` : ''} {t.location ? `(${t.location})` : ''}
                          </span>
                        </div>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 ${t.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                          {t.isEnabled ? 'Published' : 'Hidden'}
                        </span>
                      </div>
                      
                      <p className="font-serif italic text-xs md:text-sm text-text-primary leading-relaxed bg-white/40 p-3 border border-accent/20">
                        &ldquo;{t.review}&rdquo;
                      </p>

                      <div className="flex items-center gap-3 pt-3 border-t border-accent/40">
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/admin/testimonials', {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: t.id, isEnabled: !t.isEnabled }),
                              })
                              if (!res.ok) throw new Error()
                              setTestimonials(prev => prev.map(item => item.id === t.id ? { ...item, isEnabled: !t.isEnabled } : item))
                              showToast('success', `Testimonial visibility updated`)
                            } catch {
                              showToast('error', 'Failed to toggle visibility')
                            }
                          }}
                          className="px-3 py-1.5 border border-accent hover:border-primary text-xs uppercase font-bold tracking-wider font-sans transition-colors"
                        >
                          {t.isEnabled ? 'Hide' : 'Show'}
                        </button>
                        <button
                          onClick={() => setEditTestimonial(t)}
                          className="p-2 border border-accent hover:border-primary text-text-primary hover:text-primary transition-colors"
                          title="Edit review"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="p-2 border border-accent hover:border-red-500 text-text-primary hover:text-red-500 transition-colors"
                          title="Delete review"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveTestimonial} className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl">
                <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">
                  {editTestimonial.id ? 'Edit Testimonial Review' : 'Add New Testimonial Review'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Reviewer Name</label>
                    <input
                      type="text"
                      required
                      value={editTestimonial.name || ''}
                      onChange={(e) => setEditTestimonial({ ...editTestimonial, name: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Star Rating</label>
                    <select
                      value={editTestimonial.rating || 5}
                      onChange={(e) => setEditTestimonial({ ...editTestimonial, rating: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                    >
                      <option value="5">5 Stars (Excellent)</option>
                      <option value="4">4 Stars (Good)</option>
                      <option value="3">3 Stars (Average)</option>
                      <option value="2">2 Stars (Fair)</option>
                      <option value="1">1 Star (Poor)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Designation / Role</label>
                    <input
                      type="text"
                      value={editTestimonial.role || ''}
                      onChange={(e) => setEditTestimonial({ ...editTestimonial, role: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                      placeholder="e.g. Procurement Director"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Company Name</label>
                    <input
                      type="text"
                      value={editTestimonial.company || ''}
                      onChange={(e) => setEditTestimonial({ ...editTestimonial, company: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                      placeholder="e.g. Al-Mansoori Grains"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Location / Country</label>
                    <input
                      type="text"
                      value={editTestimonial.location || ''}
                      onChange={(e) => setEditTestimonial({ ...editTestimonial, location: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                      placeholder="e.g. Dubai, UAE"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Review Content Description</label>
                  <textarea
                    rows={4}
                    required
                    value={editTestimonial.review || ''}
                    onChange={(e) => setEditTestimonial({ ...editTestimonial, review: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary resize-none"
                    placeholder="Write client feedback verbatim here..."
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Reviewer Photo (Optional)</label>
                  <ImageUploadInput
                    value={editTestimonial.imageUrl || ''}
                    onChange={(url) => setEditTestimonial({ ...editTestimonial, imageUrl: url })}
                    folder="partners"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-accent/40">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Display order</label>
                    <input
                      type="number"
                      required
                      value={editTestimonial.order ?? 0}
                      onChange={(e) => setEditTestimonial({ ...editTestimonial, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold mt-6">
                      <input
                        type="checkbox"
                        checked={editTestimonial.isEnabled ?? true}
                        onChange={(e) => setEditTestimonial({ ...editTestimonial, isEnabled: e.target.checked })}
                        className="h-4 w-4 text-primary"
                      />
                      Enable Review Visibility on Site
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-accent">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3.5 bg-primary text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    {saving ? 'Saving...' : 'Save Testimonial'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditTestimonial(null)}
                    className="px-8 py-3.5 border border-accent hover:bg-bg-secondary font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* T8: INQUIRIES REGISTER */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="bg-white border border-accent p-6 shadow-premium">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-accent pb-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-text-primary">CRM Leads & Client Inquiries</h3>
                  <p className="text-xs text-text-secondary mt-1">Review, track status, and export trade leads inquiries.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportExcel}
                    className="px-3.5 py-2 border border-[#06402b] text-[#06402b] hover:bg-[#06402b] hover:text-white font-sans text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Export Excel
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="px-3.5 py-2 bg-primary text-white hover:bg-primary-light font-sans text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-text-muted">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, email, query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                  />
                </div>

                <div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                  >
                    <option value="all">Filter: All Leads</option>
                    <option value="New">Status: New</option>
                    <option value="Read">Status: Read</option>
                    <option value="Contacted">Status: Contacted</option>
                    <option value="Responded">Status: Responded</option>
                    <option value="Closed">Status: Closed</option>
                  </select>
                </div>

                <div className="flex items-center justify-end text-[10px] text-text-secondary font-sans font-semibold uppercase">
                  Active Leads Count: {inquiries.length}
                </div>
              </div>

              {(() => {
                const filteredInquiries = inquiries.filter(inq => {
                  // search match
                  const searchLower = searchQuery.toLowerCase()
                  const matchesSearch = !searchQuery || 
                    inq.name.toLowerCase().includes(searchLower) ||
                    inq.email.toLowerCase().includes(searchLower) ||
                    inq.phone.toLowerCase().includes(searchLower) ||
                    inq.message.toLowerCase().includes(searchLower) ||
                    (inq.company && inq.company.toLowerCase().includes(searchLower)) ||
                    (inq.country && inq.country.toLowerCase().includes(searchLower))

                  // status match
                  const actualStatus = inq.status || (inq.isRead ? 'Read' : 'New')
                  const matchesStatus = filterStatus === 'all' || actualStatus === filterStatus

                  return matchesSearch && matchesStatus
                })

                if (filteredInquiries.length === 0) {
                  return (
                    <div className="text-center py-10 text-xs text-text-muted">
                      No inquiries matching active filters found in the registry.
                    </div>
                  )
                }

                return (
                  <div className="space-y-6">
                    {filteredInquiries.map((inq) => {
                      const currentStatus = inq.status || (inq.isRead ? 'Read' : 'New')
                      return (
                        <div
                          key={inq.id}
                          className={`border p-5 relative transition-colors ${
                            currentStatus === 'New' 
                              ? 'border-red-300 bg-red-50/5' 
                              : currentStatus === 'Closed' 
                                ? 'border-accent bg-bg-secondary/10 opacity-70' 
                                : 'border-accent bg-bg-secondary/20'
                          }`}
                        >
                          <span className="absolute right-4 top-4 text-[10px] text-text-muted font-mono" suppressHydrationWarning>
                            {formatDateTime(inq.createdAt)}
                          </span>

                          <div className="flex flex-col gap-2 max-w-3xl">
                            <div>
                              <span className="font-sans font-bold text-sm text-text-primary text-base">{inq.name}</span>
                              <div className="text-xs text-text-secondary mt-1 flex flex-wrap gap-x-4 gap-y-1 font-sans">
                                <span>Email: <a href={`mailto:${inq.email}`} className="text-primary hover:underline">{inq.email}</a></span>
                                <span>Phone: <a href={`tel:${inq.phone}`} className="text-primary hover:underline">{inq.phone}</a></span>
                                {inq.company && <span>Company: {inq.company}</span>}
                                {inq.state && <span>State: {inq.state}</span>}
                                {inq.country && <span>Country: {inq.country}</span>}
                              </div>
                            </div>

                            <div className="mt-2 text-xs font-sans text-primary font-bold">
                              Commodity Interest: {inq.productInterest || 'General Inquiry'}
                            </div>

                            <p className="mt-2 text-xs leading-relaxed text-text-secondary bg-bg-secondary/40 p-3 border border-accent/20 font-sans">
                              {inq.message}
                            </p>

                            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-accent/30">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary">Lead Status:</span>
                                <select
                                  value={currentStatus}
                                  onChange={async (e) => {
                                    const newStatus = e.target.value
                                    try {
                                      const res = await fetch('/api/admin/inquiries', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ id: inq.id, status: newStatus }),
                                      })
                                      if (!res.ok) throw new Error()
                                      setInquiries(prev => prev.map(item => item.id === inq.id ? { ...item, status: newStatus, isRead: newStatus !== 'New' } : item))
                                      showToast('success', `Lead status updated to ${newStatus}`)
                                    } catch {
                                      showToast('error', 'Failed to update lead status')
                                    }
                                  }}
                                  className="px-2 py-1 border border-accent bg-bg-secondary text-[11px] rounded-none text-text-primary font-semibold"
                                >
                                  <option value="New">New</option>
                                  <option value="Read">Read</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Responded">Responded</option>
                                  <option value="Closed">Closed</option>
                                </select>
                              </div>

                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="px-3.5 py-1.5 border border-accent hover:border-red-500 text-text-primary hover:text-red-500 text-[10px] uppercase font-bold tracking-wider transition-colors"
                              >
                                Delete Message
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          </div>
        )}
        {/* T9: GALLERY MANAGER */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            {!editGalleryImage ? (
              <div className="bg-white border border-accent p-6 shadow-premium">
                <div className="flex justify-between items-center mb-6 border-b border-accent pb-3">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-text-primary">Gallery Image Manager</h3>
                    <p className="text-xs text-text-secondary mt-1">Add, edit, and remove images shown on the public Gallery page.</p>
                  </div>
                  <button
                    onClick={() => setEditGalleryImage({ title: '', caption: '', url: '', category: 'General', order: gallery.length, isEnabled: true })}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Image
                  </button>
                </div>

                {gallery.length === 0 ? (
                  <div className="text-center py-16 text-text-muted font-sans text-sm border border-dashed border-accent/60">
                    No gallery images yet. Click <strong>Add Image</strong> to upload your first photo.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.map(img => (
                      <div key={img.id} className={`border p-3 space-y-3 transition-colors ${img.isEnabled ? 'border-accent' : 'border-accent/30 opacity-60'}`}>
                        {/* Thumbnail */}
                        <div className="relative aspect-[4/3] w-full bg-bg-secondary overflow-hidden">
                          <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                          <span className={`absolute top-2 right-2 text-[9px] uppercase font-bold px-1.5 py-0.5 ${img.isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                            {img.isEnabled ? 'Live' : 'Hidden'}
                          </span>
                        </div>

                        {/* Info */}
                        <div>
                          <span className="font-serif font-bold text-sm text-text-primary block">{img.title}</span>
                          {img.caption && <span className="text-[11px] text-text-secondary block mt-0.5">{img.caption}</span>}
                          <span className="text-[10px] uppercase tracking-wider text-secondary font-bold font-sans block mt-1">{img.category}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2 border-t border-accent/40">
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/admin/gallery', {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: img.id, isEnabled: !img.isEnabled }),
                                })
                                if (!res.ok) throw new Error()
                                setGallery(prev => prev.map(g => g.id === img.id ? { ...g, isEnabled: !img.isEnabled } : g))
                                showToast('success', 'Gallery image visibility updated')
                              } catch {
                                showToast('error', 'Failed to update visibility')
                              }
                            }}
                            className="flex-1 px-2 py-1.5 border border-accent hover:border-primary text-[10px] uppercase font-bold tracking-wider transition-colors"
                          >
                            {img.isEnabled ? 'Hide' : 'Show'}
                          </button>
                          <button
                            onClick={() => setEditGalleryImage(img)}
                            className="p-2 border border-accent hover:border-primary text-text-primary hover:text-primary transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm('Delete this gallery image?')) return
                              try {
                                const res = await fetch(`/api/admin/gallery?id=${img.id}`, {
                                  method: 'DELETE',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: img.id }),
                                })
                                if (!res.ok) throw new Error()
                                setGallery(prev => prev.filter(g => g.id !== img.id))
                                showToast('success', 'Gallery image deleted')
                              } catch {
                                showToast('error', 'Failed to delete image')
                              }
                            }}
                            className="p-2 border border-accent hover:border-red-500 text-text-primary hover:text-red-500 transition-colors"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!editGalleryImage?.url || !editGalleryImage?.title) {
                    showToast('error', 'Title and image are required')
                    return
                  }
                  setSaving(true)
                  try {
                    const isNew = !editGalleryImage.id
                    const res = await fetch('/api/admin/gallery', {
                      method: isNew ? 'POST' : 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(editGalleryImage),
                    })
                    if (!res.ok) throw new Error()
                    const resData = await res.json()
                    const saved = resData.image || resData
                    if (isNew) {
                      setGallery(prev => [...prev, saved])
                    } else {
                      setGallery(prev => prev.map(g => (g.id === saved.id || g.id === editGalleryImage.id) ? { ...g, ...saved } : g))
                    }
                    setEditGalleryImage(null)
                    showToast('success', `Gallery image ${isNew ? 'added' : 'updated'} successfully`)
                  } catch {
                    showToast('error', 'Failed to save gallery image')
                  } finally {
                    setSaving(false)
                  }
                }}
                className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6 max-w-4xl"
              >
                <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">
                  {editGalleryImage.id ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Image Title / Heading</label>
                    <input
                      type="text"
                      required
                      value={editGalleryImage.title || ''}
                      onChange={(e) => setEditGalleryImage({ ...editGalleryImage, title: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary font-semibold"
                      placeholder="e.g. Red Kidney Beans Export Batch"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Category Label</label>
                    <input
                      type="text"
                      value={editGalleryImage.category || ''}
                      onChange={(e) => setEditGalleryImage({ ...editGalleryImage, category: e.target.value })}
                      className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                      placeholder="e.g. Products, Operations, Logistics"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Image Caption (Optional)</label>
                  <input
                    type="text"
                    value={editGalleryImage.caption || ''}
                    onChange={(e) => setEditGalleryImage({ ...editGalleryImage, caption: e.target.value })}
                    className="w-full px-4 py-3 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                    placeholder="Short description shown under the image..."
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Gallery Image Upload</label>
                  <ImageUploadInput
                    value={editGalleryImage.url || ''}
                    onChange={(url) => setEditGalleryImage({ ...editGalleryImage, url })}
                    folder="gallery"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-accent/40">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-2">Display Order</label>
                    <input
                      type="number"
                      value={editGalleryImage.order ?? 0}
                      onChange={(e) => setEditGalleryImage({ ...editGalleryImage, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-2.5 border border-accent bg-bg-secondary text-sm rounded-none text-text-primary"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold mt-6">
                      <input
                        type="checkbox"
                        checked={editGalleryImage.isEnabled ?? true}
                        onChange={(e) => setEditGalleryImage({ ...editGalleryImage, isEnabled: e.target.checked })}
                        className="h-4 w-4 text-primary"
                      />
                      Publish Image on Live Gallery Page
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-accent">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3.5 bg-primary text-white font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    {saving ? 'Saving...' : 'Save Gallery Image'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditGalleryImage(null)}
                    className="px-8 py-3.5 border border-accent hover:bg-bg-secondary font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        {/* T10: ABOUT US PAGE MANAGER */}
        {activeTab === 'about-us-page-settings' && (
          <div className="space-y-8 max-w-4xl">
            {/* Sub-form 1: Profile & Core Operations */}
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setSaving(true)
                try {
                  const updated = { ...settings, aboutCards: JSON.stringify(aboutCards) }
                  const res = await fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                  })
                  if (!res.ok) throw new Error()
                  setSettings(updated)
                  showToast('success', 'About Page sections updated successfully')
                  router.refresh()
                } catch {
                  showToast('error', 'Failed to update About sections')
                } finally {
                  setSaving(false)
                }
              }}
              className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6"
            >
              <div className="flex justify-between items-center border-b border-accent pb-2">
                <h3 className="text-xl font-serif font-bold text-text-primary">About Page Main Content</h3>
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.aboutSectionEnabled}
                    onChange={(e) => setSettings({ ...settings, aboutSectionEnabled: e.target.checked })}
                    className="h-4 w-4 text-primary"
                  />
                  Enable Page
                </label>
              </div>

              {/* Corporate Profile Banner */}
              <div className="border border-accent/60 p-4 space-y-4">
                <h4 className="font-serif font-bold text-sm text-text-primary border-b border-accent pb-1">Corporate Profile Banner</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Small Label / Eyebrow</label>
                    <input
                      type="text"
                      value={settings.aboutCorporateProfileLabel || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCorporateProfileLabel: e.target.value })}
                      className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Main Heading</label>
                    <input
                      type="text"
                      value={settings.aboutCorporateProfileTitle || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCorporateProfileTitle: e.target.value })}
                      className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Overview Description</label>
                  <textarea
                    rows={2}
                    value={settings.aboutCorporateProfileDesc || ''}
                    onChange={(e) => setSettings({ ...settings, aboutCorporateProfileDesc: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Corporate Header Image</label>
                  <ImageUploadInput
                    value={settings.aboutCorporateProfileImage || ''}
                    onChange={(url) => setSettings({ ...settings, aboutCorporateProfileImage: url })}
                    folder="logo"
                  />
                </div>
              </div>

              {/* Core Operations Header */}
              <div className="border border-accent/60 p-4 space-y-4">
                <h4 className="font-serif font-bold text-sm text-text-primary border-b border-accent pb-1">Core Operations Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Operations Label</label>
                    <input
                      type="text"
                      value={settings.aboutCoreOperationsLabel || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCoreOperationsLabel: e.target.value })}
                      className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Operations Heading</label>
                    <input
                      type="text"
                      value={settings.aboutCoreOperationsTitle || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCoreOperationsTitle: e.target.value })}
                      className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Left Description Block</label>
                    <textarea
                      rows={4}
                      value={settings.aboutCoreOperationsDesc1 || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCoreOperationsDesc1: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Right Description Block</label>
                    <textarea
                      rows={4}
                      value={settings.aboutCoreOperationsDesc2 || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCoreOperationsDesc2: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Call To Action Settings */}
              <div className="border border-accent/60 p-4 space-y-4">
                <h4 className="font-serif font-bold text-sm text-text-primary border-b border-accent pb-1">Call To Action Banner Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">CTA Label</label>
                    <input
                      type="text"
                      value={settings.aboutCtaLabel || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCtaLabel: e.target.value })}
                      className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">CTA Main Title Heading</label>
                    <input
                      type="text"
                      value={settings.aboutCtaTitle || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCtaTitle: e.target.value })}
                      className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">CTA Supporting Description</label>
                  <textarea
                    rows={2}
                    value={settings.aboutCtaDesc || ''}
                    onChange={(e) => setSettings({ ...settings, aboutCtaDesc: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Primary Button Label</label>
                    <input
                      type="text"
                      value={settings.aboutCtaPrimaryText || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCtaPrimaryText: e.target.value })}
                      className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Primary Button URL Link</label>
                    <input
                      type="text"
                      value={settings.aboutCtaPrimaryLink || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCtaPrimaryLink: e.target.value })}
                      className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Secondary Button Label</label>
                    <input
                      type="text"
                      value={settings.aboutCtaSecondaryText || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCtaSecondaryText: e.target.value })}
                      className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Secondary Button URL Link</label>
                    <input
                      type="text"
                      value={settings.aboutCtaSecondaryLink || ''}
                      onChange={(e) => setSettings({ ...settings, aboutCtaSecondaryLink: e.target.value })}
                      className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">CTA Background Image Overlay</label>
                  <ImageUploadInput
                    value={settings.aboutCtaBgImage || ''}
                    onChange={(url) => setSettings({ ...settings, aboutCtaBgImage: url })}
                    folder="logo"
                  />
                </div>
              </div>

              {/* SAVE BUTTON FOR GENERAL SECTION */}
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 w-full"
              >
                {saving ? 'Saving...' : 'Save About Page Content'}
              </button>
            </form>

            {/* Philosophy / Operations Pillars Cards CRUD */}
            <div className="bg-white border border-accent p-6 shadow-premium space-y-4">
              <div className="flex justify-between items-center border-b border-accent pb-3">
                <div>
                  <h4 className="font-serif font-bold text-lg text-text-primary">Business Philosophy & Core Operations Cards</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Manage the cards displayed on the About Us page layout.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditAboutCard({ id: Date.now().toString(), title: '', description: '', icon: 'Landmark', customSvg: '', imageUrl: '', isEnabled: true, order: aboutCards.length })}
                  className="px-3 py-1.5 bg-secondary text-[#032318] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Card
                </button>
              </div>

              {/* Cards Form */}
              {editAboutCard && (
                <div className="border border-secondary p-4 space-y-4 bg-bg-secondary mb-4">
                  <h5 className="font-serif font-bold text-sm text-text-primary">{editAboutCard.title ? 'Edit Card' : 'New Card'}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Card Heading Title</label>
                      <input
                        type="text"
                        required
                        value={editAboutCard.title || ''}
                        onChange={(e) => setEditAboutCard({ ...editAboutCard, title: e.target.value })}
                        className="w-full px-3 py-2.5 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Preset Icon</label>
                      <select
                        value={editAboutCard.icon || ''}
                        onChange={(e) => setEditAboutCard({ ...editAboutCard, icon: e.target.value, customSvg: '', imageUrl: '' })}
                        className="w-full px-3 py-2.5 border border-accent bg-white text-xs rounded-none text-text-primary"
                      >
                        <option value="Landmark">Landmark / Capital</option>
                        <option value="Compass">Compass / Logistics</option>
                        <option value="Award">Award / Quality</option>
                        <option value="ShieldCheck">Shield / Trust</option>
                        <option value="Mail">Mail / Contact</option>
                        <option value="Phone">Phone / Support</option>
                        <option value="HelpCircle">Help Circle</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Card Description</label>
                    <textarea
                      rows={2}
                      required
                      value={editAboutCard.description || ''}
                      onChange={(e) => setEditAboutCard({ ...editAboutCard, description: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-accent/40 pt-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Custom SVG Code (Overrides Preset Icon)</label>
                      <textarea
                        rows={2}
                        value={editAboutCard.customSvg || ''}
                        onChange={(e) => setEditAboutCard({ ...editAboutCard, customSvg: e.target.value, imageUrl: '' })}
                        className="w-full px-3 py-2 border border-accent bg-white text-[10px] rounded-none text-text-primary font-mono"
                        placeholder="<svg ...>...</svg>"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Custom Image Icon (Overrides SVG & Preset)</label>
                      <ImageUploadInput
                        value={editAboutCard.imageUrl || ''}
                        onChange={(url) => setEditAboutCard({ ...editAboutCard, imageUrl: url, customSvg: '' })}
                        folder="logo"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Display Sequence Order</label>
                      <input
                        type="number"
                        value={editAboutCard.order ?? 0}
                        onChange={(e) => setEditAboutCard({ ...editAboutCard, order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold mt-4">
                        <input
                          type="checkbox"
                          checked={editAboutCard.isEnabled ?? true}
                          onChange={(e) => setEditAboutCard({ ...editAboutCard, isEnabled: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        Publish Card Live
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!editAboutCard.title || !editAboutCard.description) {
                          showToast('error', 'Title and description are required')
                          return
                        }
                        setAboutCards(prev => {
                          const idx = prev.findIndex(c => c.id === editAboutCard.id)
                          if (idx > -1) {
                            return prev.map(c => c.id === editAboutCard.id ? editAboutCard : c)
                          } else {
                            return [...prev, editAboutCard]
                          }
                        })
                        setEditAboutCard(null)
                        showToast('success', 'Card details updated locally. Save content to apply changes live.')
                      }}
                      className="px-4 py-2 bg-primary text-white font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      Apply Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditAboutCard(null)}
                      className="px-4 py-2 border border-accent hover:bg-white text-text-primary font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Pillars list */}
              {aboutCards.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-xs font-sans">No custom cards found. Using default.</div>
              ) : (
                <div className="space-y-2">
                  {aboutCards.sort((a, b) => (a.order || 0) - (b.order || 0)).map((card, i) => (
                    <div key={card.id || i} className={`flex justify-between items-center p-3 border border-accent ${card.isEnabled ? 'bg-white' : 'bg-accent/20 opacity-60'}`}>
                      <div>
                        <span className="font-serif font-bold text-sm text-text-primary block">{card.title}</span>
                        <span className="text-[10px] text-text-secondary block truncate max-w-lg mt-0.5">{card.description}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-secondary mt-1 block">
                          Icon: {card.icon} {card.imageUrl && ' (Image Icon)'} {card.customSvg && ' (Custom SVG)'} — Order: {card.order ?? 0}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setEditAboutCard(card)}
                          className="p-1.5 border border-accent text-text-primary hover:text-primary hover:border-primary"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!confirm('Delete this card?')) return
                            setAboutCards(prev => prev.filter(c => c.id !== card.id))
                            showToast('success', 'Card removed locally. Click Save Content to save changes live.')
                          }}
                          className="p-1.5 border border-accent text-text-primary hover:text-red-600 hover:border-red-600"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* T11: INQUIRY FORM BUILDER */}
        {activeTab === 'inquiry-form-settings' && (
          <div className="space-y-8 max-w-4xl">
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setSaving(true)
                try {
                  const updated = { ...settings, formFields: JSON.stringify(formFields) }
                  const res = await fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                  })
                  if (!res.ok) throw new Error()
                  setSettings(updated)
                  showToast('success', 'Inquiry Form Builder settings saved successfully')
                  router.refresh()
                } catch {
                  showToast('error', 'Failed to save form fields configuration')
                } finally {
                  setSaving(false)
                }
              }}
              className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6"
            >
              <h3 className="text-xl font-serif font-bold text-text-primary border-b border-accent pb-2">Inquiry Form Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Form Heading Title</label>
                  <input
                    type="text"
                    value={settings.contactFormTitle || ''}
                    onChange={(e) => setSettings({ ...settings, contactFormTitle: e.target.value })}
                    className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Submit Button Label Text</label>
                  <input
                    type="text"
                    value={settings.contactBtnText || ''}
                    onChange={(e) => setSettings({ ...settings, contactBtnText: e.target.value })}
                    className="w-full px-3 py-2.5 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Form Supporting Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.contactFormSubtitle || ''}
                  onChange={(e) => setSettings({ ...settings, contactFormSubtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Inquiry Success Alert Message</label>
                  <textarea
                    rows={2}
                    value={settings.contactSuccessMsg || ''}
                    onChange={(e) => setSettings({ ...settings, contactSuccessMsg: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Inquiry Error Alert Message</label>
                  <textarea
                    rows={2}
                    value={settings.contactErrorMsg || ''}
                    onChange={(e) => setSettings({ ...settings, contactErrorMsg: e.target.value })}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                  />
                </div>
              </div>

              {/* SAVE FORM CONFIG BUTTON */}
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 w-full"
              >
                {saving ? 'Saving...' : 'Save Form Configurations'}
              </button>
            </form>

            {/* Form Fields checklist */}
            <div className="bg-white border border-accent p-6 shadow-premium space-y-4">
              <div className="flex justify-between items-center border-b border-accent pb-3">
                <div>
                  <h4 className="font-serif font-bold text-lg text-text-primary">Inquiry Form Fields</h4>
                  <p className="text-xs text-text-secondary mt-0.5">Define, edit, and reorder fields inside the Inquiry Form dynamically.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditFormField({ id: 'field_' + Date.now().toString(), label: '', type: 'text', placeholder: '', required: false, enabled: true, options: '', helpText: '', order: formFields.length })}
                  className="px-3 py-1.5 bg-secondary text-[#032318] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Field
                </button>
              </div>

              {/* Edit Form Field Modal Form */}
              {editFormField && (
                <div className="border border-secondary p-4 space-y-4 bg-bg-secondary mb-4">
                  <h5 className="font-serif font-bold text-sm text-text-primary">{editFormField.label ? 'Edit Field' : 'New Form Field'}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Field Unique ID</label>
                      <input
                        type="text"
                        required
                        disabled={['name', 'email', 'phone', 'message', 'productInterest', 'country', 'state'].includes(editFormField.id)}
                        value={editFormField.id || ''}
                        onChange={(e) => setEditFormField({ ...editFormField, id: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                        className="w-full px-3 py-2.5 border border-accent bg-white text-xs rounded-none text-text-primary font-semibold disabled:bg-accent/40"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Field Type</label>
                      <select
                        value={editFormField.type || ''}
                        onChange={(e) => setEditFormField({ ...editFormField, type: e.target.value })}
                        className="w-full px-3 py-2.5 border border-accent bg-white text-xs rounded-none text-text-primary"
                      >
                        <option value="text">Text Input</option>
                        <option value="email">Email Input</option>
                        <option value="tel">Telephone / Phone Input</option>
                        <option value="number">Number Input</option>
                        <option value="textarea">Textarea Block</option>
                        <option value="select">Dropdown Select Menu</option>
                        <option value="country">Country Autocomplete/Select</option>
                        <option value="state">State Autocomplete/Select</option>
                        <option value="checkbox">Single Checkbox Check</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Field Display Sequence</label>
                      <input
                        type="number"
                        value={editFormField.order ?? 0}
                        onChange={(e) => setEditFormField({ ...editFormField, order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-accent bg-white text-xs rounded-none text-text-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Field Label</label>
                      <input
                        type="text"
                        required
                        value={editFormField.label || ''}
                        onChange={(e) => setEditFormField({ ...editFormField, label: e.target.value })}
                        className="w-full px-3 py-2.5 border border-accent bg-white text-xs rounded-none text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Placeholder Text</label>
                      <input
                        type="text"
                        value={editFormField.placeholder || ''}
                        onChange={(e) => setEditFormField({ ...editFormField, placeholder: e.target.value })}
                        className="w-full px-3 py-2.5 border border-accent bg-white text-xs rounded-none text-text-primary"
                      />
                    </div>
                  </div>

                  {editFormField.type === 'select' && editFormField.id !== 'productInterest' && (
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Dropdown Options (Comma separated list)</label>
                      <input
                        type="text"
                        value={editFormField.options || ''}
                        onChange={(e) => setEditFormField({ ...editFormField, options: e.target.value })}
                        className="w-full px-3 py-2.5 border border-accent bg-white text-xs rounded-none text-text-primary"
                        placeholder="e.g. Retailer, Importer, Wholesaler, Broker"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Help Text / Sub-text</label>
                      <input
                        type="text"
                        value={editFormField.helpText || ''}
                        onChange={(e) => setEditFormField({ ...editFormField, helpText: e.target.value })}
                        className="w-full px-3 py-2.5 border border-accent bg-white text-xs rounded-none text-text-primary"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold mt-4">
                        <input
                          type="checkbox"
                          checked={editFormField.required ?? false}
                          onChange={(e) => setEditFormField({ ...editFormField, required: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        Mark as Required Field
                      </label>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold mt-4">
                        <input
                          type="checkbox"
                          checked={editFormField.enabled ?? true}
                          onChange={(e) => setEditFormField({ ...editFormField, enabled: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        Enable Field (Render on Live Form)
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!editFormField.id || !editFormField.label) {
                          showToast('error', 'Field ID and label are required')
                          return
                        }
                        setFormFields(prev => {
                          const idx = prev.findIndex(f => f.id === editFormField.id)
                          if (idx > -1) {
                            return prev.map(f => f.id === editFormField.id ? editFormField : f)
                          } else {
                            return [...prev, editFormField]
                          }
                        })
                        setEditFormField(null)
                        showToast('success', 'Field settings updated locally. Click Save Form Configurations to save live.')
                      }}
                      className="px-4 py-2 bg-primary text-white font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      Apply Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFormField(null)}
                      className="px-4 py-2 border border-accent hover:bg-white text-text-primary font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Fields List */}
              <div className="space-y-2">
                {formFields.sort((a, b) => (a.order || 0) - (b.order || 0)).map((field, idx) => {
                  const isCore = ['name', 'email', 'phone', 'message', 'productInterest', 'country', 'state'].includes(field.id)
                  return (
                    <div key={field.id || idx} className={`flex justify-between items-center p-3 border border-accent ${field.enabled ? 'bg-white' : 'bg-accent/20 opacity-60'}`}>
                      <div>
                        <span className="font-serif font-bold text-sm text-text-primary block">
                          {field.label} {field.required && <span className="text-red-500 font-sans">*</span>}
                        </span>
                        <span className="text-[10px] text-text-secondary block mt-0.5">
                          ID: <strong className="font-mono text-primary">{field.id}</strong> — Type: <strong>{field.type}</strong> — Order: {field.order ?? 0}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setEditFormField(field)}
                          className="p-1.5 border border-accent text-text-primary hover:text-primary hover:border-primary"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        {!isCore && (
                          <button
                            type="button"
                            onClick={() => {
                              if (!confirm('Delete this custom field?')) return
                              setFormFields(prev => prev.filter(f => f.id !== field.id))
                              showToast('success', 'Field removed locally. Click Save Form Configurations to apply live.')
                            }}
                            className="p-1.5 border border-accent text-text-primary hover:text-red-600 hover:border-red-600"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* T12: FOOTER NAVIGATION LINKS & CATEGORIES */}
        {activeTab === 'footer-links-settings' && (
          <div className="space-y-8 max-w-4xl">
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setSaving(true)
                try {
                  const updated = { ...settings, footerCategories: JSON.stringify(footerCategories) }
                  const res = await fetch('/api/admin/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updated),
                  })
                  if (!res.ok) throw new Error()
                  setSettings(updated)
                  showToast('success', 'Footer navigation layout saved successfully')
                  router.refresh()
                } catch {
                  showToast('error', 'Failed to save footer navigation layout')
                } finally {
                  setSaving(false)
                }
              }}
              className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6"
            >
              <div className="flex justify-between items-center border-b border-accent pb-3">
                <div>
                  <h3 className="text-xl font-serif font-bold text-text-primary">Footer Navigation Manager</h3>
                  <p className="text-xs text-text-secondary mt-0.5">Define link columns and manage nested quick navigation links dynamically.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditFooterCategory({ id: 'cat_' + Date.now().toString(), name: '', order: footerCategories.length, links: [] })}
                  className="px-3 py-1.5 bg-secondary text-[#032318] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Add Category Column
                </button>
              </div>

              {/* Edit/New Category Form */}
              {editFooterCategory && (
                <div className="border border-secondary p-4 space-y-4 bg-bg-secondary mb-4">
                  <h5 className="font-serif font-bold text-sm text-text-primary">{editFooterCategory.name ? 'Edit Category' : 'New Category Column'}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Category Column Name</label>
                      <input
                        type="text"
                        required
                        value={editFooterCategory.name || ''}
                        onChange={(e) => setEditFooterCategory({ ...editFooterCategory, name: e.target.value })}
                        className="w-full px-3 py-2 border border-accent bg-white text-xs text-text-primary rounded-none font-semibold"
                        placeholder="e.g. Quick Links"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Column Order Sequence</label>
                      <input
                        type="number"
                        value={editFooterCategory.order ?? 0}
                        onChange={(e) => setEditFooterCategory({ ...editFooterCategory, order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-accent bg-white text-xs text-text-primary rounded-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!editFooterCategory.name) {
                          showToast('error', 'Category name is required')
                          return
                        }
                        setFooterCategories(prev => {
                          const idx = prev.findIndex(c => c.id === editFooterCategory.id)
                          if (idx > -1) {
                            return prev.map(c => c.id === editFooterCategory.id ? { ...c, name: editFooterCategory.name, order: editFooterCategory.order } : c)
                          } else {
                            return [...prev, editFooterCategory]
                          }
                        })
                        setEditFooterCategory(null)
                        showToast('success', 'Category updated locally. Save Layout to apply live.')
                      }}
                      className="px-4 py-1.5 bg-primary text-white font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      Apply Category
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFooterCategory(null)}
                      className="px-4 py-1.5 border border-accent hover:bg-white text-text-primary font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Edit/New Nested Link Form */}
              {editFooterLink && (
                <div className="border border-secondary p-4 space-y-4 bg-bg-secondary mb-4">
                  <h5 className="font-serif font-bold text-sm text-text-primary">{editFooterLink.label ? 'Edit Link' : 'New Link'}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Link Label Text</label>
                      <input
                        type="text"
                        required
                        value={editFooterLink.label || ''}
                        onChange={(e) => setEditFooterLink({ ...editFooterLink, label: e.target.value })}
                        className="w-full px-3 py-2 border border-accent bg-white text-xs text-text-primary rounded-none font-semibold"
                        placeholder="e.g. Products Portfolio"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">URL Target Address</label>
                      <input
                        type="text"
                        required
                        value={editFooterLink.url || ''}
                        onChange={(e) => setEditFooterLink({ ...editFooterLink, url: e.target.value })}
                        className="w-full px-3 py-2 border border-accent bg-white text-xs text-text-primary rounded-none"
                        placeholder="e.g. /products"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Display Order</label>
                      <input
                        type="number"
                        value={editFooterLink.order ?? 0}
                        onChange={(e) => setEditFooterLink({ ...editFooterLink, order: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-accent bg-white text-xs text-text-primary rounded-none"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold mt-4">
                        <input
                          type="checkbox"
                          checked={editFooterLink.openInNewTab ?? false}
                          onChange={(e) => setEditFooterLink({ ...editFooterLink, openInNewTab: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        Open in New Tab
                      </label>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer font-sans text-xs uppercase tracking-wider font-semibold mt-4">
                        <input
                          type="checkbox"
                          checked={editFooterLink.isEnabled ?? true}
                          onChange={(e) => setEditFooterLink({ ...editFooterLink, isEnabled: e.target.checked })}
                          className="h-4 w-4 text-primary"
                        />
                        Enable Link Live
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!editFooterLink.label || !editFooterLink.url) {
                          showToast('error', 'Label and URL are required')
                          return
                        }
                        const targetCatId = editFooterLink.categoryId
                        setFooterCategories(prev => prev.map(c => {
                          if (c.id === targetCatId) {
                            const linkList = c.links || []
                            const idx = linkList.findIndex((l: any) => l.id === editFooterLink.id)
                            let updatedLinks = []
                            if (idx > -1) {
                              updatedLinks = linkList.map((l: any) => l.id === editFooterLink.id ? editFooterLink : l)
                            } else {
                              updatedLinks = [...linkList, editFooterLink]
                            }
                            return { ...c, links: updatedLinks }
                          }
                          return c
                        }))
                        setEditFooterLink(null)
                        showToast('success', 'Link updated locally. Click Save Layout to persist.')
                      }}
                      className="px-4 py-1.5 bg-primary text-white font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      Apply Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFooterLink(null)}
                      className="px-4 py-1.5 border border-accent hover:bg-white text-text-primary font-sans text-xs font-bold uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Display categories lists */}
              {footerCategories.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-xs">No footer categories defined yet.</div>
              ) : (
                <div className="space-y-6">
                  {footerCategories.sort((a, b) => (a.order || 0) - (b.order || 0)).map((cat, cIdx) => (
                    <div key={cat.id || cIdx} className="border border-accent/60 p-4 space-y-4 bg-bg-secondary/20">
                      <div className="flex justify-between items-center border-b border-accent pb-2">
                        <div>
                          <span className="font-serif font-bold text-base text-text-primary">{cat.name}</span>
                          <span className="text-[10px] text-text-secondary ml-3">Sequence Column Order: {cat.order ?? 0}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setEditFooterLink({ id: 'link_' + Date.now().toString(), categoryId: cat.id, label: '', url: '', isEnabled: true, order: (cat.links || []).length, openInNewTab: false })}
                            className="text-[10px] font-bold uppercase text-primary hover:underline"
                          >
                            + Add Link
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditFooterCategory(cat)}
                            className="p-1 text-text-primary hover:text-primary"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!confirm('Delete this entire column category? Links inside will be removed.')) return
                              setFooterCategories(prev => prev.filter(c => c.id !== cat.id))
                              showToast('success', 'Category removed locally. Click Save Layout to apply.')
                            }}
                            className="p-1 text-text-primary hover:text-red-600"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Category Links list */}
                      {(cat.links || []).length === 0 ? (
                        <p className="text-[10px] text-text-muted italic">No links in this category column yet.</p>
                      ) : (
                        <div className="space-y-1.5 pl-3 border-l-2 border-primary/20">
                          {(cat.links || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((link: any, lIdx: number) => (
                            <div key={link.id || lIdx} className={`flex justify-between items-center p-2 border border-accent bg-white text-xs ${link.isEnabled ? '' : 'opacity-50 bg-accent/20'}`}>
                              <div>
                                <span className="font-semibold text-text-primary">{link.label}</span>
                                <span className="font-mono text-[10px] text-text-secondary ml-2">({link.url})</span>
                                <span className="text-[9px] text-secondary ml-3 font-bold">Order: {link.order ?? 0}</span>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => setEditFooterLink({ ...link, categoryId: cat.id })}
                                  className="p-1 hover:text-primary border border-accent"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFooterCategories(prev => prev.map(c => {
                                      if (c.id === cat.id) {
                                        return {
                                          ...c,
                                          links: (c.links || []).filter((l: any) => l.id !== link.id)
                                        }
                                      }
                                      return c
                                    }))
                                    showToast('success', 'Link removed locally. Save layout to apply live.')
                                  }}
                                  className="p-1 hover:text-red-500 border border-accent"
                                >
                                  <Trash className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Layout details */}
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 w-full mt-4"
              >
                {saving ? 'Saving...' : 'Save Footer Navigation Layout'}
              </button>
            </form>
          </div>
        )}

        {/* My Profile Section */}
        {activeTab === 'profile' && (
          <div className="space-y-8 max-w-2xl bg-white border border-accent p-6 md:p-8 shadow-premium text-text-primary">
            <h3 className="text-xl font-serif font-bold border-b border-accent pb-2">Admin Profile Management</h3>
            
            {/* Visual Account Badge Card */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-bg-secondary border border-accent/60 shadow-sm rounded-none">
              {/* Profile Image/Avatar with hover edit state */}
              <div className="relative group h-24 w-24 rounded-full overflow-hidden border-2 border-primary bg-bg-primary flex items-center justify-center shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={profileName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-serif font-bold text-primary">
                    {profileName ? profileName.charAt(0).toUpperCase() : 'A'}
                  </span>
                )}
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-[#032318]/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <label className="cursor-pointer text-[9px] uppercase font-bold tracking-widest text-secondary text-center px-1">
                    {profileLoading ? 'Uploading...' : 'Change Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={profileLoading}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setProfileLoading(true)
                        try {
                          const { uploadToCloudinaryBrowser } = await import('@/lib/firebaseClientOperations')
                          const newUrl = await uploadToCloudinaryBrowser(file, 'logo')
                          setProfileImage(newUrl)

                          const currentUser = auth.currentUser
                          if (currentUser) {
                            // Update user in Firestore client-side
                            const { doc, setDoc } = await import('firebase/firestore')
                            const userDocRef = doc(firestore, 'users', currentUser.uid)
                            await setDoc(userDocRef, { profileImageUrl: newUrl, updatedAt: new Date().toISOString() }, { merge: true })

                            // Update Firebase Auth profile photo
                            const { updateProfile } = await import('firebase/auth')
                            await updateProfile(currentUser, { photoURL: newUrl })
                            
                            showToast('success', 'Profile image updated successfully in Cloudinary')
                          }
                        } catch (err: any) {
                          showToast('error', err.message || 'Failed to update photo')
                        } finally {
                          setProfileLoading(false)
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Account Text info */}
              <div className="text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-lg font-serif font-bold text-text-primary">{profileName}</h4>
                  <span className="px-2 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
                    {profileRole}
                  </span>
                </div>
                <p className="text-xs text-text-secondary font-mono">{auth.currentUser?.email || ''}</p>
                <p className="text-[10px] text-text-secondary uppercase tracking-widest">
                  Administrator Profile
                </p>
              </div>
            </div>
            
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setProfileLoading(true)
                try {
                  const currentUser = auth.currentUser
                  if (!currentUser) throw new Error('No authenticated Firebase user found')

                  // Update display name in Firebase Auth
                  const { updateProfile } = await import('firebase/auth')
                  await updateProfile(currentUser, { displayName: profileName })

                  // Save name directly to Firestore (client-side, persists across refresh)
                  const { doc, setDoc } = await import('firebase/firestore')
                  await setDoc(doc(firestore, 'users', currentUser.uid), { name: profileName, updatedAt: new Date().toISOString() }, { merge: true })

                  showToast('success', 'Profile saved successfully')
                } catch (err: any) {
                  showToast('error', err.message || 'Failed to save profile')
                } finally {
                  setProfileLoading(false)
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Account Display Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary font-semibold"
                />
              </div>
              <button
                type="submit"
                disabled={profileLoading}
                className="px-4 py-2 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                Save Profile
              </button>
            </form>

            <div className="border-t border-accent/40 pt-6 space-y-6">
              <h4 className="font-serif font-bold text-lg text-text-primary border-b border-accent/20 pb-2">Change Password</h4>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!profilePassword || !profileNewPassword || !profileConfirmPassword) {
                    showToast('error', 'All password fields are required')
                    return
                  }
                  if (profileNewPassword !== profileConfirmPassword) {
                    showToast('error', 'New passwords do not match')
                    return
                  }
                  if (profileNewPassword.length < 6) {
                    showToast('error', 'New password must be at least 6 characters')
                    return
                  }

                  setProfileLoading(true)
                  try {
                    const currentUser = auth.currentUser
                    if (!currentUser) throw new Error('No authenticated Firebase user found')

                    const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth')
                    
                    // Re-authenticate user first using current password
                    const credential = EmailAuthProvider.credential(currentUser.email || '', profilePassword)
                    await reauthenticateWithCredential(currentUser, credential)

                    // Update password in Firebase Authentication
                    await updatePassword(currentUser, profileNewPassword)

                    showToast('success', 'Password updated successfully in Firebase Auth')
                    setProfilePassword('')
                    setProfileNewPassword('')
                    setProfileConfirmPassword('')
                  } catch (err: any) {
                    showToast('error', err.message || 'Failed to change password')
                  } finally {
                    setProfileLoading(false)
                  }
                }}
                className="space-y-4"
              >
                <div className="relative">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showProfilePassword ? "text" : "password"}
                      required
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowProfilePassword(!showProfilePassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      {showProfilePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">New Secure Password</label>
                  <div className="relative">
                    <input
                      type={showProfileNewPassword ? "text" : "password"}
                      required
                      value={profileNewPassword}
                      onChange={(e) => setProfileNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary pr-10"
                      placeholder="Enter new password (min. 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowProfileNewPassword(!showProfileNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      {showProfileNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Repeat New Password</label>
                  <div className="relative">
                    <input
                      type={showProfileConfirmPassword ? "text" : "password"}
                      required
                      value={profileConfirmPassword}
                      onChange={(e) => setProfileConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary pr-10"
                      placeholder="Repeat new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowProfileConfirmPassword(!showProfileConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    >
                      {showProfileConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-4 py-2 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  Save New Password
                </button>
              </form>
            </div>

            <div className="border-t border-accent/40 pt-6 space-y-6">
              <h4 className="font-serif font-bold text-lg text-text-primary border-b border-accent/20 pb-2">Request Email Change</h4>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!profileNewEmail) return
                  setProfileLoading(true)
                  try {
                    const currentUser = auth.currentUser
                    if (!currentUser) throw new Error('No authenticated Firebase user found')

                    const { verifyBeforeUpdateEmail } = await import('firebase/auth')
                    await verifyBeforeUpdateEmail(currentUser, profileNewEmail)

                    showToast('success', `Verification link sent to ${profileNewEmail}. Please click the link to confirm your email update, after which your login email will change.`)
                    setProfileNewEmail('')
                  } catch (err: any) {
                    if (err.code === 'auth/requires-recent-login') {
                      showToast('error', 'Security requirement: Please sign out and log back in to re-authenticate before modifying your login email.')
                    } else {
                      showToast('error', err.message || 'Failed to modify email')
                    }
                  } finally {
                    setProfileLoading(false)
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">New Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileNewEmail}
                    onChange={(e) => setProfileNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                    placeholder="new-email@company.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-4 py-2 bg-primary text-white hover:bg-primary-light font-sans text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                >
                  Save New Email
                </button>
              </form>
            </div>
          </div>
        )}

        {/* User Management Section */}
        {activeTab === 'users' && (
          <div className="space-y-8 max-w-6xl">
            {/* 1. Header controls */}
            <div className="flex justify-between items-center bg-white border border-accent p-6 shadow-premium">
              <div>
                <h3 className="text-xl font-serif font-bold text-text-primary">Administrators & Permissions</h3>
                <p className="text-xs text-text-secondary mt-0.5">Control administrative access privileges, statuses, and granular visibility profiles.</p>
              </div>
              <button
                onClick={() => {
                  setEditingUser(null)
                  setShowAddUser(true)
                }}
                className="px-4 py-2 bg-secondary text-[#032318] font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 hover:bg-white border border-secondary transition-all"
              >
                <Plus className="h-4 w-4" />
                Invite New Administrator
              </button>
            </div>

            {/* 2. Create User Modal Form */}
            {showAddUser && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setSaving(true)
                  try {
                    const { createAdminUserBrowser } = await import('@/lib/firebaseClientOperations')
                    const createdUser = await createAdminUserBrowser(newUser)

                    setUserList(prev => [...prev, createdUser])
                    setShowAddUser(false)
                    setNewUser({
                      name: '',
                      email: '',
                      password: '',
                      role: 'ADMIN',
                      status: 'active',
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
                      }
                    })
                    showToast('success', 'New administrator created successfully')
                  } catch (err: any) {
                    showToast('error', err.message)
                  } finally {
                    setSaving(false)
                  }
                }}
                className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6"
              >
                <h4 className="text-lg font-serif font-bold text-text-primary border-b border-accent pb-2">Invite Administrator</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary font-semibold"
                      placeholder="e.g. D. K. PATEL"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                      placeholder="admin@satsahebtrading.com"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Initial Password</label>
                    <input
                      type="password"
                      required
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary"
                      placeholder="Min. 6 chars"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">System Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary font-bold"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-accent/40 pt-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-3">Granular Feature Permissions Configuration</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(newUser.permissions).map((feature) => (
                      <div key={feature} className="border border-accent p-3 bg-bg-secondary/10">
                        <span className="text-xs font-serif font-bold text-text-primary capitalize block border-b border-accent/30 pb-1 mb-2">{feature}</span>
                        <div className="space-y-1.5">
                          {['view', 'create', 'edit', 'delete'].map((action) => (
                            <label key={action} className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-secondary cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(newUser.permissions as any)[feature][action] || false}
                                onChange={(e) => {
                                  const updatedPerms = { ...newUser.permissions }
                                  if (!(updatedPerms as any)[feature]) (updatedPerms as any)[feature] = {}
                                  ;(updatedPerms as any)[feature][action] = e.target.checked
                                  setNewUser({ ...newUser, permissions: updatedPerms })
                                }}
                                className="h-3.5 w-3.5 text-primary"
                              />
                              {action}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-white font-sans text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    Create Admin Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="px-6 py-2 border border-accent hover:bg-bg-secondary text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* 3. Editing Permissions Modal Form */}
            {editingUser && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setSaving(true)
                  try {
                    // Update user profile to Firestore from client-side where we have permission context
                    const { doc, setDoc } = await import('firebase/firestore')
                    const userDocRef = doc(firestore, 'users', editingUser.uid)
                    await setDoc(userDocRef, {
                      name: editingUser.name,
                      role: editingUser.role,
                      status: editingUser.status,
                      permissions: editingUser.permissions,
                      updatedAt: new Date().toISOString()
                    }, { merge: true })

                    setUserList(prev => prev.map(u => u.uid === editingUser.uid ? editingUser : u))
                    setEditingUser(null)
                    showToast('success', 'User status and permissions updated successfully')
                  } catch (err: any) {
                    showToast('error', err.message)
                  } finally {
                    setSaving(false)
                  }
                }}
                className="bg-white border border-accent p-6 md:p-8 shadow-premium space-y-6"
              >
                <h4 className="text-lg font-serif font-bold text-text-primary border-b border-accent pb-2">Edit Account Status & Permissions: {editingUser.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">System Role</label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary font-bold"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-1">Account Status</label>
                    <select
                      value={editingUser.status}
                      onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                      className="w-full px-3 py-2 border border-accent bg-bg-secondary text-xs rounded-none text-text-primary font-bold"
                    >
                      <option value="active">Active (Access Granted)</option>
                      <option value="inactive">Inactive (Access Suspended)</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-accent/40 pt-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-text-secondary block mb-3">Modify Permissions Profile</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(newUser.permissions).map((feature) => (
                      <div key={feature} className="border border-accent p-3 bg-bg-secondary/10">
                        <span className="text-xs font-serif font-bold text-text-primary capitalize block border-b border-accent/30 pb-1 mb-2">{feature}</span>
                        <div className="space-y-1.5">
                          {['view', 'create', 'edit', 'delete'].map((action) => (
                            <label key={action} className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-text-secondary cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(editingUser.permissions as any)?.[feature]?.[action] || false}
                                onChange={(e) => {
                                  const updatedPerms = { ...(editingUser.permissions || {}) }
                                  if (!(updatedPerms as any)[feature]) (updatedPerms as any)[feature] = {}
                                  ;(updatedPerms as any)[feature][action] = e.target.checked
                                  setEditingUser({ ...editingUser, permissions: updatedPerms })
                                }}
                                className="h-3.5 w-3.5 text-primary"
                              />
                              {action}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-primary text-white font-sans text-xs font-bold uppercase tracking-wider disabled:opacity-50"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-6 py-2 border border-accent hover:bg-bg-secondary text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* 4. Display Users table list */}
            <div className="bg-white border border-accent p-6 shadow-premium overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-accent text-[10px] uppercase tracking-wider text-text-secondary text-left bg-bg-secondary/20">
                    <th className="p-3 font-semibold">Name</th>
                    <th className="p-3 font-semibold">Email</th>
                    <th className="p-3 font-semibold">Role</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-xs text-text-secondary">No additional administrator accounts registered.</td>
                    </tr>
                  ) : (
                    userList.map((userObj) => (
                      <tr key={userObj.uid} className="border-b border-accent hover:bg-bg-secondary/5 text-xs">
                        <td className="p-3 font-serif font-bold text-text-primary">{userObj.name}</td>
                        <td className="p-3 font-mono">{userObj.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                            userObj.role === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {userObj.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                            userObj.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {userObj.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setShowAddUser(false)
                                setEditingUser(userObj)
                              }}
                              className="p-1.5 border border-accent hover:border-primary text-text-primary hover:text-primary transition-colors"
                              title="Edit status & permissions"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            {userObj.role !== 'SUPER_ADMIN' && (
                              <button
                                onClick={async () => {
                                  if (!confirm(`Are you sure you want to delete administrator ${userObj.name}?`)) return
                                  try {
                                    // Delete user profile from Firestore from client-side where we have permission context
                                    const { doc, deleteDoc } = await import('firebase/firestore')
                                    const userDocRef = doc(firestore, 'users', userObj.uid)
                                    await deleteDoc(userDocRef)

                                    setUserList(prev => prev.filter(u => u.uid !== userObj.uid))
                                    showToast('success', 'User deleted successfully')
                                  } catch (err: any) {
                                    showToast('error', err.message)
                                  }
                                }}
                                className="p-1.5 border border-accent hover:border-red-600 text-text-primary hover:text-red-600 transition-colors"
                                title="Delete administrator"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      <style jsx global>{`
        /* Minimal custom styling for dashboard stars */
        svg.fill-secondary {
          fill: var(--secondary, #d69317);
        }
      `}</style>
    </div>
  )
}
