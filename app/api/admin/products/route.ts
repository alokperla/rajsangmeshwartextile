import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { verifyAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const adminCheck = await verifyAdmin(request)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  try {
    const data = await request.json()
    
    // Default values if missing
    const newProduct = {
      name: data.name,
      category: data.category || 'Towels',
      price: Number(data.price) || 0,
      image: data.image || '/placeholder.jpg',
      description: data.description || '',
      stock: Number(data.stock) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const docRef = await adminDb.collection('products').add(newProduct)

    return NextResponse.json({ id: docRef.id, ...newProduct })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
