import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from './firebase-admin'

export async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or invalid Authorization header', status: 401 }
  }

  const token = authHeader.split('Bearer ')[1]
  
  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    const uid = decodedToken.uid

    // Check role in Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get()
    const userData = userDoc.data()

    if (!userData || userData.role !== 'ADMIN') {
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
