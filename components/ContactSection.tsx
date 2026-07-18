'use client'

import { useToast } from '../lib/store'

export default function ContactSection() {
  const { showToast } = useToast()

  const handleSubmit = () => {
    showToast('✅ Message sent! We\'ll get back to you soon.')
  }

  return (
    <section className="section" id="contact" style={{ background: 'var(--white)' }}>
      <div className="section-inner">
        <div className="contact-grid">
          <div>
            <span className="section-tag">Get in Touch</span>
            <h2 className="section-title">Visit Us or <em>Order Online</em></h2>
            <p style={{ fontSize: 16, color: 'var(--grey)', margin: '20px 0 40px', lineHeight: 1.7 }}>
              We&apos;re based in Solapur and ship across India. Have a query? Drop us a message or visit our store — we&apos;d love to meet you.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="contact-info-item">
                <div className="contact-icon-box">📍</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Store Address</div>
                  <div style={{ color: 'var(--grey)', fontSize: 14, lineHeight: 1.6 }}>
                    Rajsangmeshwar Textile, Akkalkot road,<br />Solapur, Maharashtra – 413006
                  </div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-icon-box">📞</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Phone / WhatsApp</div>
                  <div style={{ color: 'var(--grey)', fontSize: 14 }}>+91 9595009762</div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-icon-box">🕐</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Store Hours</div>
                  <div style={{ color: 'var(--grey)', fontSize: 14 }}>
                    Mon–Sat: 10am – 8pm<br />Sunday: 11am – 6pm
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form-card">
            <h3 className="contact-form-title">Send a Message</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="contact-label">Your Name</label>
                <input type="text" className="contact-input" placeholder="e.g. Rajesh Kumar" />
              </div>
              <div>
                <label className="contact-label">Email / Phone</label>
                <input type="text" className="contact-input" placeholder="email@example.com or +91 XXXXX XXXXX" />
              </div>
              <div>
                <label className="contact-label">I&apos;m interested in…</label>
                <select className="contact-input">
                  <option>Retail purchase</option>
                  <option>B2B / Bulk order</option>
                  <option>Wedding trousseau</option>
                  <option>Hotel / Restaurant linen</option>
                  <option>Custom/embroidered products</option>
                  <option>Other query</option>
                </select>
              </div>
              <div>
                <label className="contact-label">Message</label>
                <textarea
                  rows={4}
                  className="contact-input"
                  placeholder="Tell us about your requirements…"
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 16 }}
                onClick={handleSubmit}
              >
                Send Message ✉️
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
