'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Contact Us', href: '/contact' },
]

interface NavbarProps {
  settings?: any
}

export default function Navbar({ settings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const isHome = pathname === '/'
  const logoUrl = settings?.logo || '/images/logo-transparent.png'
  const companyName = settings?.companyName || 'SAT SAHEB TRADING CO.'
  const address = settings?.address || 'Office No.126 1st Floor Shakti Shopping Centre, Shakti Nagar Vill: Nana Kapaya Mundra-Kutch, 370421'
  const email = settings?.email || 'info@satsahebtrading.com'
  const phone1 = settings?.phone1 || '+91 90996 67113'
  const phone2 = settings?.phone2 || '+91 98252 15344'

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? 'bg-bg-primary/80 backdrop-blur-md border-b border-accent shadow-premium py-4'
            : isHome
            ? 'bg-transparent py-6'
            : 'bg-bg-primary/20 backdrop-blur-sm border-b border-white/5 py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo Brand */}
          <Link href="/" prefetch={true} className="relative flex items-center gap-3 group">
            <div className="relative transition-transform duration-300 group-hover:scale-105">
              <Image
                src={logoUrl}
                alt={companyName}
                width={56}
                height={56}
                className="object-contain filter brightness-100 invert-0 dark:invert-0 rounded-full h-12 w-12 md:h-14 md:w-14"
                priority
              />
            </div>
            {/* Fallback Name if image takes time */}
            <span className="sr-only">{companyName}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  className="relative font-sans text-sm tracking-wider uppercase font-medium overflow-hidden group py-2"
                >
                  <span
                    className={`transition-colors duration-300 ${
                      isActive
                        ? 'text-primary'
                        : isHome && !scrolled
                        ? 'text-white group-hover:text-secondary'
                        : 'text-text-primary group-hover:text-primary'
                    }`}
                  >
                    {link.name}
                  </span>
                  {/* Underline Slide Effect */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[2px] bg-secondary origin-left transform scale-x-0 transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          {/* CTA Action button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              prefetch={true}
              className={`px-5 py-2.5 text-xs font-sans font-semibold uppercase tracking-wider rounded-none border transition-all duration-300 flex items-center gap-1.5 group ${
                isHome && !scrolled
                  ? 'border-white text-white hover:bg-white hover:text-primary'
                  : 'border-primary text-primary hover:bg-primary hover:text-white'
              }`}
            >
              Get In Touch
              <ArrowUpRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 relative z-50 text-text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu
                className={`h-6 w-6 ${
                  isHome && !scrolled ? 'text-white' : 'text-text-primary'
                }`}
              />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] bg-[#032318] text-white flex flex-col justify-center px-8 md:hidden"
          >
            <div className="flex flex-col gap-6 text-left max-w-sm mx-auto w-full">
              <span className="text-xs uppercase tracking-mega text-secondary font-medium border-b border-emerald-900 pb-2 mb-2">
                {companyName}
              </span>
              {navLinks.map((link, idx) => {
                const isActive = pathname === link.href
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx + 0.2 }}
                  >
                    <Link
                      href={link.href}
                      prefetch={true}
                      className={`text-2xl font-serif tracking-wider transition-colors duration-300 block ${
                        isActive ? 'text-secondary font-semibold' : 'text-emerald-100/70 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 pt-6 border-t border-emerald-900 flex flex-col gap-4 text-xs font-sans text-emerald-200/50"
              >
                <div>
                  <p className="font-semibold text-secondary">OFFICE ADDRESS</p>
                  <p className="mt-1 leading-relaxed">
                    {address}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-secondary">CONTACT INQUIRIES</p>
                  <p className="mt-1">{email}</p>
                  <p className="mt-0.5">{phone1} {phone2 && `/ ${phone2}`}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
