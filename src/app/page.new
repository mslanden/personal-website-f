"use client";

import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFeaturedProjects, Project } from "../lib/supabase-client";

export default function MainPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    
    // Load featured projects
    const loadFeaturedProjects = async () => {
      try {
        const projects = await getFeaturedProjects(3);
        setFeaturedProjects(projects);
      } catch (error) {
        console.error('Error loading featured projects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedProjects();
  }, []);

  return (
    <>
      <div className={styles.mainPageContainer}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <Link href="/" className={styles.logoText}>Marcelino Landen</Link>
            </div>
            <nav className={styles.navigation}>
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>
        <div className={`${styles.heroSection} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.heroContent}>
            <div className={styles.textContent}>
              <h1 className={styles.heroTitle}>Modern Websites, MVP's & AI Tools for Businesses</h1>
              
              <p className={styles.heroDescription}>
                Fast builds, Flat monthly care.<br />
                No tech headaches.
              </p>
              
              <Link href="/contact" className={styles.ctaButton}>
                Book a Free Consult
              </Link>
            </div>
            
            <div className={styles.heroImage}>
              <Image 
                src="/images/hero-illustration.png" 
                alt="AI and web development illustration" 
                width={500} 
                height={500}
                priority
              />
            </div>
          </div>
        </div>

        <div className={styles.servicesSection}>
          <div className={styles.serviceCard}>
            <h2>Website Build</h2>
            <div className={styles.pricingInfo}>$1500–3000</div>
            
            <ul className={styles.featuresList}>
              <li>Custom design (3–6 pages)</li>
              <li>Mobile-first & SEO-ready</li>
              <li>Optional AI/automation tools</li>
            </ul>
          </div>
          
          <div className={styles.serviceCard}>
            <h2>MVP Development</h2>
            <div className={styles.pricingInfo}>$5000–8000</div>
            
            <ul className={styles.featuresList}>
              <li>Core feature implementation</li>
              <li>User authentication</li>
              <li>Basic admin dashboard</li>
              <li>Deployment & testing</li>
            </ul>
          </div>
          
          <div className={styles.serviceCard}>
            <h2>Monthly Management</h2>
            <div className={styles.pricingTiers}>
              <div className={styles.tier}>$150/mo → Lite</div>
              <div className={styles.tier}>$300 → Pro</div>
            </div>
            
            <ul className={styles.featuresList}>
              <li>Hosting, edits, updates</li>
              <li>Security checks</li>
              <li>Monthly performance report</li>
            </ul>
          </div>
        </div>

        <div className={styles.featuredProjectsSection}>
          <h2>Featured Projects</h2>
          
          {isLoading ? (
            <div className={styles.loadingProjects}>Loading projects...</div>
          ) : featuredProjects.length === 0 ? (
            <div className={styles.noProjects}>No featured projects available</div>
          ) : (
            <div className={styles.projectsGrid}>
              {featuredProjects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectImageContainer}>
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      width={400}
                      height={225}
                      className={styles.projectImage}
                    />
                    <div className={styles.projectOverlay}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className={styles.viewButton}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  <div className={styles.projectInfo}>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className={styles.projectMeta}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className={styles.learnMoreLink}
                      >
                        Learn more →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className={styles.viewAllProjects}>
            <Link href="/projects" className={styles.secondaryButton}>
              View All Projects
            </Link>
          </div>
        </div>
        
        <div className={styles.aboutSection}>
          <h2>Why Work With Me?</h2>
          
          <div className={styles.aboutContent}>
            <div className={styles.aboutList}>
              <ul>
                <li>Full-stack dev with AI+ startup experience</li>
                <li>No outsourced teams — you talk directly to me</li>
                <li>Clear, honest communication</li>
                <li>Local SoCal roots, small business friendly</li>
              </ul>
            </div>
            
            <div className={styles.profileImage}>
              <Image 
                src="/images/profile-photo.png" 
                alt="Marcelino Landen" 
                width={200} 
                height={200}
              />
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <div>
            © {new Date().getFullYear()} Marcelino Landen. All rights reserved.
          </div>
          <div>
            marcelino@marcelinolanden.com
          </div>
        </footer>
      </div>
    </>
  );
}
