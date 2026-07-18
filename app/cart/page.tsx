'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart, useAuth } from '../../lib/store'
import axios from 'axios'

export default function Cart() {
  const { items, removeFromCart, fetchCart } = useCart()
  const { user, initialize } = useAuth()
  const [address, setAddress] = useState('')
  const router = useRouter()

  useEffect(() => {
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (user || token) {
        fetchCart()
      }
    }
  }, [user])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
          <p className="text-yellow-600 mb-4">Please login to view your cart</p>
          <a href="/login" className="inline-flex rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">
            Login
          </a>
        </div>
      </div>
    )
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 99 : 0
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (!address.trim()) {
      alert('Please enter a delivery address')
      return
    }
    try {
      await axios.post('/api/orders', { address })
      alert('Order placed successfully!')
      setAddress('')
      await fetchCart()
      router.push('/')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to place order')
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="rounded-[2rem] bg-white/95 p-8 shadow-2xl ring-1 ring-slate-200 backdrop-blur-sm">
        <h1 className="text-3xl font-semibold text-slate-900 mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <p className="text-slate-600">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{item.product.name}</h3>
                    <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-slate-600">Price: ₹{item.product.price * item.quantity}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="rounded-full bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>Delivery / Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-slate-700">Delivery Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-200"
                  rows={3}
                  required
                />
              </div>
              <button
                onClick={handleCheckout}
                className="mt-6 rounded-full bg-green-600 px-6 py-3 text-white transition hover:bg-green-700"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}