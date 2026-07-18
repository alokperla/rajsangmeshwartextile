import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json([], { status: 200 })
    }

    const productsSnapshot = await adminDb.collection('products').get()
    const products = productsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json([], { status: 200 })
  }
}