'use client'

import { useEffect, useState, useCallback } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth, useCart, useCartSidebar, useToast } from '../lib/store'
import Link from 'next/link'

// Category metadata for enriching DB products
const CATEGORY_META: Record<string, { emoji: string; bg: string; colors: string[] }> = {
  'Bath Towels': { emoji: '🛁', bg: 'prod-bg-1', colors: ['#fff', '#6B7280', '#1E40AF'] },
  'Hand Towels': { emoji: '🤲', bg: 'prod-bg-3', colors: ['#6B7280', '#fff', '#1E40AF'] },
  'Bedsheets': { emoji: '🛏️', bg: 'prod-bg-2', colors: ['#fff', '#6B7280', '#FDE68A'] },
  'Napkins': { emoji: '🍽️', bg: 'prod-bg-3', colors: ['#fff', '#FDE68A', '#DC2626'] },
  'Pillow Covers': { emoji: '💤', bg: 'prod-bg-5', colors: ['#fff', '#6B7280', '#BAE6FD'] },
  'Blankets': { emoji: '🧣', bg: 'prod-bg-4', colors: ['#FEF9C3', '#E2DDD6', '#6B7280'] },
  'Curtains': { emoji: '🪟', bg: 'prod-bg-4', colors: ['#D4C5A9', '#1E40AF', '#DC2626'] },
  'Sets': { emoji: '🎁', bg: 'prod-bg-7', colors: ['#6B7280', '#fff', '#DC2626'] },
}

const FILTERS = ['All', 'Bath Towels', 'Hand Towels', 'Bedsheets', 'Napkins', 'Pillow Covers', 'Blankets', 'Curtains', 'Sets']

// Assign pseudo-random badges and ratings based on product id for consistency
function getProductMeta(id: string) {
  // Use character code of the string ID to pseudo-randomize
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const badges = ['', 'new', 'bestseller', 'sale', '', '', 'new', '', 'bestseller', '', 'sale', 'new', '', '', 'bestseller', 'sale']
  const badge = badges[hash % badges.length]
  const rating = 4.3 + ((hash * 7) % 7) * 0.1
  const reviews = 20 + ((hash * 13) % 180)
  return { badge, rating: Math.round(rating * 10) / 10, reviews }
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  image: string
  description?: string
  stock: number
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeFilter, setActiveFilter] = useState('All')
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { open: openCart } = useCartSidebar()
  const { showToast } = useToast()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'))
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any)
        }))
        setProducts(data)
      } catch (error) {
        console.error('Failed to load products from Firestore', error)
        setProducts([])
      }
    }

    loadProducts()
  }, [])

  // Listen for filter events from CategoriesSection
  const handleFilterEvent = useCallback((e: Event) => {
    const filter = (e as CustomEvent).detail
    setActiveFilter(filter)
  }, [])

  useEffect(() => {
    window.addEventListener('filter-products', handleFilterEvent)
    return () => window.removeEventListener('filter-products', handleFilterEvent)
  }, [handleFilterEvent])

  const filtered = activeFilter === 'All' ? products : products.filter(p => p.category === activeFilter)

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      showToast('⚠️ Please login to add items to cart')
      return
    }
    try {
      await addToCart(product.id, 1)
      showToast(`✅ ${product.name} added to cart!`)
      openCart()
    } catch (error: any) {
      const message = error?.message || 'Failed to add to cart'
      showToast(`❌ ${message}`)
    }
  }

  return (
    <section className="section" id="products" style={{ background: 'var(--white)' }}>
      <div className="section-inner">
        <div className="section-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <span className="section-tag">Our Collection</span>
            <h2 className="section-title">Featured <em>Products</em></h2>
          </div>
          <a href="#products" className="btn btn-primary" style={{ flexShrink: 0 }}>View All Products →</a>
        </div>

        <div className="filter-bar">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filtered.length === 0 && products.length > 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--grey)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600 }}>No products found</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: 'var(--grey)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600 }}>Loading products...</div>
            </div>
          ) : (
            filtered.map((p) => {
              const meta = CATEGORY_META[p.category] || { emoji: '📦', bg: 'prod-bg-1', colors: ['#fff', '#6B7280', '#1E40AF'] }
              const { badge, rating, reviews } = getProductMeta(p.id)
              const fullStars = Math.floor(rating)

              return (
                <div key={p.id} className="product-card fade-in visible">
                  <div className={`product-img ${meta.bg}`}>
                    {badge && (
                      <div className={`product-badge badge-${badge}`}>
                        {badge === 'bestseller' ? '⭐ Best Seller' : badge === 'new' ? 'New' : '🏷️ Sale'}
                      </div>
                    )}
                    <div className="product-wishlist">♡</div>
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="product-emoji">{meta.emoji}</span>
                    )}
                    <div className="product-actions">
                      {user ? (
                        <button className="btn btn-primary" onClick={() => handleAddToCart(p)}>
                          {p.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                        </button>
                      ) : (
                        <Link href="/login" className="btn btn-primary">Login to Buy</Link>
                      )}
                    </div>
                  </div>
                  <div className="product-body">
                    <div className="product-category">{p.category}</div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-meta">
                      <span className="product-tag">{p.category}</span>
                      {p.description && <span className="product-tag">{p.description.slice(0, 20)}</span>}
                    </div>
                    <div className="product-colors">
                      {meta.colors.map((c, i) => (
                        <div
                          key={i}
                          className="color-swatch"
                          style={{ background: c, borderColor: c === '#fff' ? '#ddd' : 'transparent' }}
                        />
                      ))}
                    </div>
                    <div className="product-footer">
                      <div className="product-price">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                      <div>
                        <div className="stars">
                          {'★'.repeat(fullStars)}{'☆'.repeat(5 - fullStars)}
                        </div>
                        <div className="stars-count">{rating} ({reviews})</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
