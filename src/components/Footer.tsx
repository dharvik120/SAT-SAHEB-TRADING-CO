import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, ArrowRight, Facebook, Instagram, Linkedin, Twitter, Youtube, MessageSquare, Globe, HelpCircle, Send, Pin, Flame, MessageCircle } from 'lucide-react'

interface FooterProps {
  settings?: any
}

const socialIconMap: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
  youtube: Youtube,
  whatsapp: MessageSquare,
  telegram: Send,
  pinterest: Pin,
  tiktok: Flame,
  snapchat: MessageCircle,
  threads: MessageSquare,
  discord: MessageSquare,
  reddit: MessageSquare,
  google: Globe,
  globe: Globe,
  email: Mail,
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()
  
  const logoUrl = settings?.logo || '/images/logo-transparent.png'
  const companyName = settings?.companyName || 'SAT SAHEB TRADING CO.'
  const desc = settings?.footerDescription || 'SAT SAHEB TRADING CO. is a premier international agro-commodity trading enterprise, sourcing the finest grains, pulses, and spices from verified farming corridors in India.'
  const copyright = settings?.footerCopyright || `© ${currentYear} SAT SAHEB TRADING CO. All rights reserved.`
  const address = settings?.address || 'Office No.126 1st Floor Shakti Shopping Centre, Shakti Nagar Vill: Nana Kapaya Mundra-Kutch, 370421'
  const email = settings?.email || 'info@satsahebtrading.com'
  const phone1 = settings?.phone1 || '+91 90996 67113'
  const phone2 = settings?.phone2 || '+91 98252 15344'

  // Parse custom links
  let footerLinks = []
  if (settings?.footerLinks) {
    try {
      footerLinks = JSON.parse(settings.footerLinks)
    } catch (e) {
      console.error('Failed to parse footerLinks', e)
    }
  }

  if (footerLinks.length === 0) {
    footerLinks = [
      { id: '1', label: 'Home', url: '/', isEnabled: true, order: 0 },
      { id: '2', label: 'About Us', url: '/about', isEnabled: true, order: 1 },
      { id: '3', label: 'Products', url: '/products', isEnabled: true, order: 2 },
      { id: '4', label: 'Gallery', url: '/gallery', isEnabled: true, order: 3 },
      { id: '5', label: 'Contact Us', url: '/contact', isEnabled: true, order: 4 },
    ]
  }

  const activeLinks = footerLinks.filter((l: any) => l.isEnabled !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

  // Render social links list
  let socialList: any[] = []
  if (settings?.socialLinksList) {
    try {
      socialList = JSON.parse(settings.socialLinksList)
    } catch (e) {}
  }
  if (!socialList || socialList.length === 0) {
    socialList = [
      { id: 'fb', platform: 'facebook', url: settings?.socialFacebook, isEnabled: !!settings?.socialFacebook },
      { id: 'tw', platform: 'twitter', url: settings?.socialTwitter, isEnabled: !!settings?.socialTwitter },
      { id: 'li', platform: 'linkedin', url: settings?.socialLinkedIn, isEnabled: !!settings?.socialLinkedIn },
      { id: 'ig', platform: 'instagram', url: settings?.socialInstagram, isEnabled: !!settings?.socialInstagram },
      { id: 'yt', platform: 'youtube', url: settings?.socialYoutube, isEnabled: !!settings?.socialYoutube },
    ].filter(s => !!s.url)
  }

  const activeSocials = socialList.filter(s => s.isEnabled !== false).sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <footer className="bg-[#032318] text-white border-t border-emerald-950 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 pb-16">
        {/* Brand Information */}
        <div className="flex flex-col gap-6 md:col-span-1">
          <div className="relative">
            <Image
              src={logoUrl}
              alt={companyName}
              width={64}
              height={64}
              className="object-contain filter brightness-100 rounded-full h-16 w-16"
            />
          </div>
          <p className="font-sans text-xs leading-relaxed text-emerald-100/60 max-w-xs">
            {desc}
          </p>

          {/* Social Icons list */}
          <div className="flex flex-wrap gap-3 mt-2">
            {activeSocials.map((s, idx) => {
              if (s.isCustom && s.customIconUrl) {
                return (
                  <a
                    key={s.id || idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-950 hover:bg-secondary hover:text-[#032318] transition-colors border border-emerald-900 flex items-center justify-center"
                    aria-label={s.platform}
                  >
                    <img src={s.customIconUrl} alt={s.platform} className="h-4 w-4 filter invert brightness-200" />
                  </a>
                )
              }
              const Icon = socialIconMap[s.platform] || HelpCircle
              return (
                <a
                  key={s.id || idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-950 hover:bg-secondary hover:text-[#032318] transition-colors border border-emerald-900"
                  aria-label={s.platform}
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>

        {(() => {
          let categoriesList: any[] = []
          if (settings?.footerCategories) {
            try {
              categoriesList = JSON.parse(settings.footerCategories)
            } catch (e) {}
          }
          if (!categoriesList || categoriesList.length === 0) {
            categoriesList = [
              {
                id: 'quick-nav',
                name: 'Quick Navigation',
                order: 0,
                links: activeLinks
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

          const activeCategories = categoriesList
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(cat => ({
              ...cat,
              links: (cat.links || [])
                .filter((l: any) => l.isEnabled !== false)
                .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
            }))

          return activeCategories.map((cat, idx) => (
            <div key={cat.id || idx} className="flex flex-col gap-4">
              <h4 className="font-sans text-xs tracking-mega uppercase font-semibold text-secondary">
                {cat.name}
              </h4>
              <ul className="flex flex-col gap-3 font-sans text-sm text-emerald-100/70">
                {cat.links.map((link: any, lIdx: number) => (
                  <li key={link.id || lIdx}>
                    <Link
                      href={link.url}
                      prefetch={true}
                      target={link.openInNewTab ? '_blank' : undefined}
                      className="hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transform -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))
        })()}

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-sans text-xs tracking-mega uppercase font-semibold text-secondary">
            Contact Information
          </h4>
          <ul className="flex flex-col gap-4 font-sans text-sm text-emerald-100/70">
            <li className="flex gap-3 items-start">
              <MapPin className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-white transition-colors leading-relaxed text-xs"
              >
                {address}
              </a>
            </li>
            <li className="flex gap-3 items-start">
              <Phone className="h-4 w-4 text-secondary shrink-0 mt-1" />
              <div className="flex flex-col gap-1 text-xs font-semibold">
                {(() => {
                  let phones = [settings?.phone1, settings?.phone2, phone1, phone2].filter(Boolean)
                  if (settings?.contactPhones) {
                    try {
                      const parsed = JSON.parse(settings.contactPhones)
                      const validPhones = parsed.filter((p: string) => p && p.trim() !== '')
                      if (Array.isArray(parsed) && validPhones.length > 0) {
                        phones = [...phones, ...validPhones]
                      }
                    } catch (e) {}
                  }
                  const uniquePhones = Array.from(new Set(phones))
                  return uniquePhones.slice(0, 2).map((p: any, pIdx) => (
                    <a
                      key={pIdx}
                      href={`tel:${p.replace(/[^\d+]/g, '')}`}
                      className="hover:underline hover:text-white transition-colors block"
                    >
                      {p}
                    </a>
                  ))
                })()}
              </div>
            </li>
            <li className="flex gap-3 items-start">
              <Mail className="h-4 w-4 text-secondary shrink-0 mt-1" />
              <div className="flex flex-col gap-1 text-xs font-semibold">
                {(() => {
                  let emails = [settings?.email, email].filter(Boolean)
                  if (settings?.contactEmails) {
                    try {
                      const parsed = JSON.parse(settings.contactEmails)
                      const validEmails = parsed.filter((e: string) => e && e.trim() !== '')
                      if (Array.isArray(parsed) && validEmails.length > 0) {
                        emails = [...emails, ...validEmails]
                      }
                    } catch (e) {}
                  }
                  const uniqueEmails = Array.from(new Set(emails))
                  return uniqueEmails.slice(0, 2).map((e: any, eIdx) => (
                    <a
                      key={eIdx}
                      href={`mailto:${e}`}
                      className="hover:underline hover:text-white transition-colors block"
                    >
                      {e}
                    </a>
                  ))
                })()}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-emerald-950/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-sans text-xs text-emerald-100/40 text-center md:text-left">
          {copyright}
        </p>
        <p className="font-sans text-xs text-emerald-100/40 text-center md:text-right">
          Created by{' '}
          <a
            href="https://webztechnologies.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors font-medium"
          >
            Webz Technologies
          </a>
        </p>
      </div>
    </footer>
  )
}
