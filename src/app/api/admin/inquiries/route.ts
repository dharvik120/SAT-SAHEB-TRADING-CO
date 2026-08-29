import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getInquiries, 
  updateInquiryStatus, 
  deleteInquiry 
} from '@/lib/firebaseDb'

// GET /api/admin/inquiries - List and filter inquiries
export async function GET(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['inquiries']?.view) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to view inquiries' }, { status: 403 })
  }

  try {
    const url = new URL(req.url)
    const search = (url.searchParams.get('search') || '').toLowerCase()
    const filter = url.searchParams.get('filter') || 'all' // all, unread, read, replied

    const allInquiries = await getInquiries()
    
    // Filter and search locally
    let inquiries = allInquiries

    if (search) {
      inquiries = inquiries.filter((inq: any) => 
        (inq.name || '').toLowerCase().includes(search) ||
        (inq.email || '').toLowerCase().includes(search) ||
        (inq.phone || '').toLowerCase().includes(search) ||
        (inq.message || '').toLowerCase().includes(search) ||
        (inq.company || '').toLowerCase().includes(search)
      )
    }

    if (filter === 'unread') {
      inquiries = inquiries.filter((inq: any) => inq.status === 'unread' || !inq.isRead)
    } else if (filter === 'read') {
      inquiries = inquiries.filter((inq: any) => inq.status === 'read' || inq.isRead)
    } else if (filter === 'replied') {
      inquiries = inquiries.filter((inq: any) => inq.status === 'replied' || inq.isReplied)
    }

    return NextResponse.json({ inquiries })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch inquiries' }, { status: 500 })
  }
}

// PUT /api/admin/inquiries - Mark as read/replied
export async function PUT(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['inquiries']?.edit) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to edit inquiries' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { id, status } = body

    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 })
    }

    await updateInquiryStatus(id, status || 'read')
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update inquiry' }, { status: 500 })
  }
}

// DELETE /api/admin/inquiries - Delete inquiry
export async function DELETE(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['inquiries']?.delete) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to delete inquiries' }, { status: 403 })
  }

  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID is required' }, { status: 400 })
    }

    await deleteInquiry(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete inquiry' }, { status: 500 })
  }
}
