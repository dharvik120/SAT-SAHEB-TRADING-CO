'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  number: string
  message: string
  enabled: boolean
}

export default function WhatsAppButton({ number, message, enabled }: WhatsAppButtonProps) {
  if (!enabled || !number) return null

  // Clean phone number: remove spaces, symbols
  const cleanNumber = number.replace(/[^\d+]/g, '')
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[90] flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none"
      aria-label="Contact us on WhatsApp"
    >
      {/* Pulse animation ring */}
      <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping opacity-75 z-0" />
      <MessageCircle className="h-7 w-7 relative z-10 fill-white text-[#25D366]" />
    </motion.a>
  )
}
