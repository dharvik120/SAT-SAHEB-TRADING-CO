import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getTestimonials, 
  addTestimonial, 
  updateTestimonial, 
  deleteTestimonial,
  isFirebaseConfigured
} from '@/lib/firebaseDb'
import { doc, writeBatch } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'

// GET /api/admin/testimonials - Fetch all testimonials
export async function GET() {
  try {
    const testimonials = await getTestimonials()
    return NextResponse.json({ testimonials })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch testimonials' }, { status: 500 })
  }
}

// POST /api/admin/testimonials - Create a new testimonial
export async function POST(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['testimonials']?.create) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to create testimonials' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { name, review, rating } = body

    if (!name || !review) {
      return NextResponse.json({ error: 'Name and Review are required' }, { status: 400 })
    }

    const testimonials = await getTestimonials()
    const nextOrder = testimonials.length > 0 ? Math.max(...testimonials.map((t: any) => t.order ?? 0)) + 1 : 0

    const testimonial = await addTestimonial({
      name,
      review,
      rating: rating ? parseInt(rating) : 5,
      order: nextOrder,
      isEnabled: true,
    })

    return NextResponse.json({ success: true, testimonial })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create testimonial' }, { status: 500 })
  }
}

// PUT /api/admin/testimonials - Update or reorder testimonials
export async function PUT(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

      // Enforce granular permissions
      if (session.role !== 'SUPER_ADMIN' && !session.permissions['testimonials']?.edit) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      if (isFirebaseConfigured) {
        const batch = writeBatch(firestore)
        orderedIds.forEach((id: string | number, idx: number) => {
          const docRef = doc(firestore, 'testimonials', id.toString())
          batch.update(docRef, { order: idx })
        })
        await batch.commit()
      }

      return NextResponse.json({ success: true })
    }

    // Standard update
    if (session.role !== 'SUPER_ADMIN' && !session.permissions['testimonials']?.edit) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to edit testimonials' }, { status: 403 })
    }

    const { id, name, review, rating, isEnabled } = body
    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 })
    }

    const updated = await updateTestimonial(id, {
      ...(name !== undefined && { name }),
      ...(review !== undefined && { review }),
      ...(rating !== undefined && { rating: parseInt(rating) }),
      ...(isEnabled !== undefined && { isEnabled: Boolean(isEnabled) }),
    })

    return NextResponse.json({ success: true, testimonial: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update testimonial' }, { status: 500 })
  }
}

// DELETE /api/admin/testimonials - Delete testimonial
export async function DELETE(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['testimonials']?.delete) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to delete testimonials' }, { status: 403 })
  }

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID is required' }, { status: 400 })
    }

    await deleteTestimonial(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete testimonial' }, { status: 500 })
  }
}
