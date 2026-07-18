'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useToast } from '@/lib/store'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const { showToast } = useToast()
  
  // Form State
  const [formData, setFormData] = useState({ name: '', category: 'Towels', price: '', stock: '' })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/products')
      setProducts(res.data)
    } catch (e) {
      showToast('❌ Failed to fetch products')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/admin/products', formData)
      showToast('✅ Product added successfully')
      setShowModal(false)
      setFormData({ name: '', category: 'Towels', price: '', stock: '' })
      fetchProducts()
    } catch (error) {
      showToast('❌ Failed to add product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await axios.delete(`/api/admin/products/${id}`)
      showToast('🗑️ Product deleted')
      fetchProducts()
    } catch (error) {
      showToast('❌ Failed to delete product')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Products</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Stock</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No products found. Add one above!</td></tr>
            ) : (
              products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">₹{p.price}</td>
                  <td className="px-6 py-4 text-slate-600">{p.stock}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                  <option>Bath Towels</option>
                  <option>Hand Towels</option>
                  <option>Bedsheets</option>
                  <option>Napkins</option>
                  <option>Pillow Covers</option>
                  <option>Blankets</option>
                  <option>Curtains</option>
                  <option>Sets</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                  <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
