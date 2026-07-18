'use client'

import { useCart, useCartSidebar, useToast } from '../lib/store'

// Map categories to emojis for cart display
const CATEGORY_EMOJI: Record<string, string> = {
  'Bath Towels': '🛁',
  'Hand Towels': '🤲',
  'Bedsheets': '🛏️',
  'Napkins': '🍽️',
  'Pillow Covers': '💤',
  'Blankets': '🧣',
  'Curtains': '🪟',
  'Sets': '🎁',
}

export default function CartSidebar() {
  const { items, removeFromCart } = useCart()
  const { isOpen, close } = useCartSidebar()
  const { showToast } = useToast()

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping = subtotal >= 999 ? 0 : 49
  const total = subtotal + shipping

  const handleRemove = async (itemId: string, name: string) => {
    try {
      await removeFromCart(itemId)
      showToast(`🗑️ ${name} removed from cart`)
    } catch {
      showToast('❌ Failed to remove item')
    }
  }

  return (
    <>
      <div className={`cart-overlay${isOpen ? ' open' : ''}`} onClick={close} />
      <div className={`cart-sidebar${isOpen ? ' open' : ''}`}>
        <div className="cart-header">
          <div className="cart-title">Your Cart 🛒</div>
          <button className="cart-close" onClick={close}>✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--grey)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
                Your cart is empty
              </div>
              <div style={{ fontSize: 14 }}>Browse our products and add items to get started.</div>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-img">
                  {CATEGORY_EMOJI[item.product.category] || '📦'}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-meta">{item.product.category} · Qty: {item.quantity}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="cart-item-price">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</div>
                    <button className="cart-item-remove" onClick={() => handleRemove(item.id, item.product.name)}>
                      ✕ Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer-section">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-subtotal">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            <div className="cart-subtotal total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <a
              href="/cart"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: 16, fontSize: 16 }}
              onClick={close}
            >
              Proceed to Checkout →
            </a>
            <button
              className="btn"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, background: 'var(--light-grey)', color: 'var(--black)' }}
              onClick={close}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
