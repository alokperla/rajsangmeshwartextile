'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth, useCart, useCartSidebar } from '../lib/store'
import { useEffect } from 'react'

export default function Header() {
  const { user, logout, initialize } = useAuth()
  const { items, fetchCart } = useCart()
  const { open: openCart } = useCartSidebar()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    initialize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (user) {
      fetchCart()
    }
  }, [user])

  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">RT</div>
            <div className="logo-text">
              <span className="logo-title">Rajsangmeshwar Textile</span>
              <span className="logo-sub">Solapur, Maharashtra</span>
            </div>
          </Link>

          <nav className="main-nav">
            <a href="#home" className="active">Home</a>
            <a href="#categories">Categories</a>
            <a href="#products">Products</a>
            <a href="#b2b">B2B</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search towels, bedsheets, napkins…" />
          </div>

          <div className="header-actions">
            {user?.role === 'ADMIN' && (
              <Link href="/admin" className="auth-nav-btn" style={{ border: '1px solid var(--border)' }}>Admin Panel</Link>
            )}
            {user ? (
              <>
                <span className="auth-user-name" style={{ whiteSpace: 'nowrap' }}>
                  {user.name || user.email}
                </span>
                <button className="auth-logout-btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="auth-nav-btn auth-nav-login">Login</Link>
                <Link href="/register" className="auth-nav-btn auth-nav-register">Register</Link>
              </>
            )}
            <a href="#" title="Wishlist">♡</a>
            <button title="Cart" onClick={openCart} style={{ position: 'relative' }}>
              🛒
              <span className="cart-badge">{totalItems}</span>
            </button>
            <button className="hamburger" onClick={() => setMobileOpen(true)}>☰</button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu-overlay${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)} />
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMobileOpen(false)}>✕</button>
        <a href="#home" onClick={() => setMobileOpen(false)}>Home</a>
        <a href="#categories" onClick={() => setMobileOpen(false)}>Categories</a>
        <a href="#products" onClick={() => setMobileOpen(false)}>Products</a>
        <a href="#b2b" onClick={() => setMobileOpen(false)}>B2B</a>
        <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
        {user ? (
          <>
            <div style={{ padding: '12px 16px', fontSize: 13, color: 'var(--grey)' }}>
              Welcome, {user.name || user.email}
            </div>
            <button
              onClick={() => { logout(); setMobileOpen(false); }}
              style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px', fontSize: 16, fontWeight: 500, color: 'var(--red)' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={() => setMobileOpen(false)}>Login</Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </>
  )
}