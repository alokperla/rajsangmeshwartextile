export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo" style={{ marginBottom: 4 }}>
              <div className="logo-icon">RT</div>
              <div className="logo-text">
                <span className="logo-title">Rajsangmeshwar Textile</span>
                <span className="logo-sub">Solapur, Maharashtra</span>
              </div>
            </div>
            <p className="footer-desc">
              A family-owned textile business since 1995, offering premium quality home linens — from plush bath towels to luxurious bedsheets — at honest prices.
            </p>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📍</span> Akkalkot road, Solapur, Maharashtra 413006
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📞</span> +91 9595009762
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">✉️</span> info@rajsangmeshwartextile.com
            </div>
            <div className="social-links">
              <a href="#" className="social-link" title="Facebook">f</a>
              <a href="#" className="social-link" title="Instagram">📸</a>
              <a href="#" className="social-link" title="WhatsApp">💬</a>
              <a href="#" className="social-link" title="YouTube">▶</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Products</div>
            <ul className="footer-links">
              <li><a href="#">Bath Towels</a></li>
              <li><a href="#">Hand Towels</a></li>
              <li><a href="#">Face Towels</a></li>
              <li><a href="#">Bedsheets</a></li>
              <li><a href="#">Pillow Covers</a></li>
              <li><a href="#">Blankets</a></li>
              <li><a href="#">Curtains</a></li>
              <li><a href="#">Gift Sets</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">B2B / Wholesale</a></li>
              <li><a href="#">Blog &amp; Tips</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Store Locator</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links">
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Returns &amp; Refunds</a></li>
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms &amp; Conditions</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2025 Rajsangmeshwar Textile. All rights reserved. GST: 27XXXXX0000X1ZX</div>
          <div className="footer-payments">
            <span style={{ fontSize: 12, marginRight: 4 }}>Payments:</span>
            <span className="payment-chip">UPI</span>
            <span className="payment-chip">Visa</span>
            <span className="payment-chip">Mastercard</span>
            <span className="payment-chip">Razorpay</span>
            <span className="payment-chip">COD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
