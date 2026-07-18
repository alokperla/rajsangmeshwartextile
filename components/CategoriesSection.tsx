'use client'

const CATEGORIES = [
  { name: 'Bath Towels', emoji: '🛁', bg: 'cat-towels', desc: '400–700 GSM · Cotton & Microfiber', filter: 'Bath Towels' },
  { name: 'Bedsheets', emoji: '🛏️', bg: 'cat-bedsheets', desc: '200–400 TC · Single to King', filter: 'Bedsheets' },
  { name: 'Napkins', emoji: '🍽️', bg: 'cat-napkins', desc: 'Solid, Printed, Checkered', filter: 'Napkins' },
  { name: 'Blankets', emoji: '🧣', bg: 'cat-blankets', desc: 'Wool Blend · Warm & Cozy', filter: 'Blankets' },
  { name: 'Pillow Covers', emoji: '💤', bg: 'cat-pillows', desc: 'Standard to King · Decorative', filter: 'Pillow Covers' },
  { name: 'Curtains', emoji: '🪟', bg: 'cat-curtains', desc: 'Cotton · Blackout · Panels', filter: 'Curtains' },
  { name: 'Hand Towels', emoji: '🤲', bg: 'cat-face', desc: 'Set of 2 · 400–450 GSM', filter: 'Hand Towels' },
  { name: 'Gift Sets', emoji: '🎁', bg: 'cat-sets', desc: 'Towel + Sheet Combos', filter: 'Sets' },
]

export default function CategoriesSection() {
  const scrollToProducts = (filter: string) => {
    const el = document.getElementById('products')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    // Dispatch a custom event so ProductsSection can pick it up
    window.dispatchEvent(new CustomEvent('filter-products', { detail: filter }))
  }

  return (
    <section className="section categories" id="categories">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Browse by Category</span>
          <h2 className="section-title">Everything for Your <em>Home</em></h2>
          <p className="section-desc">Premium quality textiles across all categories — from bathroom to bedroom, dining to décor.</p>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              className={`category-card fade-in${i > 0 && i < 4 ? ` stagger-${i}` : ''}`}
              onClick={() => scrollToProducts(cat.filter)}
              style={{ textAlign: 'left' }}
            >
              <div className={`cat-img ${cat.bg}`}>{cat.emoji}</div>
              <div className="cat-body">
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.desc}</div>
                <div className="cat-arrow">Shop Now →</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
