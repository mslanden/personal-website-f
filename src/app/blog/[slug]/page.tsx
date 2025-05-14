"use client";

import { useState, useEffect, FC, use } from "react";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import styles from "./page.module.css";
import {
  getBlogPostBySlug,
  BlogPost as DbBlogPost,
} from "../../../lib/supabase-client";

type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  imageUrl: string;
  content: string;
  excerpt: string;
};

// Convert database blog post to display format
const convertToDisplayPost = (dbPost: DbBlogPost): BlogPost => {
  return {
    slug: dbPost.slug,
    title: dbPost.title,
    date: dbPost.published_at
      ? new Date(dbPost.published_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date(Date.now()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    author: dbPost.author,
    imageUrl: dbPost.image_url,
    content: dbPost.content,
    excerpt: dbPost.excerpt,
  };
};

// Fallback blog posts for demonstration
const fallbackPosts: Record<string, BlogPost> = {
  "building-ai-agents-with-llms": {
    slug: "building-ai-agents-with-llms",
    title: "Building AI Agents with LLMs",
    date: "February 20, 2025",
    author: "Marcelino Landen",
    imageUrl: "/images/ai-agent-blog.webp",
    excerpt:
      "A deep dive into crafting autonomous AI agents using large language models.",
    content: `
# Building AI Agents with LLMs

Creating autonomous AI agents using Large Language Models (LLMs) represents one of the most exciting frontiers in artificial intelligence today. At Agentica AI, we've been exploring innovative approaches to agent design that leverage the power of models like GPT-4, Claude, and others.

## What Are AI Agents?

AI agents are systems that can:
- Perceive their environment
- Make decisions based on that perception
- Take actions to achieve specific goals

When powered by LLMs, these agents gain remarkable capabilities for understanding context, generating creative solutions, and communicating naturally with humans.

## Core Architecture Components

The architecture of an effective LLM-based agent typically includes:

1. **Memory Systems** - Short-term and long-term memory to maintain context
2. **Planning Modules** - The ability to break down complex tasks into steps
3. **Tool Use** - APIs and functions that extend the agent's capabilities
4. **Reflection Mechanisms** - Self-critique and improvement processes

## Prompt Engineering for Agents

The most critical element in building effective agents is prompt design. A well-crafted prompt establishes:

- The agent's persona and capabilities
- Constraints and operational boundaries
- Decision-making frameworks
- Error handling protocols

## Real-World Applications

We've deployed LLM agents for:
- Customer service automation
- Research assistance
- Code generation and debugging
- Content creation workflows

## Challenges and Future Directions

While powerful, LLM agents still face significant challenges:
- Maintaining coherence over extended interactions
- Objective function alignment
- Tool integration complexity
- Runtime optimization

At Agentica AI, we're working to solve these issues through advanced prompting techniques, specialized training, and hybrid architectures that combine the best aspects of different AI approaches.

Stay tuned for more updates on our agent development work!
      `,
  },
  "nextjs-tricks-for-faster-web-apps": {
    slug: "nextjs-tricks-for-faster-web-apps",
    title: "Next.js Tricks for Faster Web Apps",
    date: "February 15, 2025",
    author: "Marcelino Landen",
    imageUrl: "/images/web-dev-blog.webp",
    excerpt: "Speed up your web development with these Next.js optimizations.",
    content: `
# Next.js Tricks for Faster Web Apps

Next.js has revolutionized React development with its powerful features for building high-performance web applications. Through my work at Agentica AI, I've gathered several optimization techniques that can significantly improve your Next.js app's performance.

## Image Optimization

Next.js provides built-in image optimization through the Image component, but there are ways to take it further:

\`\`\`jsx
// Advanced Image component usage
<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  quality={85} // Adjust based on image content
  priority={isAboveFold} // Load early for above-fold content
  placeholder="blur" // Show blur placeholder while loading
  blurDataURL={blurDataUrl} // Low-res data URL
/>
\`\`\`

## Route Optimization Strategies

### Selective Hydration

When dealing with complex pages, selective hydration can significantly improve performance:

\`\`\`jsx
// Use client directive only where needed
"use client"

import { useEffect, useState } from 'react'

export function InteractiveComponent() {
  // Interactive component code
}
\`\`\`

Then keep most components as server components:

\`\`\`jsx
// This component will be rendered on the server
export function ServerComponent() {
  return <div>Rendered entirely on the server</div>
}
\`\`\`

## Data Fetching Patterns

Using the new App Router data fetching is more efficient:

\`\`\`jsx
// In a Server Component
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <main>{/* Use data */}</main>;
}
\`\`\`

## Monitoring Performance

Always measure the impact of your optimizations:

1. Use the built-in Next.js Analytics
2. Add custom Web Vitals tracking
3. Monitor Core Web Vitals in production

## Conclusion

These Next.js optimizations have helped us at Agentica AI reduce load times by over 40% and significantly improve user experience. Which of these techniques will you implement first?
      `,
  },
};

interface BlogPageProps {
  params: {
    slug: string;
  } | Promise<{
    slug: string;
  }>;
}

const BlogPostPage: FC<BlogPageProps> = ({ params }) => {
  // Unwrap params using React.use() to handle it as a Promise
  const unwrappedParams = params instanceof Promise ? use(params) : params;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);

      try {
        // Try to get post from database
        const dbPost = await getBlogPostBySlug(unwrappedParams.slug);

        if (dbPost) {
          // Convert database post to display format
          setPost(convertToDisplayPost(dbPost));
        } else {
          // Try to get from fallback data
          const fallbackPost = fallbackPosts[unwrappedParams.slug] || null;
          setPost(fallbackPost);
        }
      } catch (error) {
        console.error("Error loading blog post:", error);
        setError("Failed to load blog post");
        // Try fallback if API fails
        const fallbackPost = fallbackPosts[unwrappedParams.slug] || null;
        setPost(fallbackPost);
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [unwrappedParams.slug]); // Proper dependency - just params.slug directly

  if (isLoading) {
    return (
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
              <Link href="/blog" aria-current="page">Blog</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>
        <main className={styles.blogPostContainer}>
          <div className={styles.loading}>Loading post...</div>
        </main>
      </div>
    );
  }

  if (error && !post) {
    return (
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
              <Link href="/blog" aria-current="page">Blog</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>
        <main className={styles.blogPostContainer}>
          <div className={styles.postNotFound}>
            <h1>Error Loading Post</h1>
            <p>{error}</p>
            <Link href="/blog" className={styles.backButton}>
              Back to Blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
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
              <Link href="/blog" aria-current="page">Blog</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>
        <main className={styles.blogPostContainer}>
          <div className={styles.postNotFound}>
            <h1>Post Not Found</h1>
            <p>Sorry, the blog post you're looking for doesn't exist.</p>
            <Link href="/blog" className={styles.backButton}>
              Back to Blog
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
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
            <Link href="/blog" aria-current="page">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      <main className={styles.blogPostMain}>
        <article className={styles.blogPostContent}>
          <div className={styles.blogPostHeader}>
            <h1>{post.title}</h1>
            <div className={styles.blogMeta}>
              <span className={styles.blogDate}>{post.date}</span>
              <span className={styles.blogAuthor}>By {post.author}</span>
            </div>
          </div>

          <div className={styles.blogPostImage}>
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={800}
              height={400}
              priority
            />
          </div>

          <div className={styles.blogPostBody}>
            <Markdown>{post.content}</Markdown>
          </div>
        </article>

        <div className={styles.blogNavigation}>
          <Link href="/blog" className={styles.backToBlogs}>
            ← Back to all posts
          </Link>
        </div>
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
};

export default BlogPostPage;
