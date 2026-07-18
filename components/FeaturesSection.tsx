export default function FeaturesSection() {
  const features = [
    { icon: '🧵', title: 'Premium Quality Fabrics', desc: 'We source only the finest 100% cotton, Egyptian cotton, and microfiber blends. Every product is tested for softness, durability, and colorfastness before it reaches you.' },
    { icon: '🚚', title: 'Pan-India Delivery', desc: 'We ship to 27,000+ pincodes across India via Shiprocket. Orders above ₹999 ship free. Expect delivery in 3–7 business days with live tracking.' },
    { icon: '↩️', title: 'Easy Returns', desc: 'Not happy? Return any unused item within 10 days of delivery. We\'ll issue a full refund or exchange — no questions asked for defective products.' },
    { icon: '🔒', title: 'Secure & Trusted Payments', desc: 'Pay via UPI, cards, wallets, net banking, or Cash on Delivery. All online payments are secured through Razorpay\'s PCI DSS Level 1 certified gateway.' },
  ]

  return (
    <section className="section features" id="about">
      <div className="section-inner">
        <div className="section-header" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 56px' }}>
          <span className="section-tag">Why Rajsangmeshwar</span>
          <h2 className="section-title">The Difference You Can <em>Feel</em></h2>
          <p className="section-desc" style={{ maxWidth: '100%' }}>
            30 years of textile expertise, family values, and an uncompromising commitment to quality.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={f.title} className={`feature-card fade-in${i > 0 ? ` stagger-${i}` : ''}`}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
