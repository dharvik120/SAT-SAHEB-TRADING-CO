'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import WhatsAppButton from '@/components/WhatsAppButton'
import Preloader from '@/components/Preloader'

interface LayoutWrapperProps {
  children: React.ReactNode
  preloaderEnabled: boolean
  whatsappEnabled: boolean
  whatsappNumber: string
  whatsappMessage: string
  settings: any
}

export default function LayoutWrapper({
  children,
  preloaderEnabled,
  whatsappEnabled,
  whatsappNumber,
  whatsappMessage,
  settings: initialSettings
}: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') || false
  const [liveSettings, setLiveSettings] = useState(initialSettings)

  // Real-time Firestore listener for live settings updates across public website
  useEffect(() => {
    if (isAdmin) return
    try {
      const unsub = onSnapshot(doc(firestore, 'websiteSettings', 'id_1'), (snap) => {
        if (snap.exists()) {
          setLiveSettings((prev: any) => ({ ...prev, ...snap.data() }))
        }
      })
      return () => unsub()
    } catch (err) {
      console.warn('Firestore live settings listener bypassed:', err)
    }
  }, [isAdmin])

  const effectiveSettings = liveSettings || initialSettings
  const currentWhatsAppNumber = effectiveSettings?.whatsappNumber || whatsappNumber
  const currentWhatsAppMessage = effectiveSettings?.whatsappDefaultMessage || whatsappMessage
  const isWhatsAppEnabled = effectiveSettings?.whatsappEnabled !== undefined ? effectiveSettings.whatsappEnabled : whatsappEnabled
  const isPreloaderEnabled = effectiveSettings?.preloaderEnabled !== undefined ? effectiveSettings.preloaderEnabled : preloaderEnabled

  return (
    <>
      <Preloader enabled={isPreloaderEnabled && !isAdmin} />
      
      {!isAdmin && <Navbar settings={effectiveSettings} />}
      
      {isAdmin ? (
        <main className="min-h-screen">
          {children}
        </main>
      ) : (
        <SmoothScroll>
          <main className="min-h-screen text-text-primary">
            {children}
          </main>
          <Footer settings={effectiveSettings} />
        </SmoothScroll>
      )}

      {!isAdmin && (
        <WhatsAppButton
          number={currentWhatsAppNumber}
          message={currentWhatsAppMessage}
          enabled={isWhatsAppEnabled}
        />
      )}
    </>
  )
}
