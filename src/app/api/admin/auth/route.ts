import { NextRequest, NextResponse } from 'next/server'
import { db as prismaDb } from '@/lib/db'
import { signToken, setSessionCookie, removeSessionCookie, getSession } from '@/lib/auth'
import { isFirebaseConfigured } from '@/lib/firebaseDb'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from '@/lib/firebase'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Helper to manage dynamic Super Admin profile tracking
function getSuperAdminInfo() {
  const defaultInfo = {
    email: 'satsahebtrading126@gmail.com',
    uids: [] as string[]
  }
  try {
    const isVercel = !!process.env.VERCEL
    const filePath = isVercel 
      ? path.join('/tmp', 'superadmin.json')
      : path.join(process.cwd(), 'src', 'lib', 'superadmin.json')
      
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(data)
    } else {
      if (!isVercel) {
        const dirPath = path.dirname(filePath)
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true })
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(defaultInfo, null, 2), 'utf8')
    }
  } catch (e) {
    console.error('Failed to read/create superadmin.json:', e)
  }
  return defaultInfo
}

function saveSuperAdminInfo(info: any) {
  try {
    const isVercel = !!process.env.VERCEL
    const filePath = isVercel 
      ? path.join('/tmp', 'superadmin.json')
      : path.join(process.cwd(), 'src', 'lib', 'superadmin.json')
    fs.writeFileSync(filePath, JSON.stringify(info, null, 2), 'utf8')
  } catch (e) {
    console.error('Failed to write superadmin.json:', e)
  }
}


// GET /api/admin/auth - Check current session
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const resolveUsername = searchParams.get('resolveUsername')

  if (resolveUsername) {
    try {
      const usernameLower = resolveUsername.trim().toLowerCase()

      // 1. Check default Super Admin username
      if (usernameLower === 'admin') {
        return NextResponse.json({ email: 'satsahebtrading126@gmail.com' })
      }

      // 2. Query Firestore 'users' collection for matching name
      if (isFirebaseConfigured) {
        try {
          const { collection, query, where, getDocs } = await import('firebase/firestore')
          const q = query(collection(firestore, 'users'), where('name', '==', resolveUsername.trim()))
          const snap = await getDocs(q)
          if (!snap.empty) {
            const userData = snap.docs[0].data()
            if (userData.email) {
              return NextResponse.json({ email: userData.email })
            }
          }
        } catch (e) {
          console.error('Firestore username resolution failed:', e)
        }
      }

      // 3. Fallback to SQLite AdminUser lookup
      const admin = await prismaDb.adminUser.findUnique({ where: { username: resolveUsername.trim() } })
      if (admin) {
        return NextResponse.json({ email: resolveUsername.trim() + '@satsahebtrading.com' })
      }

      return NextResponse.json({ error: 'Username not found' }, { status: 404 })
    } catch (err: any) {
      return NextResponse.json({ error: err.message || 'Lookup failed' }, { status: 500 })
    }
  }

  const session = getSession()
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true, user: session })
}

// POST /api/admin/auth - Login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. FALLBACK MODE: If Firebase is not configured, support original SQLite login
    if (!isFirebaseConfigured) {
      const { username, password } = body
      if (!username || !password) {
        return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
      }

      const admin = await prismaDb.adminUser.findUnique({ where: { username } })
      if (!admin) {
        return NextResponse.json({ error: 'Invalid credentials (SQLite)' }, { status: 401 })
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash)
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid credentials (SQLite)' }, { status: 401 })
      }

      // Generate a Super Admin payload for compilation safety
      const token = signToken({
        userId: admin.id.toString(),
        email: admin.username + '@satsahebtrading.com',
        name: admin.username.toUpperCase(),
        role: 'SUPER_ADMIN',
        status: 'active',
        permissions: {
          products: { view: true, create: true, edit: true, delete: true },
          gallery: { view: true, create: true, edit: true, delete: true },
          settings: { view: true, create: true, edit: true, delete: true },
          inquiries: { view: true, create: true, edit: true, delete: true },
          users: { view: true, create: true, edit: true, delete: true }
        }
      })
      setSessionCookie(token)
      return NextResponse.json({ success: true, user: { id: admin.id, username: admin.username } })
    }

    // 2. FIREBASE MODE: Verify ID Token
    const { idToken } = body
    if (!idToken) {
      return NextResponse.json({ error: 'Firebase ID Token is required' }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken })
      }
    )

    if (!verifyRes.ok) {
      const errData = await verifyRes.json()
      return NextResponse.json({ error: errData.error?.message || 'Invalid Firebase ID Token' }, { status: 401 })
    }

    const verifyData = await verifyRes.json()
    const firebaseUser = verifyData.users?.[0]
    if (!firebaseUser) {
      return NextResponse.json({ error: 'User lookup failed' }, { status: 401 })
    }

    const uid = firebaseUser.localId
    const email = firebaseUser.email

    // Get Firestore user document with a try/catch safety boundary
    const superAdminInfo = getSuperAdminInfo()
    let isSuperAdminEmail = 
      email.toLowerCase() === 'satsahebtrading126@gmail.com' ||
      email.toLowerCase() === 'dharvikkk@gmail.com' ||
      email.toLowerCase() === superAdminInfo.email.toLowerCase() ||
      superAdminInfo.uids.includes(uid)

    // Automatically sync and save the tracked Super Admin details if matched
    if (isSuperAdminEmail) {
      let updated = false
      if (!superAdminInfo.uids.includes(uid)) {
        superAdminInfo.uids.push(uid)
        updated = true
      }
      if (superAdminInfo.email.toLowerCase() !== email.toLowerCase()) {
        superAdminInfo.email = email.toLowerCase()
        updated = true
      }
      if (updated) {
        saveSuperAdminInfo(superAdminInfo)
      }
    }

    let userData: any = null

    try {
      const userDocRef = doc(firestore, 'users', uid)
      const userSnap = await getDoc(userDocRef)
      if (userSnap.exists()) {
        userData = userSnap.data()
        
        // Force SUPER_ADMIN override if this UID is mapped as the Super Admin
        if (isSuperAdminEmail && userData.role !== 'SUPER_ADMIN') {
          userData.role = 'SUPER_ADMIN'
        }

        // Automatically sync email if it was changed in Firebase Auth
        if (userData.email !== email) {
          userData.email = email
          await setDoc(userDocRef, { email, role: userData.role, updatedAt: new Date().toISOString() }, { merge: true })
          console.log(`Automatically synchronized email to ${email} for UID ${uid} in Firestore.`)
        }
      }
    } catch (err) {
      console.error('Firestore user lookup failed, verifying Super Admin fallback:', err)
    }

    // Auto-seed or bypass if this is the default Super Admin
    if (!userData && isSuperAdminEmail) {
      userData = {
        uid,
        email,
        name: 'admin',
        role: 'SUPER_ADMIN',
        status: 'active',
        profileImageUrl: '',
        permissions: {
          dashboard: { view: true, create: true, edit: true, delete: true },
          settings: { view: true, create: true, edit: true, delete: true },
          theme: { view: true, create: true, edit: true, delete: true },
          footer: { view: true, create: true, edit: true, delete: true },
          about: { view: true, create: true, edit: true, delete: true },
          contact: { view: true, create: true, edit: true, delete: true },
          formBuilder: { view: true, create: true, edit: true, delete: true },
          inquiries: { view: true, create: true, edit: true, delete: true },
          products: { view: true, create: true, edit: true, delete: true },
          categories: { view: true, create: true, edit: true, delete: true },
          gallery: { view: true, create: true, edit: true, delete: true },
          partners: { view: true, create: true, edit: true, delete: true },
          testimonials: { view: true, create: true, edit: true, delete: true },
          users: { view: true, create: true, edit: true, delete: true }
        }
      }

      // Attempt to save profile to Firestore, but do not fail if permission rules block it
      try {
        const userDocRef = doc(firestore, 'users', uid)
        await setDoc(userDocRef, {
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }, { merge: true })
      } catch (err) {
        console.warn('Could not write Super Admin document to Firestore (Security Rules restrict write):', err)
      }
    }

    if (!userData) {
      return NextResponse.json({ error: 'User data not found or database permission denied' }, { status: 401 })
    }

    if (userData.status === 'inactive') {
      return NextResponse.json({ error: 'Your account has been deactivated. Please contact Super Admin.' }, { status: 403 })
    }

    // Sign JWT and set HTTP-only cookie
    const token = signToken({
      userId: uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      status: userData.status,
      permissions: userData.permissions || {}
    })
    setSessionCookie(token)

    return NextResponse.json({ 
      success: true, 
      user: { 
        userId: uid, 
        email: userData.email, 
        name: userData.name, 
        role: userData.role,
        permissions: userData.permissions
      } 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 })
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  removeSessionCookie()
  return NextResponse.json({ success: true })
}
