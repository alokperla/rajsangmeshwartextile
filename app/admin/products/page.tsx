'use client'

import { useState, useEffect } from 'react'
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth, useToast } from '@/lib/store'

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
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const { showToast } = useToast()
  const { user } = useAuth()

  const readImageAsDataUrl = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result)
        } else {
          reject(new Error('Could not read the selected image.'))
        }
      }
      reader.onerror = () => reject(new Error('Could not read the selected image.'))
      reader.readAsDataURL(file)
    })
  }
  
  // Form State
  const [formData, setFormData] = useState({ name: '', category: 'Towels', price: '', stock: '', description: '', imageUrl: '' })

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const snapshot = await getDocs(collection(db, 'products'))
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any)
      }))
      setProducts(productsData)
    } catch (e) {
      console.error('Failed to fetch products', e)
      showToast('❌ Failed to fetch products')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const resetForm = () => {
    setFormData({ name: '', category: 'Towels', price: '', stock: '', description: '', imageUrl: '' })
    setImageFile(null)
    setImagePreview('')
    setUploadMessage('')
    setEditingProductId(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setUploadMessage('Please choose an image smaller than 2MB.')
      showToast('⚠️ Please choose an image smaller than 2MB.')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setUploadMessage('Image selected. It will be embedded directly in the product data.')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (user?.role !== 'ADMIN') {
      showToast('⚠️ Only admins can manage products')
      return
    }

    setUploading(true)
    setUploadMessage('Preparing image…')

    try {
      let image = formData.imageUrl || '/placeholder.jpg'

      if (imageFile) {
        try {
          image = await readImageAsDataUrl(imageFile)
          setUploadMessage('Image ready. Saving product…')
        } catch (err: any) {
          console.error('Image processing failed:', err)
          image = formData.imageUrl || '/placeholder.jpg'
          setUploadMessage('Image could not be processed. Using a fallback image instead.')
          showToast('⚠️ Image could not be processed. Using a fallback image instead.')
        }
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image,
        description: formData.description || ''
      }

      if (editingProductId) {
        const productRef = doc(db, 'products', editingProductId)
        await updateDoc(productRef, payload)
        setProducts((prev) => prev.map((product) => product.id === editingProductId ? { ...product, ...payload } : product))
        setUploadMessage('Product updated successfully.')
        showToast('✅ Product updated successfully')
      } else {
        const docRef = await addDoc(collection(db, 'products'), payload)
        setProducts((prev) => [{ id: docRef.id, ...payload }, ...prev])
        setUploadMessage('Product saved successfully.')
        showToast('✅ Product added successfully')
      }

      setShowModal(false)
      resetForm()
      fetchProducts()
    } catch (error: any) {
      console.error('Add product failed:', error)
      setUploadMessage('Product could not be saved.')
      showToast(error?.message || '❌ Failed to save product')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteDoc(doc(db, 'products', id))
      setProducts((prev) => prev.filter((product) => product.id !== id))
      showToast('🗑️ Product deleted')
      fetchProducts()
    } catch (error) {
      console.error('Delete product failed:', error)
      showToast('❌ Failed to delete product')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProductId(product.id)
    setFormData({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      description: (product as any).description || '',
      imageUrl: (product as any).image?.startsWith('http') ? (product as any).image : ''
    })
    setImagePreview((product as any).image && !(product as any).image.startsWith('data:image') ? (product as any).image : '')
    setUploadMessage('Editing product. Save to apply changes.')
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-slate-50/80 p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Inventory</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Products</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
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
                  <td className="px-6 py-4 text-right space-x-3">
                    <button 
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Edit
                    </button>
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Product Editor</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
              </div>
              <button type="button" onClick={() => { setShowModal(false); resetForm() }} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">✕</button>
            </div>
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" rows={3} placeholder="Short product description" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (optional)</label>
                <input type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm" />
                {imagePreview && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <img src={imagePreview} alt="Preview" className="h-40 w-full object-cover" />
                  </div>
                )}
                {uploadMessage && (
                  <p className="mt-2 text-sm text-slate-600">{uploadMessage}</p>
                )}
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
                <button type="button" onClick={() => { setShowModal(false); resetForm() }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:cursor-not-allowed disabled:bg-blue-400">
                  {uploading ? 'Saving...' : editingProductId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
