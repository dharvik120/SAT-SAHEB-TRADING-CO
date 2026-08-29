import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  getProducts
} from '@/lib/firebaseDb'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json({ categories })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['categories']?.create) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to create categories' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { name, slug, description } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and Slug are required' }, { status: 400 })
    }

    const category = await addCategory({
      name,
      slug,
      description: description || '',
    })

    return NextResponse.json({ success: true, category })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['categories']?.edit) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to edit categories' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { id, name, slug, description } = body

    if (!id || !name || !slug) {
      return NextResponse.json({ error: 'ID, Name, and Slug are required' }, { status: 400 })
    }

    const updated = await updateCategory(id, {
      name,
      slug,
      description: description || '',
    })

    return NextResponse.json({ success: true, category: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['categories']?.delete) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to delete categories' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // Check if there are any products attached to this category
    const products = await getProducts()
    const productsCount = products.filter((p: any) => p.categoryId.toString() === id.toString()).length

    if (productsCount > 0) {
      return NextResponse.json({ error: 'Cannot delete category with associated products' }, { status: 400 })
    }

    await deleteCategory(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete category' }, { status: 500 })
  }
}
