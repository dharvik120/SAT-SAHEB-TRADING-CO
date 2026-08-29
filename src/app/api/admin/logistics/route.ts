import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getLogisticsNodes, 
  addLogisticsNode, 
  updateLogisticsNode, 
  deleteLogisticsNode,
  isFirebaseConfigured
} from '@/lib/firebaseDb'
import { doc, writeBatch } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'

export async function GET() {
  try {
    const nodes = await getLogisticsNodes()
    return NextResponse.json({ nodes })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch logistics nodes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce settings/layout permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['settings']?.edit) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { name, xCoord, yCoord, info, type, isEnabled } = body

    if (!name || xCoord === undefined || yCoord === undefined || !type) {
      return NextResponse.json({ error: 'Name, coordinates, and Type are required' }, { status: 400 })
    }

    const nodes = await getLogisticsNodes()
    const nextOrder = nodes.length > 0 ? Math.max(...nodes.map((n: any) => n.order ?? 0)) + 1 : 0

    const node = await addLogisticsNode({
      name,
      xCoord: parseFloat(xCoord),
      yCoord: parseFloat(yCoord),
      info: info || '',
      type,
      isEnabled: isEnabled !== undefined ? isEnabled : true,
      order: nextOrder,
    })

    return NextResponse.json({ success: true, node })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create logistics node' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce settings/layout permissions
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
          const docRef = doc(firestore, 'logisticsNodes', id.toString())
          batch.update(docRef, { order: idx })
        })
        await batch.commit()
      }

      return NextResponse.json({ success: true })
    }

    // Standard update
    const { id, name, xCoord, yCoord, info, type, isEnabled } = body
    if (!id) {
      return NextResponse.json({ error: 'Node ID is required' }, { status: 400 })
    }

    const updated = await updateLogisticsNode(id, {
      ...(name !== undefined && { name }),
      ...(xCoord !== undefined && { xCoord: parseFloat(xCoord) }),
      ...(yCoord !== undefined && { yCoord: parseFloat(yCoord) }),
      ...(info !== undefined && { info }),
      ...(type !== undefined && { type }),
      ...(isEnabled !== undefined && { isEnabled: Boolean(isEnabled) }),
    })

    return NextResponse.json({ success: true, node: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update logistics node' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce settings/layout permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['settings']?.edit) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await deleteLogisticsNode(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete logistics node' }, { status: 500 })
  }
}
