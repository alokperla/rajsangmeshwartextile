import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { getUserIdFromRequest } from '@/lib/auth'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { address } = await request.json()

    const cartItemsSnapshot = await adminDb
      .collection('carts')
      .doc(userId)
      .collection('items')
      .get()

    const cartItems = cartItemsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }))

    if (!cartItems.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const total = cartItems.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0)

    const orderRef = await adminDb.collection('orders').add({
      userId,
      total,
      address,
      status: 'alive',
      paymentMethod: 'COD',
      items: cartItems.map((item: any) => ({
        productId: item.product.id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      })),
      createdAt: new Date().toISOString()
    })

    const batch = adminDb.batch()
    const cartRef = adminDb.collection('carts').doc(userId)
    const itemsRef = cartRef.collection('items')
    const existingItems = await itemsRef.get()

    const stockBatch = adminDb.batch()
    cartItems.forEach((item: any) => {
      const productRef = adminDb.collection('products').doc(item.product.id)
      stockBatch.update(productRef, {
        stock: FieldValue.increment(-item.quantity)
      })
    })

    existingItems.forEach((doc: any) => batch.delete(doc.ref))
    await Promise.all([batch.commit(), stockBatch.commit()])

    // Notify admin via email
  try {
    const { sendOrderNotification } = await import('@/lib/email')
    await sendOrderNotification({
      orderId: orderRef.id,
      customerEmail: null,
      address,
      total,
      items: cartItems,
      paymentMethod: 'COD'
    })
  } catch (emailErr) {
    console.error('Failed to send order notification email:', emailErr)
  }

  return NextResponse.json({ id: orderRef.id, userId, total, address }, { status: 201 })
  } catch (error) {
    console.error('Error placing order:', error)
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
  }
}