import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../lib/store'
import { useAuth } from '../lib/store'

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description?: string
  stock: number
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1)
      alert('Added to cart!')
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to add to cart'
      alert(errorMsg)
    }
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-950">
      <div className="overflow-hidden rounded-[2rem]">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="h-52 w-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.category}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xl font-semibold text-slate-900 dark:text-slate-100">₹{product.price}</span>
          {user ? (
            <button
              onClick={handleAddToCart}
              className="rounded-full bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Login to Buy
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}