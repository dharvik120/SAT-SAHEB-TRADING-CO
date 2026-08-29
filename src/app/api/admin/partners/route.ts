import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getPartners, 
  addPartner, 
  updatePartner, 
  deletePartner,
  isFirebaseConfigured
} from '@/lib/firebaseDb'
import { doc, writeBatch } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'

// GET /api/admin/partners - List all partners
export async function GET() {
  try {
    const partners = await getPartners()
    return NextResponse.json({ partners })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch partners' }, { status: 500 })
  }
}

// POST /api/admin/partners - Add a new partner
export async function POST(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['partners']?.create) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to add partners' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { name, role, description, phone, imageUrl } = body

    if (!name || !imageUrl) {
      return NextResponse.json({ error: 'Name and Image URL are required' }, { status: 400 })
    }

    const partners = await getPartners()
    const nextOrder = partners.length > 0 ? Math.max(...partners.map((p: any) => p.order ?? 0)) + 1 : 0

    const partner = await addPartner({
      name,
      role: role || 'Founder & Managing Partner',
      description: description || '',
      phone: phone || '',
      imageUrl,
      order: nextOrder,
      isVisible: true,
    })

    return NextResponse.json({ success: true, partner })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create partner' }, { status: 500 })
  }
}

// PUT /api/admin/partners - Update partner or reorder them
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
      if (session.role !== 'SUPER_ADMIN' && !session.permissions['partners']?.edit) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      if (isFirebaseConfigured) {
        const batch = writeBatch(firestore)
        orderedIds.forEach((id: string | number, idx: number) => {
          const docRef = doc(firestore, 'partners', id.toString())
          batch.update(docRef, { order: idx })
        })
        await batch.commit()
      }

      return NextResponse.json({ success: true })
    }

    // Standard update
    if (session.role !== 'SUPER_ADMIN' && !session.permissions['partners']?.edit) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to edit partners' }, { status: 403 })
    }

    const { id, name, role, description, phone, imageUrl, isVisible } = body
    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 })
    }

    const updated = await updatePartner(id, {
      ...(name !== undefined && { name }),
      ...(role !== undefined && { role }),
      ...(description !== undefined && { description }),
      ...(phone !== undefined && { phone }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isVisible !== undefined && { isVisible: Boolean(isVisible) }),
    })

    return NextResponse.json({ success: true, partner: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update partner' }, { status: 500 })
  }
}

// DELETE /api/admin/partners - Delete a partner
export async function DELETE(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['partners']?.delete) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to delete partners' }, { status: 403 })
  }

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 })
    }

    await deletePartner(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete partner' }, { status: 500 })
  }
}
