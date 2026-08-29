import { 
  getWebsiteSettings, 
  getHeroSlides, 
  getProducts, 
  getCategories, 
  getTestimonials, 
  getLogisticsNodes,
  migrateDbToFirestore 
} from '@/lib/firebaseDb'
import HeroSlider from '@/components/HeroSlider'
import ProductShowcase from '@/components/ProductShowcase'
import ProductCard from '@/components/ProductCard'
import InteractiveMap from '@/components/InteractiveMap'
import TestimonialsSlider from '@/components/TestimonialsSlider'
import ContactForm from '@/components/ContactForm'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, ShieldCheck, Truck, Award } from 'lucide-react'

export const revalidate = 0 // Disable cache to reflect admin changes instantly

export default async function HomePage() {
  // Trigger automated one-time migration if configured
  await migrateDbToFirestore()

  // Fetch data from Firebase Firestore
  const settings = await getWebsiteSettings()
  const slides = (await getHeroSlides()).filter((s: any) => s.isEnabled)
  const allProducts = (await getProducts()).filter((p: any) => p.isEnabled)
  
  const categories = await getCategories()

  // Sort, filter and map categories to featured products
  const products = allProducts
    .filter((p: any) => p.isFeatured)
    .sort((a: any, b: any) => (a.featuredOrder || 0) - (b.featuredOrder || 0))
    .map((prod: any) => {
      const cat = categories.find((c: any) => c.id.toString() === prod.categoryId?.toString())
      return {
        ...prod,
        category: cat || { name: 'General' }
      }
    })
  const testimonials = (await getTestimonials()).filter((t: any) => t.isEnabled)
  const nodes = (await getLogisticsNodes()).filter((n: any) => n.isEnabled)

  return (
    <div className="flex flex-col w-full bg-bg-primary overflow-hidden">
      
      {/* 1. HERO SLIDER */}
      <HeroSlider slides={slides} />

      {/* 2. CORPORATE TRUST / VALUE PROPOSITION */}
      {(!settings || settings.storyEnabled) && (
        <section className="py-20 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-accent">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="font-sans text-xs uppercase tracking-mega text-secondary font-bold mb-4 block">
              {settings?.storyLabel || 'Sat Saheb Trading Co.'}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-text-primary tracking-wide leading-tight mb-6">
              {settings?.storyTitle || 'Exporting Premium Commodities Worldwide'}
            </h2>
            <p className="font-sans text-sm md:text-base text-text-secondary leading-relaxed mb-6">
              {settings?.storyDescription || 'We bridge domestic farms to international markets, delivering uncompromised quality with every container.'}
            </p>
            {settings?.storyBtnVisible && (
              <div className="flex gap-4">
                <Link
                  href={settings.storyBtnLink || '/about'}
                  className="px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300"
                >
                  {settings.storyBtnText || 'Our Company Story'}
                </Link>
              </div>
            )}
          </div>
          
          {/* Quality Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-bg-secondary p-6 border border-accent flex flex-col gap-4 shadow-premium">
              <Award className="h-8 w-8 text-primary" />
              <h4 className="font-serif text-lg text-text-primary font-semibold">{settings?.storyPillar1Title || 'Premium Sourcing'}</h4>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                {settings?.storyPillar1Desc || 'We procure grains and spices directly from verified cultivation belts across India.'}
              </p>
            </div>
            <div className="bg-bg-secondary p-6 border border-accent flex flex-col gap-4 shadow-premium">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h4 className="font-serif text-lg text-text-primary font-semibold">{settings?.storyPillar2Title || 'Strict Quality Control'}</h4>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                {settings?.storyPillar2Desc || 'Before shipping, all commodities go through advanced cleaning, grading, sorting, and lab testing parameters.'}
              </p>
            </div>
            <div className="bg-bg-secondary p-6 border border-accent flex flex-col gap-4 shadow-premium">
              <Truck className="h-8 w-8 text-primary" />
              <h4 className="font-serif text-lg text-text-primary font-semibold">{settings?.storyPillar3Title || 'Logistical Splicing'}</h4>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                {settings?.storyPillar3Desc || 'Our close proximity to Mundra Port enables immediate container customs check and rapid shipping turnarounds.'}
              </p>
            </div>
            <div className="bg-bg-secondary p-6 border border-accent flex flex-col gap-4 shadow-premium">
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <h4 className="font-serif text-lg text-text-primary font-semibold">{settings?.storyPillar4Title || 'Secure Export Packing'}</h4>
              <p className="font-sans text-xs text-text-secondary leading-relaxed">
                {settings?.storyPillar4Desc || 'Commodities are packed in customized heavy-duty bags to shield goods from moisture and temperature swings.'}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 3. PRODUCT PORTFOLIO */}
      {(!settings || settings.featuredProductsEnabled) && (
        <section id="commodities" className="py-24 px-6 max-w-7xl mx-auto w-full border-b border-accent">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-sans text-xs uppercase tracking-mega text-secondary font-bold mb-3 block">
              {settings?.featuredProductsLabel || 'Verified Sourcing'}
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-text-primary tracking-wide mb-6">
              {settings?.featuredProductsTitle || 'Special Products Showcase'}
            </h2>
            <p className="font-sans text-sm text-text-secondary leading-relaxed">
              {settings?.featuredProductsSubtitle || 'Browse our core portfolio of certified export-grade agricultural commodities, carefully cleaned and prepared for international shipping channels.'}
            </p>
          </div>
          
          {/* Featured products grid without tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((prod, index) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                title={prod.title}
                slug={prod.slug}
                featuredImage={prod.featuredImage}
                categoryName={prod.category.name}
                index={index}
                hideCategory={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. ABOUT OUR COMPANY COMPANY SUMMARY */}
      {(!settings || settings.aboutSectionEnabled) && (
        <section className="py-20 bg-bg-secondary border-b border-accent">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-video w-full border border-accent shadow-premium overflow-hidden bg-emerald-950">
              <Image
                src={settings?.aboutSectionImage || '/images/map.png'}
                alt="SAT SAHEB TRADING CO. Trade lanes"
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="font-sans text-xs uppercase tracking-mega text-secondary font-bold mb-4 block">
                {settings?.aboutSectionLabel || 'About Our Company'}
              </span>
              <h3 className="text-3xl md:text-4xl font-serif text-text-primary tracking-wide leading-tight mb-6">
                {settings?.aboutSectionTitle || 'A Trusted Worldwide Export Partner'}
              </h3>
              <p className="font-sans text-sm md:text-base text-text-secondary leading-relaxed mb-6 font-medium">
                {settings?.aboutSectionDescription || 'Sat Saheb Trading is a trusted name in the import and export industry, specializing in premium agricultural products for global markets.'}
              </p>
              {settings?.aboutSectionBtnVisible && (
                <div className="flex gap-4">
                  <Link
                    href={settings.aboutSectionBtnLink || '/about'}
                    className="font-sans text-xs font-bold uppercase tracking-wider text-primary hover:text-secondary transition-colors duration-200 flex items-center gap-1.5"
                  >
                    {settings.aboutSectionBtnText || 'Read Full Corporate Profile'} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. GLOBAL CORRIDOR NETWORK MAP */}
      {(!settings || settings.logisticsEnabled) && (
        <InteractiveMap
          logisticsTitle={settings?.logisticsTitle}
          logisticsOriginTitle={settings?.logisticsOriginTitle}
          logisticsOriginDesc={settings?.logisticsOriginDesc}
          nodes={nodes}
        />
      )}

      {/* 6. WHAT PEOPLE SAY */}
      {(!settings || settings.reviewsEnabled) && (
        <section className="py-24 bg-bg-secondary text-center border-b border-accent px-6">
          <div className="max-w-2xl mx-auto mb-16">
            <span className="font-sans text-xs uppercase tracking-mega text-secondary font-bold mb-3 block">
              {settings?.reviewsLabel || 'Global Reviews'}
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-text-primary tracking-wide leading-tight">
              {settings?.reviewsTitle || 'What People Say About Sat Saheb Trading'}
            </h2>
            {settings?.reviewsSubtitle && (
              <p className="font-sans text-sm text-text-secondary leading-relaxed mt-4 max-w-xl mx-auto">
                {settings.reviewsSubtitle}
              </p>
            )}
          </div>

          {/* Dynamic client quotes slider */}
          <TestimonialsSlider testimonials={testimonials} />
        </section>
      )}

      {/* 7. CONTACT FORM & LOCATION GRID */}
      {(!settings || settings.contactSectionEnabled) && (
        <section className="py-24 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Custom Contact form */}
          <ContactForm
            fields={settings?.formFields}
            products={allProducts}
            title={settings?.contactFormTitle}
            subtitle={settings?.contactFormSubtitle}
            successMsg={settings?.contactSuccessMsg}
            errorMsg={settings?.contactErrorMsg}
            buttonText={settings?.contactBtnText}
          />

          {/* Right Side: Address details and Google map widget */}
          <div className="flex flex-col gap-8 h-full justify-between">
            <div>
              <span className="font-sans text-xs uppercase tracking-mega text-secondary font-bold mb-4 block">
                {settings?.contactSectionLabel || 'Logistics Desk'}
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-text-primary tracking-wide mb-6">
                {settings?.contactSectionTitle || 'Contact Us For Global Trade Solutions'}
              </h3>
              
              <div className="space-y-6 font-sans text-sm text-text-secondary leading-relaxed">
                {settings?.contactSectionDescription && (
                  <p className="text-text-secondary font-medium">
                    {settings.contactSectionDescription}
                  </p>
                )}
                <div>
                  <p className="font-bold text-text-primary uppercase tracking-wider text-xs mb-1">
                    {settings?.contactOfficeTitle || 'REGISTERED OFFICE ADDRESS'}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.address || '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block hover:text-primary transition-colors font-semibold"
                  >
                    {settings?.address}
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-text-primary uppercase tracking-wider text-xs mb-1">EMAIL DESK</p>
                    <div className="mt-1 flex flex-col gap-1">
                      {(() => {
                        let emails = [settings?.email].filter(Boolean)
                        if (settings?.contactEmails) {
                          try {
                            const parsed = JSON.parse(settings.contactEmails)
                            if (Array.isArray(parsed) && parsed.length > 0) emails = parsed
                          } catch (e) {}
                        }
                        return emails.map((m: any, idx) => (
                          <a
                            key={idx}
                            href={`mailto:${m}`}
                            className="block hover:text-primary transition-colors font-semibold truncate"
                          >
                            {m}
                          </a>
                        ))
                      })()}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-text-primary uppercase tracking-wider text-xs mb-1">DIRECT HOTLINES</p>
                    <div className="mt-1 flex flex-col gap-1">
                      {(() => {
                        let phones = [settings?.phone1, settings?.phone2].filter(Boolean)
                        if (settings?.contactPhones) {
                          try {
                            const parsed = JSON.parse(settings.contactPhones)
                            if (Array.isArray(parsed) && parsed.length > 0) phones = parsed
                          } catch (e) {}
                        }
                        return phones.map((p: any, idx) => (
                          <a
                            key={idx}
                            href={`tel:${p.replace(/[^\d+]/g, '')}`}
                            className="hover:text-primary transition-colors font-semibold block"
                          >
                            {p}
                          </a>
                        ))
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Google Map iframe */}
            <div className="relative aspect-video w-full bg-bg-secondary border border-accent shadow-premium overflow-hidden h-72">
              <iframe
                src={(() => {
                  const url = settings?.googleMapUrl || ''
                  if (url.includes('<iframe')) {
                    const match = url.match(/src="([^"]+)"/)
                    return match ? match[1] : url
                  }
                  return url
                })()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SAT SAHEB TRADING CO. Google Maps Location"
              />
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
