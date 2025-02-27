"use client";

import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className={styles.mainPageContainer}>
      {/* Header Navigation */}
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
          <Link href="/">Home</Link>
          <Link href="/about" aria-current="page" className={styles.active}>
            About
          </Link>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroTitle}>About</h1>
          <div className={styles.heroLine}></div>
        </div>
      </section>

      <main className={styles.aboutContainer}>
        {/* Two Column Bio Layout */}
        <section className={styles.bioSection}>
          <div className={styles.bioImageWrap}>
            <div className={styles.bioImage}>
              <Image
                src="/images/marcelino-avatar-v1.webp"
                alt="Marcelino Landen"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
            <div className={styles.bioSocials}>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <span>LinkedIn</span>
              </a>
              <a
                href="https://x.com/LandenMarcelino"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <span>X (Twitter)</span>
              </a>
            </div>
          </div>

          <div className={styles.bioContent}>
            <h2>AI Engineer & Tech Innovator</h2>

            <p>
              Based in Southern California, I'm a software developer
              specializing in AI systems and web development. At Agentica AI, I
              build intelligent tools that transform how teams work with data
              and automate complex workflows.
            </p>

            <p>
              My passion lies at the intersection of AI, creative
              problem-solving, and user-centered design. I believe technology
              should amplify human capabilities rather than replace them —
              creating tools that feel like extensions of thought rather than
              obstacles to overcome.
            </p>

            <div className={styles.statCards}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>4+</span>
                <span className={styles.statLabel}>Years Experience</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>20+</span>
                <span className={styles.statLabel}>Projects Completed</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>10+</span>
                <span className={styles.statLabel}>Tech Stack Tools</span>
              </div>
            </div>

            <Link href="/contact" className={styles.bioButton}>
              Get in Touch
            </Link>
          </div>
        </section>

        {/* Skills Section with Modern Cards */}
        <section className={styles.skillsSection}>
          <div className={styles.sectionHeader}>
            <h2>Expertise</h2>
            <div className={styles.sectionDivider}></div>
          </div>

          <div className={styles.skillsGrid}>
            <div className={styles.skillCard}>
              <div className={styles.skillIcon}>
                <div className={styles.iconCircle}></div>
              </div>
              <h3>AI Engineering</h3>
              <p>
                Building intelligent systems that learn and adapt, from
                autonomous agents to recommendation engines and natural language
                interfaces.
              </p>
              <ul className={styles.skillList}>
                <li>LLM Integration</li>
                <li>Agent Frameworks</li>
                <li>Prompt Engineering</li>
                <li>Multimodal Systems</li>
              </ul>
            </div>

            <div className={styles.skillCard}>
              <div className={styles.skillIcon}>
                <div className={styles.iconCircle}></div>
              </div>
              <h3>Web Development</h3>
              <p>
                Creating performant, accessible, and beautiful web applications
                with modern frameworks and a focus on user experience.
              </p>
              <ul className={styles.skillList}>
                <li>React & Next.js</li>
                <li>TypeScript</li>
                <li>Responsive Design</li>
                <li>API Integration</li>
              </ul>
            </div>

            <div className={styles.skillCard}>
              <div className={styles.skillIcon}>
                <div className={styles.iconCircle}></div>
              </div>
              <h3>Game Design</h3>
              <p>
                Crafting immersive gameplay experiences with scalable systems,
                leveraging cutting-edge tools and technology to bring ideas to
                life.
              </p>
              <ul className={styles.skillList}>
                <li>Unreal Engine</li>
                <li>C++</li>
                <li>Blender</li>
                <li>Gameplay Systems</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className={styles.timelineSection}>
          <div className={styles.sectionHeader}>
            <h2>Journey</h2>
            <div className={styles.sectionDivider}></div>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>2024 - Present</div>
              <div className={styles.timelineContent}>
                <h3>AI Engineer & Full-Stack Developer at Agentica AI</h3>
                <p>
                  Developing AI-driven applications, automating workflows, and
                  building scalable systems that integrate LLMs. Contributing to
                  AI agent orchestration and optimizing real-world applications
                  of artificial intelligence.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>2023 - Present</div>
              <div className={styles.timelineContent}>
                <h3>Independent AI & Software Developer</h3>
                <p>
                  Building AI-powered systems, game prototypes, and custom
                  software solutions. Developing <em>Agent OS</em>, a
                  next-generation AI-driven interface for enhanced user
                  interaction. Exploring game development and emerging AI
                  technologies.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>2021 - 2023</div>
              <div className={styles.timelineContent}>
                <h3>Software Development & AI Studies</h3>
                <p>
                  Studied C++, Python, cybersecurity, and agentic systems
                  through academic courses and certification programs. Gained
                  hands-on experience with software development, AI frameworks,
                  and security principles to build a strong technical
                  foundation.
                </p>
              </div>
            </div>

            <div className={styles.timelineItem}>
              <div className={styles.timelineDate}>Self-Taught Journey</div>
              <div className={styles.timelineContent}>
                <h3>AI, Software Development & Game Design</h3>
                <p>
                  Passionately learning and building through hands-on projects.
                  Developed expertise in AI, LLMs, and game development outside
                  traditional academia, focusing on real-world applications and
                  innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className={styles.philosophySection}>
          <div className={styles.philosophyCard}>
            <h2>My Approach</h2>
            <div className={styles.philosophyContent}>
              <p>
                I believe the best technology becomes invisible, solving
                problems so naturally that users barely notice its presence. My
                work focuses on creating systems that enhance human capabilities
                rather than replacing them.
              </p>

              <p>
                Every project begins with deep understanding – of users, of
                systems, of constraints. I'm passionate about finding elegant
                solutions that balance technical excellence with practical
                usability.
              </p>

              <blockquote className={styles.philosophyQuote}>
                "The future belongs to those who can bridge the gap between
                human needs and technological possibilities."
              </blockquote>
            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Let's Build Something Amazing</h2>
            <p>
              Whether you're looking to enhance your product with AI
              capabilities, need a sophisticated web application, or just want
              to discuss the possibilities, I'd love to hear from you.
            </p>
            <Link href="/contact" className={styles.ctaButton}>
              Start a Conversation
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <p>© 2025 Marcelino Landen. All rights reserved.</p>
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
  );
}
