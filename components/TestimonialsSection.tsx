export default function TestimonialsSection() {
  const testimonials = [
    {
      text: '"The 600 GSM cotton towels are absolutely divine — thick, absorbent, and still soft after many washes. Finally found my go-to textile store in Solapur!"',
      name: 'Anita Sharma',
      role: 'Homemaker, Solapur · Verified Buyer',
      initial: 'A',
    },
    {
      text: '"Ordered 100 bath towels for my guesthouse. Got excellent pricing, GST invoice, and delivery was on time. Quality is consistent and my guests love them."',
      name: 'Sunil Patil',
      role: 'Guesthouse Owner, Solapur · B2B Customer',
      initial: 'S',
    },
    {
      text: '"Got a full trousseau set from Rajsangmeshwar for our wedding. Egyptian cotton bedsheets, towel sets, pillow covers — everything was beautifully packed and perfect quality!"',
      name: 'Priya & Rahul Deshpande',
      role: 'Newlyweds, Solapur · Verified Buyers',
      initial: 'P',
    },
  ]

  return (
    <section className="section" style={{ background: 'var(--cream)' }}>
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Customer Reviews</span>
          <h2 className="section-title">What Our Customers <em>Say</em></h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={t.name} className={`testimonial-card fade-in${i > 0 ? ` stagger-${i}` : ''}`}>
              <div className="testimonial-stars">★★★★★</div>
              <div className="testimonial-text">{t.text}</div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initial}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
