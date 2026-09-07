'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import AdminDashboard from '@/components/AdminDashboard'

interface Props {
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
}

export default function AdminClientWrapper(props: Props) {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Check client session in localStorage or Firebase Auth
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        setCheckingAuth(false)
      } else {
        // Double check local storage session fallback
        const isLogged = typeof window !== 'undefined' && localStorage.getItem('sst_admin_logged_in') === 'true'
        if (isLogged) {
          const email = localStorage.getItem('sst_admin_email') || 'Super Admin'
          setCurrentUser({ email, displayName: email })
          setCheckingAuth(false)
        } else {
          router.replace('/admin/login/')
        }
      }
    })

    return () => unsub()
  }, [router])

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#032318] flex items-center justify-center font-sans text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase font-bold tracking-widest text-emerald-200/70">
            Authenticating Administrative Session...
          </p>
        </div>
      </div>
    )
  }

  return (
    <AdminDashboard
      {...props}
      username={currentUser?.displayName || currentUser?.email || 'Administrator'}
    />
  )
}
