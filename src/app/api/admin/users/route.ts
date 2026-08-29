import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import { isFirebaseConfigured } from '@/lib/firebaseDb'

// GET /api/admin/users - List all users
export async function GET() {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ensure Super Admin or user management permission
  if (session.role !== 'SUPER_ADMIN' && !session.permissions['users']?.view) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    if (!isFirebaseConfigured) {
      // In SQLite mode, return dummy list
      return NextResponse.json({
        users: [
          {
            uid: 'sqlite_super_admin',
            email: session.email,
            name: session.name,
            role: 'SUPER_ADMIN',
            status: 'active',
            permissions: session.permissions
          }
        ]
      })
    }

    const snap = await getDocs(collection(firestore, 'users'))
    const users: any[] = []
    snap.forEach(doc => {
      users.push(doc.data())
    })

    return NextResponse.json({ users })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/admin/users - Create a new admin user
export async function POST(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'SUPER_ADMIN' && !session.permissions['users']?.create) {
    return NextResponse.json({ error: 'Forbidden: Super Admin only' }, { status: 403 })
  }

  try {
    const { name, email, password, role, status, permissions } = await req.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    if (!isFirebaseConfigured) {
      return NextResponse.json({ error: 'Firebase is not configured yet. Set up environment variables first.' }, { status: 400 })
    }

    // 1. Create User in Firebase Authentication database
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    const signupRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }
    )

    if (!signupRes.ok) {
      const errData = await signupRes.json()
      return NextResponse.json({ error: errData.error?.message || 'Authentication creation failed' }, { status: 400 })
    }

    const signupData = await signupRes.json()
    const uid = signupData.localId

    // Send invitation / password reset email to the new administrator
    try {
      await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestType: 'PASSWORD_RESET',
            email
          })
        }
      )
    } catch (e) {
      console.error('Failed to send invitation email:', e)
    }

    // 2. Save user profile metadata and permissions in Cloud Firestore
    const userDocRef = doc(firestore, 'users', uid)
    const userPayload = {
      uid,
      email,
      name,
      role,
      status: status || 'active',
      profileImageUrl: '',
      permissions: permissions || {}
    }
    try {
      await setDoc(userDocRef, userPayload)
    } catch (err) {
      console.warn('Server-side setDoc failed (Rules/Permissions), profile will be created by client-side:', err)
    }

    return NextResponse.json({ success: true, user: userPayload })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 })
  }
}

// PUT /api/admin/users - Update an admin user profile or permissions
export async function PUT(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'SUPER_ADMIN' && !session.permissions['users']?.edit) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { uid, name, role, status, permissions } = await req.json()

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 })
    }

    const userDocRef = doc(firestore, 'users', uid)
    const userSnap = await getDoc(userDocRef)
    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingUser = userSnap.data()

    // PROTECT PRIMARY SUPER ADMIN:
    // If the updated user is a SUPER_ADMIN, verify that they cannot be deactivated or have roles changed
    if (existingUser.role === 'SUPER_ADMIN') {
      if (status === 'inactive' || role !== 'SUPER_ADMIN') {
        return NextResponse.json({ error: 'Security Protection: The primary Super Admin account cannot be deactivated or downgraded.' }, { status: 400 })
      }
    }

    const updatePayload: any = {}
    if (name !== undefined) updatePayload.name = name
    if (role !== undefined) updatePayload.role = role
    if (status !== undefined) updatePayload.status = status
    if (permissions !== undefined) updatePayload.permissions = permissions

    try {
      await setDoc(userDocRef, updatePayload, { merge: true })
    } catch (err) {
      console.warn('Server-side setDoc failed (Rules/Permissions) for PUT, profile will be updated by client-side:', err)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 })
  }
}

// DELETE /api/admin/users - Delete an admin user
export async function DELETE(req: NextRequest) {
  const session = getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (session.role !== 'SUPER_ADMIN' && !session.permissions['users']?.delete) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get('uid')

    if (!uid) {
      return NextResponse.json({ error: 'User UID is required' }, { status: 400 })
    }

    const userDocRef = doc(firestore, 'users', uid)
    const userSnap = await getDoc(userDocRef)
    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingUser = userSnap.data()

    // PROTECT PRIMARY SUPER ADMIN:
    if (existingUser.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Security Protection: The primary Super Admin account cannot be deleted.' }, { status: 400 })
    }

    // Delete Firestore profile record
    try {
      await deleteDoc(userDocRef)
    } catch (err) {
      console.warn('Server-side deleteDoc failed (Rules/Permissions) for DELETE, profile will be deleted by client-side:', err)
    }

    // Note: Deleting Auth record is also possible with Firebase Admin SDK, but deleting the Firestore record blocks their dashboard sessions immediately.
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user' }, { status: 500 })
  }
}
