import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { verifyUser } from '@/lib/auth'

export async function DELETE(request: NextRequest, { params }: { params: { itemId: string } }) {
  const authCheck = await verifyUser(request)
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
  }

  try {
    const uid = authCheck.uid
    const { itemId } = params

    await adminDb.collection('carts').doc(uid).collection('items').doc(itemId).delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 })
  }
}
