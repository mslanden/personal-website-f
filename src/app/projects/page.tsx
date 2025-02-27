"use client";

import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", name: "All" },
    { id: "ai", name: "AI & ML" },
    { id: "web", name: "Web Apps" },
    { id: "game", name: "Games" },
  ];

  const projects = [
    {
      id: "ai-productivity",
      category: "ai",
      featured: true,
      title: "Maya - AI Personal Assistant",
      description:
        "A comprehensive suite of AI-driven tools crafted to optimize workflows. Features smart scheduling, task automation, and intelligent communication systems.",
      image: "/images/chatbot-avatar-v16.webp",
      slug: "ai-enhanced-productivity-suite",
    },
    {
      id: "smart-home",
      category: "ai",
      featured: false,
      title: "Smart Home AI System",
      description:
        "An advanced home automation system powered by AI, optimizing energy and enhancing security.",
      image: "/images/mars-colony.webp",
      slug: "smart-home-ai",
    },
    {
      id: "eco-app",
      category: "web",
      featured: false,
      title: "Eco-Conscious Living App",
      description:
        "A mobile app promoting sustainability with AI-powered personalized tips.",
      image: "/images/future-town.webp",
      slug: "eco-conscious-living-app",
    },
    {
      id: "vr-space",
      category: "game",
      featured: false,
      title: "VR Space Exploration",
      description:
        "An immersive VR game simulating space travel and planetary colonization.",
      image: "/images/simple-game-concept.jpeg",
      slug: "vr-space-exploration",
    },
    {
      id: "financial-ai",
      category: "ai",
      featured: false,
      title: "AI Financial Analyst",
      description:
        "A predictive analytics tool for financial markets and investment analysis.",
      image: "/images/competitive-analysis.webp",
      slug: "ai-financial-analyst",
    },
    {
      id: "lang-app",
      category: "web",
      featured: false,
      title: "Language Learning App",
      description:
        "An AI-adaptive platform for personalized language education.",
      image: "/images/text-editor.webp",
      slug: "language-learning-app",
    },
  ];

  const featuredProject = projects.find((project) => project.featured);
  const filteredProjects =
    activeFilter === "all"
      ? projects.filter((project) => !project.featured)
      : projects.filter(
          (project) => project.category === activeFilter && !project.featured,
        );

  return (
    <div className={styles.container}>
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
          <Link href="/about">About</Link>
          <Link href="/projects" aria-current="page" className={styles.active}>
            Projects
          </Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.projectsHero}>
          <div className={styles.heroContent}>
            <h1>Portfolio</h1>
            <div className={styles.divider}></div>
            <p>
              An evolving collection of my work in AI, web development, and
              interactive experiences
            </p>
          </div>
        </section>

        {featuredProject && (
          <section className={styles.featuredSection}>
            <div className={styles.featuredLabel}>Featured Project</div>
            <div className={styles.featuredProject}>
              <div className={styles.featuredImageContainer}>
                <Image
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover", borderRadius: "1rem" }}
                  className={styles.featuredImage}
                />
                <div className={styles.featuredOverlay}></div>
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.featuredCategory}>
                  {filters.find((f) => f.id === featuredProject.category)?.name}
                </div>
                <h2>{featuredProject.title}</h2>
                <p>{featuredProject.description}</p>
                <div className={styles.featuredActions}>
                  <Link
                    href={`/projects/${featuredProject.slug}`}
                    className={styles.primaryButton}
                  >
                    View Details
                  </Link>
                  <Link href="/contact" className={styles.secondaryButton}>
                    Discuss this Project
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className={styles.projectsSection}>
          <div className={styles.filterContainer}>
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`${styles.filterButton} ${activeFilter === filter.id ? styles.activeFilter : ""}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.name}
              </button>
            ))}
          </div>

          <div className={styles.projectsGrid}>
            {filteredProjects.map((project) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectImageContainer}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={styles.projectImage}
                  />
                  <div className={styles.projectOverlay}>
                    <div className={styles.projectTags}>
                      <span className={styles.projectCategory}>
                        {filters.find((f) => f.id === project.category)?.name}
                      </span>
                    </div>
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
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2>Have a project in mind?</h2>
            <p>Let's collaborate and create something exceptional together.</p>
            <Link href="/contact" className={styles.ctaButton}>
              Start a Conversation
            </Link>
          </div>
        </section>
      </main>

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
