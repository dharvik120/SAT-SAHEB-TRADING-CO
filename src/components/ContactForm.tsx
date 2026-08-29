'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

interface FormField {
  id: string
  label: string
  type: string // text, email, tel, number, textarea, select, country, state, checkbox
  placeholder?: string
  required: boolean
  enabled: boolean
  options?: string
  helpText?: string
}

interface ContactFormProps {
  fields?: string
  products: any[]
  title?: string
  subtitle?: string
  successMsg?: string
  errorMsg?: string
  buttonText?: string
}

const DEFAULT_FIELDS: FormField[] = [
  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe', required: true, enabled: true },
  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g. john@company.com', required: true, enabled: true },
  { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'e.g. +91 90996 67113', required: true, enabled: true },
  { id: 'company', label: 'Company Name', type: 'text', placeholder: 'e.g. Acme Import Export', required: false, enabled: true },
  { id: 'country', label: 'Country', type: 'text', placeholder: 'e.g. United Arab Emirates', required: false, enabled: true },
  { id: 'state', label: 'State', type: 'text', placeholder: 'e.g. Gujarat', required: false, enabled: true },
  { id: 'productInterest', label: 'Product Interest', type: 'select', placeholder: 'Select a commodity...', required: false, enabled: true },
  { id: 'message', label: 'Message / Inquiry Details', type: 'textarea', placeholder: 'Please detail your quantity and packaging requirements...', required: true, enabled: true }
]

export default function ContactForm({
  fields,
  products,
  title,
  subtitle,
  successMsg,
  errorMsg,
  buttonText
}: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Parse fields JSON or use fallback
  let parsedFields: FormField[] = []
  if (fields) {
    try {
      parsedFields = JSON.parse(fields)
    } catch (e) {
      console.error('Failed to parse dynamic form fields from props, using defaults.', e)
    }
  }
  if (!parsedFields || parsedFields.length === 0) {
    parsedFields = DEFAULT_FIELDS
  }

  // Filter only enabled fields
  const enabledFields = parsedFields.filter(f => f.enabled !== false)

  const handleChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[fieldId]
        return next
      })
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side Validation
    const newErrors: Record<string, string> = {}
    enabledFields.forEach(field => {
      const val = formData[field.id]
      if (field.required && (val === undefined || val === null || String(val).trim() === '')) {
        newErrors[field.id] = `${field.label} is required`
      }
      
      if (field.type === 'email' && val) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(String(val))) {
          newErrors[field.id] = 'Invalid email address format'
        }
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || errorMsg || 'Failed to submit form')
      }
      
      setStatus('success')
      setFormData({})
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err: any) {
      setStatus('error')
      setErrorMessage(err.message || 'An error occurred during submission')
    }
  }

  return (
    <div className="bg-bg-card border border-accent p-8 md:p-10 shadow-premium w-full relative">
      <h3 className="text-2xl font-serif text-text-primary tracking-wide mb-2">
        {title || 'Send Trade Inquiry'}
      </h3>
      <p className="font-sans text-xs md:text-sm text-text-secondary leading-relaxed mb-8">
        {subtitle || 'Have questions or trade inquiries? Fill out the form below and our global trade desk will get back to you shortly.'}
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enabledFields.filter(f => f.type !== 'textarea').map((field) => {
            const hasError = !!errors[field.id]
            
            return (
              <div key={field.id} className="flex flex-col">
                <label className="font-sans text-xs uppercase tracking-wider text-text-secondary font-semibold mb-2">
                  {field.label} {field.required && '*'}
                </label>

                {field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className="px-4 py-3.5 border border-accent bg-bg-secondary text-text-primary text-sm rounded-none"
                  >
                    <option value="">{field.placeholder || 'Select...'}</option>
                    {field.id === 'productInterest' ? (
                      products.map((prod: any) => (
                        <option key={prod.id || prod.slug} value={prod.title}>
                          {prod.title}
                        </option>
                      ))
                    ) : (
                      field.options?.split(',').map((opt: string, i: number) => (
                        <option key={i} value={opt.trim()}>
                          {opt.trim()}
                        </option>
                      ))
                    )}
                  </select>
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : field.type === 'tel' ? 'tel' : field.type === 'email' ? 'email' : 'text'}
                    placeholder={field.placeholder}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className={`px-4 py-3 border bg-bg-secondary text-text-primary text-sm rounded-none ${
                      hasError ? 'border-red-500 bg-red-50/5' : 'border-accent'
                    }`}
                  />
                )}

                {field.helpText && (
                  <span className="text-[10px] text-text-secondary mt-1 font-sans">{field.helpText}</span>
                )}
                {hasError && (
                  <span className="text-[10px] text-red-500 font-semibold mt-1.5">{errors[field.id]}</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Textarea fields (like message) render full width below grid */}
        {enabledFields.filter(f => f.type === 'textarea').map((field) => {
          const hasError = !!errors[field.id]
          
          return (
            <div key={field.id} className="flex flex-col">
              <label className="font-sans text-xs uppercase tracking-wider text-text-secondary font-semibold mb-2">
                {field.label} {field.required && '*'}
              </label>
              <textarea
                rows={5}
                placeholder={field.placeholder}
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className={`px-4 py-3 border bg-bg-secondary text-text-primary text-sm rounded-none resize-none ${
                  hasError ? 'border-red-500 bg-red-50/5' : 'border-accent'
                }`}
              />
              {field.helpText && (
                <span className="text-[10px] text-text-secondary mt-1 font-sans">{field.helpText}</span>
              )}
              {hasError && (
                <span className="text-[10px] text-red-500 font-semibold mt-1.5">{errors[field.id]}</span>
              )}
            </div>
          )
        })}

        {/* Feedback Messages */}
        {status === 'success' && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 p-4 font-sans text-xs font-semibold">
            <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
            {successMsg || 'Thank you! Your inquiry has been received. Our team will contact you shortly.'}
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 p-4 font-sans text-xs font-semibold">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            {errorMessage}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-4 text-xs font-sans font-bold uppercase tracking-widest text-[#032318] bg-secondary hover:bg-primary hover:text-white transition-all duration-300 disabled:bg-accent disabled:text-text-muted disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing Request...
            </span>
          ) : (
            buttonText || 'Submit Inquiry'
          )}
        </button>
      </form>
    </div>
  )
}
