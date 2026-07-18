import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { verifyUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const authCheck = await verifyUser(request)
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
  }

  try {
    const uid = authCheck.uid
    const cartSnapshot = await adminDb.collection('carts').doc(uid).collection('items').get()
    
    const items = cartSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await verifyUser(request)
  if (authCheck.error) {
    return NextResponse.json({ error: authCheck.error }, { status: authCheck.status })
  }

  try {
    const uid = authCheck.uid
    const { productId, quantity } = await request.json()

    // Fetch product details to store in cart (for fast rendering without JOINs)
    const productDoc = await adminDb.collection('products').doc(productId).get()
    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const productData = { id: productDoc.id, ...productDoc.data() }

    // Check if item already exists in cart
    const itemsRef = adminDb.collection('carts').doc(uid).collection('items')
    const existingItemQuery = await itemsRef.where('product.id', '==', productId).get()

    if (!existingItemQuery.empty) {
      // Update quantity
      const docId = existingItemQuery.docs[0].id
      const currentQty = existingItemQuery.docs[0].data().quantity
      await itemsRef.doc(docId).update({
        quantity: currentQty + quantity,
        updatedAt: new Date().toISOString()
      })
    } else {
      // Add new item
      await itemsRef.add({
        product: productData,
        quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 })
  }
}