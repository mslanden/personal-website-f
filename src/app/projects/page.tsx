"use client";

import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getProjects, getFeaturedProject, getProjectCategories, Project } from "../../lib/supabase-client";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic filters with "All" as the first option
  const filters = [
    { id: "all", name: "All" },
    ...categories.map(category => ({
      id: category,
      name: category === 'ai' ? 'AI & ML' : 
           category === 'web' ? 'Web Apps' : 
           category === 'game' ? 'Games' : 
           category.charAt(0).toUpperCase() + category.slice(1) // Capitalize first letter for other categories
    }))
  ];

  // Fallback projects in case database is empty
  const fallbackProjects = [
    {
      id: "ai-productivity",
      category: "ai",
      featured: true,
      title: "Maya - AI Personal Assistant",
      description:
        "A comprehensive suite of AI-driven tools crafted to optimize workflows. Features smart scheduling, task automation, and intelligent communication systems.",
      image_url: "/images/chatbot-avatar-v16.webp",
      slug: "ai-enhanced-productivity-suite",
      content: "",
      technologies: []
    },
    {
      id: "smart-home",
      category: "ai",
      featured: false,
      title: "Smart Home AI System",
      description:
        "An advanced home automation system powered by AI, optimizing energy and enhancing security.",
      image_url: "/images/mars-colony.webp",
      slug: "smart-home-ai",
      content: "",
      technologies: []
    },
    {
      id: "eco-app",
      category: "web",
      featured: false,
      title: "Eco-Conscious Living App",
      description:
        "A mobile app promoting sustainability with AI-powered personalized tips.",
      image_url: "/images/future-town.webp",
      slug: "eco-conscious-living-app",
      content: "",
      technologies: []
    },
    {
      id: "vr-space",
      category: "game",
      featured: false,
      title: "VR Space Exploration",
      description:
        "An immersive VR game simulating space travel and planetary colonization.",
      image_url: "/images/simple-game-concept.jpeg",
      slug: "vr-space-exploration",
      content: "",
      technologies: []
    },
    {
      id: "financial-ai",
      category: "ai",
      featured: false,
      title: "AI Financial Analyst",
      description:
        "A predictive analytics tool for financial markets and investment analysis.",
      image_url: "/images/competitive-analysis.webp",
      slug: "ai-financial-analyst",
      content: "",
      technologies: []
    },
    {
      id: "lang-app",
      category: "web",
      featured: false,
      title: "Language Learning App",
      description:
        "An AI-adaptive platform for personalized language education.",
      image_url: "/images/text-editor.webp",
      slug: "language-learning-app",
      content: "",
      technologies: []
    },
  ];

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        // Load everything in parallel for better performance
        const [featured, allProjects, projectCategories] = await Promise.all([
          getFeaturedProject(),
          getProjects(),
          getProjectCategories()
        ]);
        
        // Set categories
        setCategories(projectCategories);
        
        if (allProjects && allProjects.length > 0) {
          setProjects(allProjects);
        } else {
          // Fallback to static data if no projects in the database
          setProjects(fallbackProjects);
        }
        
        if (featured) {
          setFeaturedProject(featured);
        } else {
          // Fallback to first project marked as featured
          setFeaturedProject(fallbackProjects.find(p => p.featured) || null);
        }
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjects(fallbackProjects);
        setFeaturedProject(fallbackProjects.find(p => p.featured) || null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  // Filter projects for display
  // For "all" category, include everything (including featured)
  // For specific categories, filter by that category
  const filteredProjects =
    activeFilter === "all"
      ? projects // Include all projects
      : projects.filter(
          project => project.category === activeFilter
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

        {isLoading ? (
          <div className={styles.loadingContainer}>
            <p>Loading projects...</p>
          </div>
        ) : featuredProject && (
          <section className={styles.featuredSection}>
            <div className={styles.featuredLabel}>Featured Project</div>
            <div className={styles.featuredProject}>
              <div className={styles.featuredImageContainer}>
                <Image
                  src={featuredProject.image_url}
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
            {isLoading ? (
              <div className={styles.loadingContainer}>
                <p>Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className={styles.noProjectsMessage}>
                <p>No projects found in this category.</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectImageContainer}>
                    <Image
                      src={project.image_url}
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
              ))
            )}
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
