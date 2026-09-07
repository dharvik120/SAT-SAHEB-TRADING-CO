'use client'

import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import Image from 'next/image'
import { Phone } from 'lucide-react'

interface Partner {
  id: number | string
  name: string
  role: string
  description: string
  phone?: string
  imageUrl?: string
  isVisible?: boolean
}

export default function PartnersList({ initialPartners }: { initialPartners: Partner[] }) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners)

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(firestore, 'partners'), (snap) => {
        if (!snap.empty) {
          const fresh: Partner[] = []
          snap.forEach((doc) => {
            const data = doc.data()
            if (data.isVisible !== false) fresh.push({ id: doc.id, ...data } as Partner)
          })
          if (fresh.length > 0) setPartners(fresh)
        }
      })
      return () => unsub()
    } catch (e) {
      console.warn('Partners live listener bypassed:', e)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-5xl mx-auto">
      {partners.map((partner) => (
        <div
          key={partner.id}
          className="group bg-bg-primary border border-accent hover:border-primary/20 p-6 md:p-10 flex flex-col shadow-premium transition-all duration-300 justify-between"
        >
          <div>
            <div className="relative aspect-square w-24 h-24 mb-6 rounded-full overflow-hidden border border-accent">
              <Image
                src={partner.imageUrl || '/images/logo-circular.jpg'}
                alt={partner.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-[10px] uppercase tracking-mega text-secondary font-bold block mb-1">
              {partner.role}
            </span>
            <h3 className="text-2xl font-serif text-text-primary tracking-wide mb-2 uppercase">
              {partner.name}
            </h3>
            
            {partner.phone && (
              <div className="flex items-center gap-2 mb-4 text-primary font-semibold text-sm">
                <Phone className="h-4 w-4" />
                <a
                  href={`tel:${partner.phone.replace(/[^\d+]/g, '')}`}
                  className="hover:underline hover:text-primary transition-colors"
                >
                  {partner.phone}
                </a>
              </div>
            )}

            <p className="text-xs md:text-sm text-text-secondary leading-relaxed border-t border-accent/40 pt-4">
              {partner.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
