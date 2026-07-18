'use client'

import { useState } from 'react'
import { useToast } from '../lib/store'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const { showToast } = useToast()

  const handleSubscribe = () => {
    if (!email || !email.includes('@')) {
      showToast('⚠️ Please enter a valid email address')
      return
    }
    showToast('✅ Subscribed successfully! Welcome aboard.')
    setEmail('')
  }

  return (
    <section className="newsletter">
      <div className="newsletter-inner">
        <div className="newsletter-icon">✉️</div>
        <h2 className="newsletter-title">Stay in the Loop</h2>
        <p className="newsletter-desc">
          Get exclusive deals, new arrivals, and textile care tips straight to your inbox. No spam — just quality content.
        </p>
        <div className="newsletter-form">
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSubscribe}>Subscribe</button>
        </div>
        <p className="newsletter-note">By subscribing you agree to our Privacy Policy. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
