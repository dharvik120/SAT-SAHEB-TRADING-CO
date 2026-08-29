import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/storage'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as 'products' | 'partners' | 'slides' | 'logo' | null) || 'products'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload image
    const imageUrl = await uploadImage(buffer, file.name, folder)

    return NextResponse.json({ success: true, url: imageUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to upload image' }, { status: 500 })
  }
}
