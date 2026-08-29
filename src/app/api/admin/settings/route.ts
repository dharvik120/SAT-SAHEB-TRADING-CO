import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { 
  getWebsiteSettings, 
  getThemeSettings, 
  updateWebsiteSettings, 
  updateThemeSettings 
} from '@/lib/firebaseDb'

// GET /api/admin/settings - Fetch both settings and theme config
export async function GET() {
  try {
    const settings = await getWebsiteSettings()
    const theme = await getThemeSettings()
    return NextResponse.json({ settings, theme })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch settings' }, { status: 500 })
  }
}

// POST /api/admin/settings - Update general website settings
export async function POST(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  const hasPermission = session.role === 'SUPER_ADMIN' || 
                        session.permissions['settings']?.edit || 
                        session.permissions['about']?.edit || 
                        session.permissions['contact']?.edit || 
                        session.permissions['footer']?.edit || 
                        session.permissions['formBuilder']?.edit

  if (!hasPermission) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to modify settings' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const updated = await updateWebsiteSettings(body)
    return NextResponse.json({ success: true, settings: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 })
  }
}

// PUT /api/admin/settings - Update theme styles
export async function PUT(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Enforce granular permissions
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['theme']?.edit) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to modify theme settings' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const updated = await updateThemeSettings(body)
    return NextResponse.json({ success: true, theme: updated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update theme' }, { status: 500 })
  }
}
