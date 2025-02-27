"use client";

import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", name: "All Posts" },
    { id: "ai", name: "AI & Tech" },
    { id: "dev", name: "Web Dev" },
    { id: "tutorial", name: "Tutorials" },
    { id: "lifestyle", name: "Lifestyle" },
  ];

  const blogPosts = [
    {
      id: "ai-agents",
      category: "ai",
      title: "Building AI Agents with LLMs",
      date: "February 20, 2025",
      excerpt:
        "A deep dive into crafting autonomous AI agents using large language models, with tips from my work at Agentica AI.",
      image: "/images/ai-agent-blog.webp",
      slug: "building-ai-agents-with-llms",
      featured: true,
    },
    {
      id: "nextjs-tricks",
      category: "dev",
      title: "Next.js Tricks for Faster Web Apps",
      date: "February 15, 2025",
      excerpt:
        "Speed up your web development with these Next.js optimizations I've picked up on the job.",
      image: "/images/web-dev-blog.webp",
      slug: "nextjs-tricks",
      featured: false,
    },
    {
      id: "surfing-tech",
      category: "lifestyle",
      title: "Surfing Meets Tech: IoT on the Waves",
      date: "February 10, 2025",
      excerpt:
        "How I combined my love for surfing with IoT to track conditions in SoCal.",
      image: "/images/surfing-tech-blog.webp",
      slug: "surfing-tech",
      featured: false,
    },
    {
      id: "cloud-shift",
      category: "ai",
      title: "Cloud Shift: Empowering Developers",
      date: "February 5, 2025",
      excerpt:
        "Exploring Agentica AI's cloud tech approach and its impact on modern dev workflows.",
      image: "/images/cloud-blog.webp",
      slug: "cloud-shift",
      featured: false,
    },
    {
      id: "prompt-engineering",
      category: "tutorial",
      title: "Prompt Engineering for AI Developers",
      date: "January 30, 2025",
      excerpt:
        "A practical guide to crafting effective prompts for large language models like Claude and GPT-4.",
      image: "/images/prompt-engineering.webp",
      slug: "prompt-engineering",
      featured: false,
    },
    {
      id: "socal-tech",
      category: "lifestyle",
      title: "The SoCal Tech Renaissance",
      date: "January 25, 2025",
      excerpt:
        "How Southern California is becoming a new hub for AI and tech innovation.",
      image: "/images/socal-tech.webp",
      slug: "socal-tech",
      featured: false,
    },
  ];

  const featuredPost = blogPosts.find((post) => post.featured);

  const filteredPosts = blogPosts
    .filter((post) => !post.featured) // Exclude featured post
    .filter((post) => activeFilter === "all" || post.category === activeFilter) // Filter by category
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
    ); // Filter by search term

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
          <Link href="/projects">Projects</Link>
          <Link href="/blog" aria-current="page" className={styles.active}>
            Blog
          </Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.blogHero}>
          <div className={styles.heroContent}>
            <h1>Insights & Thoughts</h1>
            <div className={styles.divider}></div>
            <p>Explorations in AI, development, and the tech landscape</p>
          </div>
        </section>

        {featuredPost && (
          <section className={styles.featuredSection}>
            <div className={styles.featuredLabel}>Featured Post</div>
            <div className={styles.featuredPost}>
              <div className={styles.featuredImageContainer}>
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                  className={styles.featuredImage}
                />
              </div>
              <div className={styles.featuredContent}>
                <div className={styles.featuredMeta}>
                  <span className={styles.featuredDate}>
                    {featuredPost.date}
                  </span>
                  <span className={styles.featuredCategory}>
                    {filters.find((f) => f.id === featuredPost.category)?.name}
                  </span>
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className={styles.readMoreButton}
                >
                  Read Article
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className={styles.blogSection}>
          <div className={styles.blogControls}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button
                  className={styles.clearButton}
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

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
          </div>

          {filteredPosts.length > 0 ? (
            <div className={styles.blogGrid}>
              {filteredPosts.map((post) => (
                <article key={post.id} className={styles.blogCard}>
                  <div className={styles.blogImageContainer}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={styles.blogImage}
                    />
                    <div className={styles.blogOverlay}>
                      <div className={styles.blogTags}>
                        <span className={styles.blogCategory}>
                          {filters.find((f) => f.id === post.category)?.name}
                        </span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className={styles.readButton}
                      >
                        Read Article
                      </Link>
                    </div>
                  </div>
                  <div className={styles.blogInfo}>
                    <div className={styles.blogDate}>{post.date}</div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className={styles.blogFooter}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className={styles.readMoreLink}
                      >
                        Continue reading →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <h3>No posts found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button
                className={styles.resetButton}
                onClick={() => {
                  setSearchTerm("");
                  setActiveFilter("all");
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        <section className={styles.subscribeSection}>
          <div className={styles.subscribeContent}>
            <h2>Stay Updated</h2>
            <p>Get notified when I publish new articles and insights</p>
            <form className={styles.subscribeForm}>
              <input
                type="email"
                placeholder="Your email address"
                className={styles.emailInput}
                aria-label="Email for newsletter subscription"
              />
              <button type="submit" className={styles.subscribeButton}>
                Subscribe
              </button>
            </form>
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
