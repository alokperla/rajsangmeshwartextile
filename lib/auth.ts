import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from './firebase-admin'

const getAdminEmail = () => {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@rajsangmeshwar.com').toLowerCase()
}

const isAdminEmail = (email?: string | null) => {
  const normalizedEmail = email?.toLowerCase()
  return normalizedEmail === getAdminEmail() || normalizedEmail === 'alokperla8055@gmail.com'
}

export async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or invalid Authorization header', status: 401 }
  }

  const token = authHeader.split('Bearer ')[1]
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    const uid = decodedToken.uid
    const email = decodedToken.email || ''

    const userDoc = await adminDb.collection('users').doc(uid).get()
    let userData = userDoc.data()

    const isAdmin = isAdminEmail(email) || userData?.role === 'ADMIN'

    if (!userData) {
      await adminDb.collection('users').doc(uid).set({
        email,
        role: isAdmin ? 'ADMIN' : 'CUSTOMER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true })
      userData = { role: isAdmin ? 'ADMIN' : 'CUSTOMER', email }
    } else if (isAdmin && userData.role !== 'ADMIN') {
      await userDoc.ref.set({ role: 'ADMIN', updatedAt: new Date().toISOString() }, { merge: true })
      userData = { ...userData, role: 'ADMIN' }
    }

    if (!isAdmin) {
      return { error: 'Forbidden: Admin access required', status: 403 }
    }

    return { uid, userData }
  } catch (error) {
    console.error('Error verifying admin token:', error)
    return { error: 'Unauthorized', status: 401 }
  }
}

export async function verifyUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or invalid Authorization header', status: 401 }
  }

  const token = authHeader.split('Bearer ')[1]
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    return { uid: decodedToken.uid }
  } catch (error) {
    console.error('Error verifying user token:', error)
    return { error: 'Unauthorized', status: 401 }
  }
}

export async function getUserIdFromRequest(request: NextRequest) {
  const authCheck = await verifyUser(request)

  if ('error' in authCheck || !authCheck.uid) {
    return null
  }

  return authCheck.uid
}
