import type { Metadata } from 'next'
import '@/app/globals.css'
import { db } from '@/lib/db'
import LayoutWrapper from '@/components/LayoutWrapper'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await db.websiteSettings.findUnique({ where: { id: 1 } })
    return {
      title: {
        default: settings?.seoTitle || settings?.companyName || 'SAT SAHEB TRADING CO.',
        template: `%s | ${settings?.companyName || 'SAT SAHEB TRADING CO.'}`,
      },
      description: settings?.seoDescription || 'Premium International Agro-Commodity Trading Enterprise, exporting quality grains, pulses, and spices from India.',
      icons: {
        icon: settings?.favicon || '/images/logo-circular.jpg',
      },
      openGraph: {
        title: settings?.ogTitle || settings?.companyName || 'SAT SAHEB TRADING CO.',
        description: settings?.ogDescription || 'Premium International Agro-Commodity Trading Enterprise, exporting quality grains, pulses, and spices.',
        images: [{ url: settings?.ogImage || '/images/logo-circular.jpg' }],
      }
    }
  } catch {
    return {
      title: 'SAT SAHEB TRADING CO.',
      description: 'Premium International Agro-Commodity Trading Enterprise, exporting quality grains, pulses, and spices from India to the world.',
      icons: {
        icon: '/images/logo-circular.jpg',
      },
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let settings = null
  let theme = null

  try {
    settings = await db.websiteSettings.findUnique({ where: { id: 1 } })
    theme = await db.themeSettings.findUnique({ where: { id: 1 } })
  } catch (error) {
    console.error('Database connection failed in RootLayout, using fallback settings.', error)
  }

  // Fallbacks if DB query failed
  const themeConfig = {
    themeName: theme?.themeName || 'theme-premium-green',
    primary: theme?.primaryColor || '#06402b',
    secondary: theme?.secondaryColor || '#d69317',
    accent: theme?.accentColor || '#f3f4f6',
    bgPrimary: theme?.bgPrimary || '#ffffff',
    bgSecondary: theme?.bgSecondary || '#f9fafb',
    textPrimary: theme?.textPrimary || '#111827',
    textSecondary: theme?.textSecondary || '#4b5563',
  }

  const generalConfig = {
    preloaderEnabled: settings?.preloaderEnabled !== undefined ? settings.preloaderEnabled : true,
    whatsappEnabled: settings?.whatsappEnabled !== undefined ? settings.whatsappEnabled : true,
    whatsappNumber: settings?.whatsappNumber || '+91 90996 67113',
    whatsappMessage: settings?.whatsappDefaultMessage || 'Hello SAT SAHEB TRADING CO., I am interested in your products.',
  }

  return (
    <html lang="en" className={`lenis ${themeConfig.themeName}`}>
      {/* Inject custom variables dynamically */}
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --primary: ${themeConfig.primary};
            --primary-light: ${themeConfig.primary}cc;
            --primary-dark: #032318;
            --secondary: ${themeConfig.secondary};
            --accent: ${themeConfig.accent};
            --bg-primary: ${themeConfig.bgPrimary};
            --bg-secondary: ${themeConfig.bgSecondary};
            --text-primary: ${themeConfig.textPrimary};
            --text-secondary: ${themeConfig.textSecondary};
          }
        `}} />
      </head>
      <body>
        <LayoutWrapper
          preloaderEnabled={generalConfig.preloaderEnabled}
          whatsappEnabled={generalConfig.whatsappEnabled}
          whatsappNumber={generalConfig.whatsappNumber}
          whatsappMessage={generalConfig.whatsappMessage}
          settings={settings}
        >
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
