'use client'

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
  settings
}: LayoutWrapperProps) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin') || false

  return (
    <>
      <Preloader enabled={preloaderEnabled && !isAdmin} />
      
      {!isAdmin && <Navbar settings={settings} />}
      
      {isAdmin ? (
        <main className="min-h-screen">
          {children}
        </main>
      ) : (
        <SmoothScroll>
          <main className="min-h-screen text-text-primary">
            {children}
          </main>
          <Footer settings={settings} />
        </SmoothScroll>
      )}

      {!isAdmin && (
        <WhatsAppButton
          number={whatsappNumber}
          message={whatsappMessage}
          enabled={whatsappEnabled}
        />
      )}
    </>
  )
}
