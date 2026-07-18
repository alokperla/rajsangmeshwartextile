import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { getUserIdFromRequest } from '@/lib/auth'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: NextRequest) {
  try {
    // Try to get user ID from token; if missing/invalid, treat as guest checkout
    let userId = await getUserIdFromRequest(request)
    if (!userId) {
      // generate a temporary guest identifier
      userId = `guest_${Date.now()}`
    }
    console.log('🛒 Order request - userId:', userId)

    // Extract payload
    const { address, items: clientItems } = await request.json()
    console.log('🛒 Order payload:', { address, clientItems })

    let cartItems: any[] = []
    if (clientItems && clientItems.length) {
      cartItems = clientItems
      console.log('🛒 Received client items (guest):', cartItems)
    } else {
      const cartItemsSnapshot = await adminDb
        .collection('carts')
        .doc(userId)
        .collection('items')
        .get()

      cartItems = cartItemsSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      }))
      console.log('🛒 Fetched cart items (auth):', cartItems)    }

    if (!cartItems.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const total = cartItems.reduce((sum: number, item: any) => sum + (item.product?.price ?? item.price ?? 0) * item.quantity, 0)

    const orderRef = await adminDb.collection('orders').add({
      userId,
      total,
      address,
      status: 'alive',
      paymentMethod: 'COD',
      items: cartItems.map((item: any) => ({
        productId: item.productId ?? item.product?.id,
        product: item.product ?? {},
        quantity: item.quantity,
        price: item.price ?? item.product?.price
      })),
      createdAt: new Date().toISOString()
    })

    const batch = adminDb.batch()
    const cartRef = adminDb.collection('carts').doc(userId)
    const itemsRef = cartRef.collection('items')
    const existingItems = await itemsRef.get()

    const stockBatch = adminDb.batch()
    cartItems.forEach((item: any) => {
      const productId = item.productId ?? item.product?.id
      if (!productId) {
        console.warn('🛒 Skipping stock update: missing productId', item)
        return
      }
      const productRef = adminDb.collection('products').doc(productId)
      stockBatch.update(productRef, {
        stock: FieldValue.increment(-item.quantity)
      })
    })

    existingItems.forEach((doc: any) => batch.delete(doc.ref))
    // Commit both batch operations and handle any errors
    try {
      await Promise.all([batch.commit(), stockBatch.commit()])
    } catch (commitErr) {
      console.error('🛒 Batch commit error:', commitErr)
      throw commitErr
    }

    // Notify admin via email (include guest identifier if no customer email)
    try {
      const { sendOrderNotification } = await import('@/lib/email')
      await sendOrderNotification({
        orderId: orderRef.id,
        // client may send email in future; for now null
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
    console.error('Error placing order:', error instanceof Error ? error.stack : error)
    // Return full error information for debugging (remove before production)
    const errorMessage = error instanceof Error ? `${error.message}\n${error.stack}` : String(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}