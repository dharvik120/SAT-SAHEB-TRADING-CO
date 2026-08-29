import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getProducts, 
  getCategories, 
  addProduct, 
  updateProduct, 
  deleteProduct,
  isFirebaseConfigured
} from '@/lib/firebaseDb'
import { doc, writeBatch } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

// GET /api/admin/products - List all products
export async function GET() {
  try {
    const products = await getProducts()
    const categories = await getCategories()
    return NextResponse.json({ products, categories })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/admin/products - Create a new product
export async function POST(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['products']?.create) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to create products' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { title, featuredImage, overview, description, specifications, categoryId, metaTitle, metaDescription, isFeatured, gallery } = body

    if (!title || !featuredImage || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const slug = slugify(title)
    const products = await getProducts()

    // Check slug uniqueness
    const existing = products.find((p: any) => p.slug === slug)
    if (existing) {
      return NextResponse.json({ error: 'A product with this title already exists' }, { status: 400 })
    }

    // Get current max order
    const nextOrder = products.length > 0 ? Math.max(...products.map((p: any) => p.order ?? 0)) + 1 : 0

    const galleryData = gallery && Array.isArray(gallery) && gallery.length > 0
      ? gallery.map((url: string, idx: number) => ({ url, order: idx }))
      : [{ url: featuredImage, order: 0 }]

    const productPayload = {
      title,
      slug,
      featuredImage,
      overview: overview || '',
      description: description || '',
      specifications: specifications || '[]',
      categoryId: parseInt(categoryId),
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      order: nextOrder,
      featuredOrder: nextOrder,
      isEnabled: true,
      isFeatured: isFeatured !== undefined ? isFeatured : true,
      images: galleryData
    }

    const product = await addProduct(productPayload)
    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 })
  }
}

// PUT /api/admin/products - Update product or reorder them
export async function PUT(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { action } = body

    // Drag-and-drop Reordering Action
    if (action === 'reorder' || action === 'reorder-featured') {
      const { orderedIds } = body
      if (!Array.isArray(orderedIds)) {
        return NextResponse.json({ error: 'orderedIds array is required' }, { status: 400 })
      }

      // Enforce edit permission
      if (session.role !== 'SUPER_ADMIN' && !session.permissions['products']?.edit) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      if (isFirebaseConfigured) {
        const batch = writeBatch(firestore)
        orderedIds.forEach((id: string | number, idx: number) => {
          const docRef = doc(firestore, 'products', id.toString())
          const field = action === 'reorder-featured' ? 'featuredOrder' : 'order'
          batch.update(docRef, { [field]: idx })
        })
        await batch.commit()
      }
      return NextResponse.json({ success: true })
    }

    // Standard CRUD Update Action
    if (session.role !== 'SUPER_ADMIN' && !session.permissions['products']?.edit) {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to edit products' }, { status: 403 })
    }

    const { id, title, featuredImage, overview, description, specifications, categoryId, metaTitle, metaDescription, isEnabled, isFeatured, featuredOrder, gallery } = body
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const products = await getProducts()
    const currentProduct = products.find((p: any) => p.id.toString() === id.toString())
    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const updatedSlug = (title && title !== currentProduct.title) ? slugify(title) : currentProduct.slug

    const galleryData = gallery !== undefined && Array.isArray(gallery)
      ? (gallery.length > 0 ? gallery.map((url: string, idx: number) => ({ url, order: idx })) : [{ url: featuredImage || currentProduct.featuredImage, order: 0 }])
      : currentProduct.images

    const productPayload = {
      title: title !== undefined ? title : currentProduct.title,
      slug: updatedSlug,
      featuredImage: featuredImage !== undefined ? featuredImage : currentProduct.featuredImage,
      overview: overview !== undefined ? overview : currentProduct.overview,
      description: description !== undefined ? description : currentProduct.description,
      specifications: specifications !== undefined ? specifications : currentProduct.specifications,
      categoryId: categoryId !== undefined ? parseInt(categoryId) : currentProduct.categoryId,
      metaTitle: metaTitle !== undefined ? metaTitle : currentProduct.metaTitle,
      metaDescription: metaDescription !== undefined ? metaDescription : currentProduct.metaDescription,
      isEnabled: isEnabled !== undefined ? isEnabled : currentProduct.isEnabled,
      isFeatured: isFeatured !== undefined ? isFeatured : currentProduct.isFeatured,
      featuredOrder: featuredOrder !== undefined ? parseInt(featuredOrder) : currentProduct.featuredOrder,
      images: galleryData
    }

    const updated = await updateProduct(id, productPayload)
    return NextResponse.json({ success: true, product: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/admin/products - Delete product
export async function DELETE(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['products']?.delete) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to delete products' }, { status: 403 })
  }

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 })
  }
}
