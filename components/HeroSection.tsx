export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" />
      <div className="hero-pattern" />
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">Solapur&apos;s Trusted Textile Store</div>
          <h1 className="hero-title">
            Quality Linens
            <em>Crafted with Care</em>
            for Every Home
          </h1>
          <p className="hero-desc">
            From plush 700 GSM bath towels to silky 400TC Egyptian cotton bedsheets —
            discover premium home textiles at prices that make every thread worth it.
          </p>
          <div className="hero-actions">
            <a href="#products" className="btn btn-primary">Shop Now →</a>
            <a href="#b2b" className="btn btn-outline">Bulk / B2B Orders</a>
          </div>
          <div className="hero-stats">
            <div>
              <div className="hero-stat-num">500+</div>
              <div className="hero-stat-label">Products</div>
            </div>
            <div>
              <div className="hero-stat-num">10k+</div>
              <div className="hero-stat-label">Happy Customers</div>
            </div>
            <div>
              <div className="hero-stat-num">30yr</div>
              <div className="hero-stat-label">Experience</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div
              className="img-placeholder"
              style={{ background: 'linear-gradient(135deg,#2a2a2a,#1a1a1a)', minHeight: 400 }}
            >
              🛁<span>Bath Towels</span>
            </div>
            <div className="hero-card-label">600 GSM · 100% Cotton</div>
          </div>
          <div className="hero-card">
            <div
              className="img-placeholder"
              style={{ background: 'linear-gradient(135deg,#1e2a3a,#0f1a2a)', minHeight: 180 }}
            >
              🛏️<span>Bedsheets</span>
            </div>
            <div className="hero-card-label">300 TC Egyptian</div>
          </div>
          <div className="hero-card">
            <div
              className="img-placeholder"
              style={{ background: 'linear-gradient(135deg,#2a1a1a,#1a0f0f)', minHeight: 180 }}
            >
              🍽️<span>Napkins</span>
            </div>
            <div className="hero-card-label">From ₹199/pc</div>
          </div>
        </div>
      </div>
    </section>
  )
}
