"use client";

import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getBlogPosts, getBlogCategories } from "../../lib/supabase-client";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Always include "all" as the first filter
  const filters = [
    { id: "all", name: "All Posts" },
    // Dynamic categories will be added to this
    ...categories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1) // Capitalize first letter
    }))
  ];
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch posts and categories in parallel
        const [posts, categoryList] = await Promise.all([
          getBlogPosts(),
          getBlogCategories()
        ]);
        
        // Set categories
        setCategories(categoryList);
        
        // Transform posts to fit the expected format
        const formattedPosts = posts.map(post => ({
          id: post.id,
          category: post.category || "other",
          title: post.title,
          date: new Date(post.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          excerpt: post.excerpt,
          image: post.image_url || "/images/default-blog.webp",
          slug: post.slug,
          featured: post.featured
        }));
        
        setBlogPosts(formattedPosts);
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setError("Failed to load blog posts");
        
        // Fallback to sample posts for development
        setBlogPosts([
          {
            id: "sample-post",
            category: "dev",
            title: "Sample Blog Post",
            date: "February 27, 2025",
            excerpt: "This is a sample blog post for when the database connection fails.",
            image: "/images/web-dev-blog.webp",
            slug: "sample-post",
            featured: true,
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const featuredPost = blogPosts.find((post) => post.featured);

  const filteredPosts = blogPosts
    // Include all posts in all views (no exclusions)
    .filter((post) => activeFilter === "all" || post.category === activeFilter) // Filter by category
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()),
    ); // Filter by search term

  return (
    <div className={styles.blogPageContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoText}>Marcelino Landen</Link>
          </div>
          <nav className={styles.navigation}>
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/blog" aria-current="page">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <section className={`${styles.heroSection} ${isVisible ? styles.visible : ""}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Insights & Thoughts</h1>
            <p className={styles.heroDescription}>Explorations in AI, development, and the tech landscape</p>
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

          {isLoading ? (
            <div className={styles.loadingContainer}>
              <p>Loading blog posts...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p>{error}</p>
              <button 
                className={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : filteredPosts.length > 0 ? (
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
