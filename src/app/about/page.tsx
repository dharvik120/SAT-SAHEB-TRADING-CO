import { getWebsiteSettings, getPartners } from '@/lib/firebaseDb'
import Link from 'next/link'
import Image from 'next/image'
import { Landmark, Compass, Award, ShieldCheck, Mail, Phone, HelpCircle } from 'lucide-react'
import PartnersList from '@/components/PartnersList'

export const dynamic = 'force-static'

const iconMap: Record<string, any> = {
  Landmark,
  Compass,
  Award,
  ShieldCheck,
  Mail,
  Phone,
  HelpCircle,
}

export default async function AboutPage() {
  let partners: any[] = []
  let settings: any = null

  try {
    settings = await getWebsiteSettings()
    const allPartners = await getPartners()
    partners = allPartners.filter((p: any) => p.isVisible)
  } catch (error) {
    console.error('Failed to query database in AboutPage', error)
  }

  // Fallback partners if DB failed or empty
  if (!partners || partners.length === 0) {
    partners = [
      {
        id: 1,
        name: 'RAMESH MAHESHWARI',
        role: 'Founder & Managing Partner',
        description: 'Co-founder of SAT SAHEB TRADING CO., Ramesh brings years of deep expertise in commodity sourcing, quality inspection, and international logistics. He oversees domestic procurement and relations with local farming associations to maintain our supply standards.',
        phone: '+91 90996 67113',
        imageUrl: '/images/partners/ramesh-maheshwari.jpeg',
      },
      {
        id: 2,
        name: 'JITENDRA CHAUDHARI',
        role: 'Founder & Managing Partner',
        description: 'Co-founder of SAT SAHEB TRADING CO., Jitendra leads global business development, trade partnerships, and financial operations. Under his leadership, the company has expanded its network to trade agricultural commodities across several international borders.',
        phone: '+91 98252 15344',
        imageUrl: '/images/partners/jitendra-chaudhari.png',
      },
    ]
  }

  // Fallback About Cards if not set or empty
  let aboutCards = []
  if (settings?.aboutCards) {
    try {
      aboutCards = JSON.parse(settings.aboutCards)
    } catch (e) {
      console.error('Failed to parse aboutCards', e)
    }
  }

  if (aboutCards.length === 0) {
    aboutCards = [
      {
        id: '1',
        title: 'Business Philosophy',
        description: 'Pillared on transparency, integrity, and client success. We foster fair-trade parameters with local growers while assuring top compliance standards for global buyers.',
        icon: 'Landmark',
        customSvg: '',
        imageUrl: '',
        isEnabled: true,
        order: 0
      },
      {
        id: '2',
        title: 'Global Positioning',
        description: 'Strategically localized near Mundra Port, Kutches major marine terminal, simplifying logistics customs and accelerating container sea transit timelines.',
        icon: 'Compass',
        customSvg: '',
        imageUrl: '',
        isEnabled: true,
        order: 1
      }
    ]
  }

  const activeCards = aboutCards.filter((c: any) => c.isEnabled !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0))

  return (
    <div className="flex flex-col w-full bg-bg-primary overflow-hidden pt-24 font-sans">
      
      {/* Editorial Title Banner (Corporate Profile) */}
      {(!settings || settings.aboutCorporateProfileEnabled) && (
        <section className="bg-bg-secondary py-20 px-6 border-b border-accent">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-xs uppercase tracking-mega text-secondary font-bold block mb-4">
              {settings?.aboutCorporateProfileLabel || 'Corporate Profile'}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-text-primary tracking-wide leading-tight mb-6">
              {settings?.aboutCorporateProfileTitle || 'About Our Company'}
            </h1>
            <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
              {settings?.aboutCorporateProfileDesc || 'Your trusted partner for international trade, delivering excellence, reliability, and value across global markets.'}
            </p>
            {settings?.aboutCorporateProfileImage && (
              <div className="relative aspect-[21/9] w-full max-w-5xl mx-auto mt-12 border border-accent shadow-premium overflow-hidden bg-emerald-950">
                <Image
                  src={settings.aboutCorporateProfileImage}
                  alt={settings?.aboutCorporateProfileTitle || 'About Our Company'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Corporate Mission / Story Grid (Core Operations & Philosophy Cards) */}
      {(!settings || settings.aboutCoreOperationsEnabled) && (
        <section className="py-20 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 border-b border-accent">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-mega text-secondary font-bold mb-4 block">
              {settings?.aboutCoreOperationsLabel || 'Core Operations'}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-text-primary tracking-wide leading-snug mb-6">
              {settings?.aboutCoreOperationsTitle || 'Trusted Worldwide Export Partner'}
            </h2>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed mb-6">
              {settings?.aboutCoreOperationsDesc1 || 'Our extensive network enables us to source and supply a diverse range of products across multiple industries, ensuring that our clients receive the best value, quality, and service. We work closely with manufacturers, suppliers, and international buyers to facilitate seamless trade operations.'}
            </p>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
              {settings?.aboutCoreOperationsDesc2 || 'At Sat Saheb Trading, we believe in delivering excellence through efficient logistics, transparent business practices, and timely delivery. Our mission is to bridge markets, create opportunities, and support the growth of businesses through trusted international trade services.'}
            </p>
          </div>
          
          {/* Core Pillars / Dynamic About Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch">
            {activeCards.map((card: any, idx: number) => {
              const IconComp = iconMap[card.icon] || HelpCircle
              return (
                <div key={card.id || idx} className="bg-bg-secondary p-8 border border-accent flex flex-col gap-4 shadow-premium h-full justify-between">
                  <div>
                    {card.imageUrl ? (
                      <div className="relative h-12 w-12 mb-2 overflow-hidden border border-accent">
                        <Image src={card.imageUrl} alt="" fill className="object-cover" />
                      </div>
                    ) : card.customSvg ? (
                      <div className="h-7 w-7 text-primary mb-2 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: card.customSvg }} />
                    ) : (
                      <IconComp className="h-7 w-7 text-primary mb-2" />
                    )}
                    <h4 className="font-serif text-lg text-text-primary font-semibold mb-2">{card.title}</h4>
                    <p className="text-xs text-text-secondary leading-relaxed">{card.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Partners / Leadership Profile Grid */}
      <section className="py-24 px-6 bg-bg-secondary border-b border-accent">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs uppercase tracking-mega text-secondary font-bold mb-3 block">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-text-primary tracking-wide">
              Founders & Managing Partners
            </h2>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed mt-4">
              Led by a shared vision of excellence and global growth, our founders are committed to building trusted business relationships and delivering value through international trade.
            </p>
          </div>

          {/* Profile Layout with Live Updates */}
          <PartnersList initialPartners={partners} />
        </div>
      </section>

      {/* Call to Action Desk */}
      {(!settings || settings.aboutCtaEnabled) && (
        <section 
          className="relative py-28 px-6 w-full text-center overflow-hidden border-b border-accent bg-cover bg-center"
          style={settings?.aboutCtaBgImage ? { backgroundImage: `url(${settings.aboutCtaBgImage})` } : undefined}
        >
          {/* Overlay for legibility if background image exists */}
          {settings?.aboutCtaBgImage && <div className="absolute inset-0 bg-black/60 z-0" />}
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="text-xs uppercase tracking-mega text-secondary font-bold block mb-4">
              {settings?.aboutCtaLabel || 'Global Trade'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-text-primary tracking-wide mb-6">
              {settings?.aboutCtaTitle || 'Contact Us For Global Trade Solutions'}
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xl mx-auto mb-8">
              {settings?.aboutCtaDesc || 'Have questions about our products or services? Contact our team today and let us discuss how Sat Saheb Trading can support your business worldwide.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {settings?.aboutCtaPrimaryText && (
                <Link
                  href={settings.aboutCtaPrimaryLink || '/contact'}
                  className="px-8 py-3.5 text-xs font-sans uppercase font-bold tracking-widest text-[#032318] bg-secondary hover:bg-primary hover:text-white transition-all duration-300 shadow-premium"
                >
                  {settings.aboutCtaPrimaryText}
                </Link>
              )}
              {settings?.aboutCtaSecondaryText && (
                <Link
                  href={settings.aboutCtaSecondaryLink || 'mailto:info@satsahebtrading.com'}
                  className="px-8 py-3.5 text-xs font-sans uppercase font-bold tracking-widest text-primary border border-primary/25 hover:border-primary hover:bg-bg-secondary transition-all duration-300"
                >
                  {settings.aboutCtaSecondaryText}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}

