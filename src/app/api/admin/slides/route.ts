import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getHeroSlides, 
  addHeroSlide, 
  updateHeroSlide, 
  deleteHeroSlide,
  isFirebaseConfigured
} from '@/lib/firebaseDb'
import { doc, writeBatch } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'

// GET /api/admin/slides - Fetch all slides
export async function GET() {
  try {
    const slides = await getHeroSlides()
    return NextResponse.json({ slides })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch slides' }, { status: 500 })
  }
}

// POST /api/admin/slides - Create a new slide
export async function POST(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce settings edit permissions for layout configuration
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['settings']?.edit) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { title, subtitle, description, imageUrl, mobileImageUrl, primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink, alignment } = body

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and Image URL are required' }, { status: 400 })
    }

    const slides = await getHeroSlides()
    const nextOrder = slides.length > 0 ? Math.max(...slides.map((s: any) => s.order ?? 0)) + 1 : 0

    const slide = await addHeroSlide({
      title,
      subtitle: subtitle || '',
      description: description || '',
      imageUrl,
      mobileImageUrl: mobileImageUrl || null,
      primaryCtaText: primaryCtaText || null,
      primaryCtaLink: primaryCtaLink || null,
      secondaryCtaText: secondaryCtaText || null,
      secondaryCtaLink: secondaryCtaLink || null,
      alignment: alignment || 'left',
      order: nextOrder,
      isEnabled: true,
    })

    return NextResponse.json({ success: true, slide })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create slide' }, { status: 500 })
  }
}

// PUT /api/admin/slides - Update slide or reorder slides
export async function PUT(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce settings edit permissions for layout configuration
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['settings']?.edit) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { action } = body

    // Reorder action
    if (action === 'reorder') {
      const { orderedIds } = body
      if (!Array.isArray(orderedIds)) {
        return NextResponse.json({ error: 'orderedIds array is required' }, { status: 400 })
      }

      if (isFirebaseConfigured) {
        const batch = writeBatch(firestore)
        orderedIds.forEach((id: string | number, idx: number) => {
          const docRef = doc(firestore, 'heroSlides', id.toString())
          batch.update(docRef, { order: idx })
        })
        await batch.commit()
      }

      return NextResponse.json({ success: true })
    }

    // Standard update
    const { id, title, subtitle, description, imageUrl, mobileImageUrl, primaryCtaText, primaryCtaLink, secondaryCtaText, secondaryCtaLink, alignment, isEnabled } = body
    if (!id) {
      return NextResponse.json({ error: 'Slide ID is required' }, { status: 400 })
    }

    const updated = await updateHeroSlide(id, {
      ...(title !== undefined && { title }),
      ...(subtitle !== undefined && { subtitle }),
      ...(description !== undefined && { description }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(mobileImageUrl !== undefined && { mobileImageUrl }),
      ...(primaryCtaText !== undefined && { primaryCtaText }),
      ...(primaryCtaLink !== undefined && { primaryCtaLink }),
      ...(secondaryCtaText !== undefined && { secondaryCtaText }),
      ...(secondaryCtaLink !== undefined && { secondaryCtaLink }),
      ...(alignment !== undefined && { alignment }),
      ...(isEnabled !== undefined && { isEnabled: Boolean(isEnabled) }),
    })

    return NextResponse.json({ success: true, slide: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update slide' }, { status: 500 })
  }
}

// DELETE /api/admin/slides - Delete slide
export async function DELETE(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce settings edit permissions for layout configuration
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['settings']?.edit) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Slide ID is required' }, { status: 400 })
    }

    await deleteHeroSlide(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete slide' }, { status: 500 })
  }
}
