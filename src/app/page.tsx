"use client";

import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import GitContributionGraph from "./git-contribution-graph";
import { useEffect, useState } from "react";

export default function MainPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <div className={styles.mainPageContainer}>
        <header className={styles.headerContainer}>
          <div className={styles.logo}>
            <Image
              src="/logo.svg"
              alt="Marcelino Landen"
              width={150}
              height={60}
              priority
              className={styles.logoImage}
            />
          </div>
          <nav aria-label="Main navigation">
            <Link href="/" aria-current="page">
              Home
            </Link>
            <Link href="/about">About</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>

        <section
          className={`${styles.heroSection} ${isVisible ? styles.visible : ""}`}
        >
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Marcelino Landen</h1>
            <h2 className={styles.heroSubtitle}>AI Engineer & Developer</h2>
            <p className={styles.heroDescription}>
              Building intelligent systems that transform the future of
              technology
            </p>
            <div className={styles.heroButtons}>
              <Link href="/projects" className={styles.primaryButton}>
                View Projects
              </Link>
              <Link href="/contact" className={styles.secondaryButton}>
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.featuredSection}>
          <div className={styles.sectionTitle}>
            <h2>About Me</h2>
            <div className={styles.titleUnderline}></div>
          </div>
          <div className={styles.featuredContent}>
            <div className={styles.profileImage}>
              <Image
                src="/images/marcelino-avatar-v1.webp"
                alt="Marcelino Landen"
                width={280}
                height={280}
                priority
              />
            </div>
            <div className={styles.aboutContent}>
              <p>
                From Roman Ingenuity to AI Innovation: Shaping the Future.
                Humanity has always progressed through adaptation and
                innovation—from the engineering feats of the Roman Empire to
                today's AI-driven world. As an AI developer, I build intelligent
                systems that enhance productivity, solve complex challenges, and
                drive innovation forward.
              </p>
              <p>
                My expertise lies in AI automation, agent frameworks, and
                competitive analysis tools, empowering businesses to stay ahead
                in a rapidly evolving landscape.
              </p>
              <Link href="/about" className={styles.learnMoreButton}>
                Learn More About Me
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.skillsSection}>
          <div className={styles.skillsContent}>
            <div className={styles.skillCard}>
              <div className={styles.skillIcon}>
                <svg
                  viewBox="0 0 24 24"
                  width="36"
                  height="36"
                  fill="var(--bronze)"
                >
                  <path d="M21.67,18.17,16.5,13A7.33,7.33,0,0,0,15,2.67a7.24,7.24,0,0,0-5.13,2.13A7.24,7.24,0,0,0,7.75,10a7.24,7.24,0,0,0,2.13,5.13,7.24,7.24,0,0,0,5.13,2.13A7.14,7.14,0,0,0,18.5,16l5.17,5.17a1,1,0,0,0,1.42-1.42ZM9.5,14.5a5.49,5.49,0,0,1,0-7.78,5.56,5.56,0,0,1,7.78,0,5.49,5.49,0,0,1,0,7.78,5.56,5.56,0,0,1-7.78,0Z" />
                </svg>
              </div>
              <h3>AI Research</h3>
              <p>
                Exploring cutting-edge AI technologies to discover innovative
                applications and solutions.
              </p>
            </div>
            <div className={styles.skillCard}>
              <div className={styles.skillIcon}>
                <svg
                  viewBox="0 0 24 24"
                  width="36"
                  height="36"
                  fill="var(--bronze)"
                >
                  <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20ZM15,6H9A1,1,0,0,0,8,7V17a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V7A1,1,0,0,0,15,6Zm-1,10H10V8h4Z" />
                </svg>
              </div>
              <h3>Development</h3>
              <p>
                Creating robust software solutions with modern frameworks and
                clean architecture.
              </p>
            </div>
            <div className={styles.skillCard}>
              <div className={styles.skillIcon}>
                <svg
                  viewBox="0 0 24 24"
                  width="36"
                  height="36"
                  fill="var(--bronze)"
                >
                  <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.47,7.17-5,8a1,1,0,0,1-.85.48h-.06a1,1,0,0,1-.85-.58l-2-4.17A1,1,0,0,1,9.17,11.1l1.44,3,4.13-6.6a1,1,0,0,1,1.69-.07A1,1,0,0,1,17.47,9.17Z" />
                </svg>
              </div>
              <h3>Optimization</h3>
              <p>
                Streamlining processes and systems to achieve maximum efficiency
                and performance.
              </p>
            </div>
            <div className={styles.skillCard}>
              <div className={styles.skillIcon}>
                <svg
                  viewBox="0 0 24 24"
                  width="36"
                  height="36"
                  fill="var(--bronze)"
                >
                  <path d="M8.71,7.71,11,5.41V15a1,1,0,0,0,2,0V5.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-4-4a1,1,0,0,0-1.42,0l-4,4A1,1,0,0,0,8.71,7.71ZM21,12a1,1,0,0,0-1,1v6a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V13a1,1,0,0,0-2,0v6a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V13A1,1,0,0,0,21,12Z" />
                </svg>
              </div>
              <h3>Deployment</h3>
              <p>
                Implementing seamless deployment pipelines for reliable and
                scalable applications.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.featuredProjectsSection}>
          <div className={styles.sectionTitle}>
            <h2>Featured Projects</h2>
            <div className={styles.titleUnderline}></div>
          </div>
          <div className={styles.projectsGrid}>
            <Link href="/projects" className={styles.projectCard}>
              <div className={styles.projectImageWrapper}>
                <Image
                  src="/images/text-editor.webp"
                  alt="Smart Code Editor"
                  width={400}
                  height={250}
                  className={styles.projectImage}
                />
                <div className={styles.projectOverlay}>
                  <span>View Details</span>
                </div>
              </div>
              <div className={styles.projectContent}>
                <h3>Smart Code Editor</h3>
                <p>
                  An AI-enhanced text editor designed to streamline coding
                  workflows with intelligent code suggestions.
                </p>
                <div className={styles.projectTags}>
                  <span>TypeScript</span>
                  <span>React</span>
                  <span>AI</span>
                </div>
              </div>
            </Link>
            <Link href="/projects" className={styles.projectCard}>
              <div className={styles.projectImageWrapper}>
                <Image
                  src="/images/mars-colony.webp"
                  alt="Mars Colony Simulator"
                  width={400}
                  height={250}
                  className={styles.projectImage}
                />
                <div className={styles.projectOverlay}>
                  <span>View Details</span>
                </div>
              </div>
              <div className={styles.projectContent}>
                <h3>Mars Colony Simulator</h3>
                <p>
                  A strategic simulation game exploring the challenges of
                  establishing a sustainable colony on Mars.
                </p>
                <div className={styles.projectTags}>
                  <span>Unity</span>
                  <span>C#</span>
                  <span>Simulation</span>
                </div>
              </div>
            </Link>
            <Link href="/projects" className={styles.projectCard}>
              <div className={styles.projectImageWrapper}>
                <Image
                  src="/images/future-town.webp"
                  alt="Urban Planner"
                  width={400}
                  height={250}
                  className={styles.projectImage}
                />
                <div className={styles.projectOverlay}>
                  <span>View Details</span>
                </div>
              </div>
              <div className={styles.projectContent}>
                <h3>Futuristic Urban Planner</h3>
                <p>
                  An AI-driven project reimagining city planning with predictive
                  analytics and sustainable design.
                </p>
                <div className={styles.projectTags}>
                  <span>Python</span>
                  <span>TensorFlow</span>
                  <span>WebGL</span>
                </div>
              </div>
            </Link>
          </div>
          <div className={styles.centerButton}>
            <Link href="/projects" className={styles.primaryButton}>
              View All Projects
            </Link>
          </div>
        </section>

        <section className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <GitContributionGraph />
            </div>
            <div className={styles.statInfo}>
              <h3>Github Activity</h3>
              <p>
                Continuous contributions to open-source and personal projects
              </p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>15+</div>
            <div className={styles.statInfo}>
              <h3>Projects Completed</h3>
              <p>From concept to deployment across various domains</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statNumber}>4+</div>
            <div className={styles.statInfo}>
              <h3>Years Experience</h3>
              <p>Working with modern technologies and frameworks</p>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaOverlay}></div>
          <div className={styles.ctaContent}>
            <h2>Ready to work together?</h2>
            <p>Let's build something amazing</p>
            <Link href="/chat" className={styles.mayaButton}>
              <Image
                src="/images/chatbot-avatar-v16.webp"
                alt="Maya Assistant"
                width={50}
                height={50}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <div className={styles.buttonText}>
                <span className={styles.mainText}>Chat with Maya</span>
                <span className={styles.subText}>My AI Assistant</span>
              </div>
            </Link>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerLeft}>
              <p>Copyright © 2025 Marcelino Landen. All rights reserved.</p>
            </div>
            <div className={styles.footerRight}>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                LinkedIn
              </a>
              <a
                href="https://x.com/LandenMarcelino"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                X (Twitter)
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
