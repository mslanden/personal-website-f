"use client";

import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ServicesPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={styles.servicesPageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoText}>Marcelino Landen</Link>
          </div>
          <nav className={styles.navigation}>
            <Link href="/">Home</Link>
            <Link href="/services" aria-current="page">Services</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      <section className={`${styles.heroSection} ${isVisible ? styles.visible : ""}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Services & Expertise</h1>
          <p className={styles.heroDescription}>
            Comprehensive solutions for modern businesses looking to leverage technology and AI
          </p>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.serviceCard}>
          <div className={styles.serviceIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Website Build</h2>
          <div className={styles.pricingInfo}>$1500–3000</div>
          <p className={styles.serviceDescription}>
            Custom-designed websites that are both beautiful and functional. Each site is built with modern technologies, optimized for performance, and designed with your specific goals in mind.
          </p>
          <ul className={styles.featuresList}>
            <li>Custom design (3–6 pages)</li>
            <li>Mobile-first & SEO-ready</li>
            <li>Optional AI/automation tools</li>
            <li>Modern frameworks (Next.js, React)</li>
            <li>Performance optimization</li>
            <li>Content management system</li>
          </ul>
          <Link href="/contact" className={styles.serviceButton}>Get Started</Link>
        </div>

        <div className={styles.serviceCard}>
          <div className={styles.serviceIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>MVP Development</h2>
          <div className={styles.pricingInfo}>$5000–8000</div>
          <p className={styles.serviceDescription}>
            Transform your idea into a working product quickly and efficiently. My MVP development service focuses on building the core functionality that demonstrates your concept and provides value to early users.
          </p>
          <ul className={styles.featuresList}>
            <li>Core feature implementation</li>
            <li>User authentication</li>
            <li>Basic admin dashboard</li>
            <li>Deployment & testing</li>
            <li>Database design & setup</li>
            <li>API development</li>
          </ul>
          <Link href="/contact" className={styles.serviceButton}>Get Started</Link>
        </div>

        <div className={styles.serviceCard}>
          <div className={styles.serviceIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Monthly Management</h2>
          <div className={styles.pricingTiers}>
            <div className={styles.tier}>$150/mo → Lite</div>
            <div className={styles.tier}>$300 → Pro</div>
          </div>
          <p className={styles.serviceDescription}>
            Keep your website or application running smoothly with ongoing maintenance and support. Choose between Lite and Pro plans based on your needs and budget.
          </p>
          <ul className={styles.featuresList}>
            <li>Hosting, edits, updates</li>
            <li>Security checks</li>
            <li>Monthly performance report</li>
            <li>Content updates (Pro)</li>
            <li>SEO optimization (Pro)</li>
            <li>24/7 emergency support (Pro)</li>
          </ul>
          <Link href="/contact" className={styles.serviceButton}>Get Started</Link>
        </div>
      </section>

      <section className={styles.processSection}>
        <h2 className={styles.sectionTitle}>My Process</h2>
        <div className={styles.processSteps}>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>1</div>
            <h3>Consultation</h3>
            <p>We'll discuss your goals, requirements, and vision to ensure I understand exactly what you need.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>2</div>
            <h3>Planning</h3>
            <p>I'll create a detailed plan including timeline, deliverables, and technical specifications.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>3</div>
            <h3>Development</h3>
            <p>Building your solution with regular updates and opportunities for feedback.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>4</div>
            <h3>Launch</h3>
            <p>Thorough testing and deployment, ensuring everything works perfectly.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>5</div>
            <h3>Support</h3>
            <p>Ongoing maintenance and support to keep everything running smoothly.</p>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2>Ready to get started?</h2>
        <p>Let's discuss how I can help bring your vision to life.</p>
        <Link href="/contact" className={styles.ctaButton}>Book a Free Consultation</Link>
      </section>

      <footer className={styles.footer}>
        <div>
          © {new Date().getFullYear()} Marcelino Landen. All rights reserved.
        </div>
        <div>
          marcelino@marcelinolanden.com
        </div>
      </footer>
    </div>
  );
}
