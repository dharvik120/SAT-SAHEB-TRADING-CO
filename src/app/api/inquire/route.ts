import { NextRequest, NextResponse } from 'next/server'
import { getWebsiteSettings, addInquiry } from '@/lib/firebaseDb'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Get form fields configuration from database settings
    const settings = await getWebsiteSettings()
    let formFields: any[] = []
    
    if (settings?.formFields) {
      try {
        formFields = typeof settings.formFields === 'string' ? JSON.parse(settings.formFields) : (settings.formFields || [])
      } catch (e) {
        console.error('Failed to parse formFields settings', e)
      }
    }

    // Dynamic Validation
    for (const field of formFields) {
      if (field.enabled && field.required) {
        const val = body[field.id]
        if (val === undefined || val === null || String(val).trim() === '') {
          return NextResponse.json({ error: `${field.label || field.id} is required` }, { status: 400 })
        }
      }
      
      // Basic email validation if applicable
      if (field.enabled && field.type === 'email' && body[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(body[field.id])) {
          return NextResponse.json({ error: `Invalid email address format` }, { status: 400 })
        }
      }
    }

    // Segregate core fields and dynamic values
    const coreKeys = ['name', 'email', 'phone', 'company', 'country', 'state', 'productInterest', 'message']
    const data: any = {
      name: body.name || '',
      email: body.email || '',
      phone: body.phone || '',
      company: body.company || '',
      country: body.country || '',
      state: body.state || '',
      productInterest: body.productInterest || '',
      message: body.message || '',
    }

    const dynamicValues: Record<string, any> = {}
    for (const key in body) {
      if (!coreKeys.includes(key)) {
        dynamicValues[key] = body[key]
      }
    }
    
    data.dynamicValues = JSON.stringify(dynamicValues)

    // Save in Firebase Firestore
    const inquiry = await addInquiry(data)

    return NextResponse.json({ success: true, id: inquiry.id })
  } catch (error: any) {
    console.error('Inquiry submission error:', error)
    return NextResponse.json({ error: error.message || 'Failed to submit inquiry' }, { status: 500 })
  }
}
