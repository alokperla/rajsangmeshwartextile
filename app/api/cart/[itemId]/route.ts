import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { verifyUser } from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ itemId?: string }> }) {
  const authCheck = await verifyUser(request)
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
  }

  try {
    const uid = authCheck.uid
    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const itemId = resolvedParams.itemId
    const itemIdValue = typeof itemId === 'string' ? itemId : ''

    if (!itemIdValue.trim()) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
    }

    await adminDb.collection('carts').doc(uid).collection('items').doc(itemIdValue).delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 })
  }
}
