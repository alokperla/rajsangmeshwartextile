'use client'

import HeroSection from '../components/HeroSection'
import CategoriesSection from '../components/CategoriesSection'
import ProductsSection from '../components/ProductsSection'
import B2BSection from '../components/B2BSection'
import FeaturesSection from '../components/FeaturesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import NewsletterSection from '../components/NewsletterSection'
import ContactSection from '../components/ContactSection'
import { useEffect } from 'react'

export default function Home() {
  // Scroll-triggered fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductsSection />
      <B2BSection />
      <FeaturesSection />
      <TestimonialsSection />
      <NewsletterSection />
      <ContactSection />
    </>
  )
}
