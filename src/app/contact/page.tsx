import { getWebsiteSettings, getProducts } from '@/lib/firebaseDb'
import ContactForm from '@/components/ContactForm'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export const revalidate = 0 // Disable cache for instant update reflection

export default async function ContactPage() {
  let settings = null
  let products: any[] = []
  
  try {
    settings = await getWebsiteSettings()
    const allProducts = await getProducts()
    products = allProducts.filter((p: any) => p.isEnabled)
  } catch (error) {
    console.error('Failed to query data in ContactPage', error)
  }

  const companyAddress = settings?.address || 'Office No.126 1st Floor Shakti Shopping Centre, Shakti Nagar Vill: Nana Kapaya Mundra-Kutch, 370421'
  const googleMapUrl = settings?.googleMapUrl || 'https://maps.google.com/maps?q=Office%20No.126%201st%20Floor%20Shakti%20Shopping%20Centre,%20Shakti%20Nagar%20Vill:%20Nana%20Kapaya%20Mundra-Kutch,%20370421&t=&z=13&ie=UTF8&iwloc=&output=embed'

  // Dynamic Contact details list parsing
  let phonesList: string[] = [settings?.phone1, settings?.phone2].filter(Boolean) as string[]
  if (settings?.contactPhones) {
    try {
      const parsed = JSON.parse(settings.contactPhones)
      if (Array.isArray(parsed) && parsed.length > 0) phonesList = parsed
    } catch (e) {}
  }

  let emailsList: string[] = [settings?.email].filter(Boolean) as string[]
  if (settings?.contactEmails) {
    try {
      const parsed = JSON.parse(settings.contactEmails)
      if (Array.isArray(parsed) && parsed.length > 0) emailsList = parsed
    } catch (e) {}
  }

  const mapSrc = (() => {
    if (!googleMapUrl) return ''
    if (googleMapUrl.includes('<iframe')) {
      const match = googleMapUrl.match(/src="([^"]+)"/)
      return match ? match[1] : googleMapUrl
    }
    return googleMapUrl
  })()

  return (
    <div className="flex flex-col w-full bg-bg-primary overflow-hidden pt-24 font-sans">
      
      {/* Editorial Title Banner */}
      <section className="bg-bg-secondary py-20 px-6 border-b border-accent">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-mega text-secondary font-bold block mb-4">
            {settings?.contactPageLabel || 'Connect'}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif text-text-primary tracking-wide leading-tight mb-6">
            {settings?.contactPageTitle || "Let's Connect"}
          </h1>
          <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
            {settings?.contactPageDescription || 'Have questions or business inquiries? Our global trade desk is ready to assist you with reliable import-export solutions.'}
          </p>
        </div>
      </section>

      {/* Contact Channels Grid & Form */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-mega text-secondary font-bold mb-4 block">
              Trading Channels
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-text-primary tracking-wide leading-snug mb-6">
              Get in Touch Directly
            </h2>
            <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
              We respond to official commercial inquiries within 24 business hours. Select your preferred channel below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {/* Address Card */}
            <div className="bg-bg-secondary border border-accent p-6 flex gap-4 shadow-premium">
              <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-text-primary text-base mb-1">
                  {settings?.contactOfficeTitle || 'Corporate Address'}
                </h4>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-text-secondary leading-relaxed hover:underline hover:text-primary transition-colors"
                >
                  {companyAddress}
                </a>
              </div>
            </div>

            {/* Direct Lines Card */}
            <div className="bg-bg-secondary border border-accent p-6 flex gap-4 shadow-premium">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-text-primary text-base mb-1">Direct Hotlines</h4>
                <div className="flex flex-col gap-1 text-xs text-text-secondary font-semibold">
                  {phonesList.map((p, idx) => (
                    <a
                      key={idx}
                      href={`tel:${p.replace(/[^\d+]/g, '')}`}
                      className="hover:underline hover:text-primary transition-colors"
                    >
                      {p}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Email Desk Card */}
            <div className="bg-bg-secondary border border-accent p-6 flex gap-4 shadow-premium">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-text-primary text-base mb-1">Email Trade Desk</h4>
                <div className="flex flex-col gap-1 text-xs text-text-secondary font-semibold">
                  {emailsList.map((e, idx) => (
                    <a
                      key={idx}
                      href={`mailto:${e}`}
                      className="hover:underline hover:text-primary transition-colors font-semibold"
                    >
                      {e}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-bg-secondary border border-accent p-6 flex gap-4 shadow-premium">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-bold text-text-primary text-base mb-1">Working Hours</h4>
                <p className="text-xs text-text-secondary leading-relaxed">Monday &ndash; Saturday</p>
                <p className="text-xs text-text-secondary leading-relaxed mt-0.5">09:00 AM &ndash; 06:00 PM (IST)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div className="lg:col-span-7 w-full">
          <ContactForm
            fields={settings?.formFields}
            products={products}
            title={settings?.contactFormTitle}
            subtitle={settings?.contactFormSubtitle}
            successMsg={settings?.contactSuccessMsg}
            errorMsg={settings?.contactErrorMsg}
            buttonText={settings?.contactBtnText}
          />
        </div>
      </section>

      {/* Google Maps Full-Width Section */}
      <section className="w-full h-[450px] border-t border-accent relative bg-bg-secondary">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="SAT SAHEB TRADING CO. Registered Office Location Map"
        />
      </section>

    </div>
  )
}
