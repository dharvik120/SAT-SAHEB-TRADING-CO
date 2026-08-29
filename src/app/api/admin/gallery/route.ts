import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getGalleryImages, 
  addGalleryImage, 
  updateGalleryImage, 
  deleteGalleryImage 
} from '@/lib/firebaseDb'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

// GET all gallery images
export async function GET() {
  try {
    const images = await getGalleryImages()
    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gallery images' }, { status: 500 })
  }
}

// POST - Create a new gallery image
export async function POST(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['gallery']?.create) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to create gallery images' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { title, caption, url, category, order, isEnabled } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 })
    }

    const image = await addGalleryImage({
      title: title.trim(),
      caption: caption?.trim() || '',
      url: url.trim(),
      category: category?.trim() || 'General',
      order: order ?? 0,
      isEnabled: isEnabled ?? true,
    })

    revalidatePath('/gallery')
    revalidatePath('/admin')
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create gallery image' }, { status: 500 })
  }
}

// PUT - Update an existing gallery image
export async function PUT(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['gallery']?.edit) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to edit gallery images' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { id, ...rest } = body

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    const updated = await updateGalleryImage(id, {
      ...(rest.title !== undefined && { title: rest.title.trim() }),
      ...(rest.caption !== undefined && { caption: rest.caption.trim() }),
      ...(rest.url !== undefined && { url: rest.url.trim() }),
      ...(rest.category !== undefined && { category: rest.category.trim() }),
      ...(rest.order !== undefined && { order: Number(rest.order) }),
      ...(rest.isEnabled !== undefined && { isEnabled: Boolean(rest.isEnabled) }),
    })

    revalidatePath('/gallery')
    revalidatePath('/admin')
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 })
  }
}

// DELETE - Remove a gallery image
export async function DELETE(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['gallery']?.delete) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to delete gallery images' }, { status: 403 })
  }

  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 })
    }

    await deleteGalleryImage(id)

    revalidatePath('/gallery')
    revalidatePath('/admin')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 })
  }
}
