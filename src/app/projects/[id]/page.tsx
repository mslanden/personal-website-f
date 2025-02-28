"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import styles from './page.module.css';
import { Metadata } from 'next';
import { getProjectBySlug, Project as ProjectType } from '../../../lib/supabase-client';

// Define project data structure
type Project = {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  images: string[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  features: string[];
  category: string;
  date: string;
};

// Fallback project data
const fallbackProjects: Project[] = [
  {
    id: "smart-home-ai",
    title: "Smart Home AI System",
    shortDesc: "An advanced home automation system powered by AI",
    fullDesc: `The Smart Home AI System is a comprehensive solution designed to optimize energy usage, enhance security, and improve comfort in residential environments.

This system leverages machine learning algorithms to learn user preferences and patterns, allowing for intelligent automation of lighting, climate control, entertainment systems, and security features. By analyzing real-time data from various sensors throughout the home, the AI can make informed decisions that maximize efficiency while maintaining user comfort.

The core components include:
- Central AI hub for processing and decision making
- Network of IoT sensors and control devices
- Mobile app interface for user configuration and manual control
- Voice control integration with popular assistant platforms
- Advanced security features with anomaly detection

Throughout development, I focused on creating an intuitive user experience while ensuring the underlying AI models maintained a balance between automation and user agency. The system respects privacy by processing sensitive data locally whenever possible.`,
    images: [
      "/images/mars-colony.webp",
      "/images/smart-home-1.jpg",
      "/images/smart-home-2.jpg"
    ],
    technologies: ["TensorFlow", "React", "Node.js", "AWS IoT", "Python"],
    githubUrl: "https://github.com/username/smart-home-ai",
    demoUrl: "https://demo.example.com",
    features: [
      "Voice-activated controls",
      "Energy optimization",
      "Security monitoring",
      "Personalized environment settings",
      "Detailed usage analytics"
    ],
    category: "AI Agents",
    date: "December 2024"
  },
  {
    id: "eco-conscious-living-app",
    title: "Eco-Conscious Living App",
    shortDesc: "A mobile app promoting sustainability with AI-powered personalized tips",
    fullDesc: `The Eco-Conscious Living App is designed to help users reduce their environmental impact through small, consistent changes in daily habits.

By leveraging AI and machine learning, the app analyzes user behavior patterns and provides personalized recommendations for sustainable living. The recommendations are tailored to each user's lifestyle, preferences, and local environment, making sustainable choices more accessible and realistic.

This mobile application includes features such as:
- Carbon footprint calculator with personalized reduction goals
- Sustainable shopping guides based on location and preferences
- Community challenges and achievement system
- Integration with smart home devices for energy monitoring
- Educational content on environmental impact

The development process involved extensive research into behavioral psychology and sustainable practices to ensure the app's recommendations were both environmentally beneficial and practical for users to implement.`,
    images: [
      "/images/future-town.webp",
      "/images/eco-app-1.jpg",
      "/images/eco-app-2.jpg"
    ],
    technologies: ["React Native", "TensorFlow Lite", "Firebase", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/username/eco-conscious-app",
    features: [
      "Personalized sustainability recommendations",
      "Carbon footprint tracking",
      "Community challenges",
      "Local sustainable shopping guides",
      "Habit-building resources"
    ],
    category: "Web Design",
    date: "October 2024"
  },
  {
    id: "vr-space-exploration",
    title: "VR Space Exploration",
    shortDesc: "An immersive VR game simulating space travel and planetary colonization",
    fullDesc: `VR Space Exploration is an immersive virtual reality experience that combines scientific accuracy with engaging gameplay to simulate interplanetary travel and colonization.

Players embark on missions to explore our solar system, establish outposts on various celestial bodies, and overcome the unique challenges presented by each environment. The game incorporates actual astronomical data and physics principles to create a realistic yet accessible space simulation.

Key features of the VR experience include:
- Scientifically accurate models of planets, moons, and space phenomena
- Realistic spacecraft controls and orbital mechanics
- Resource management and colony building mechanics
- Multiplayer exploration and collaboration options
- Educational content integrated with gameplay

The development process involved collaboration with astronomy experts to ensure scientific accuracy while maintaining an engaging gameplay loop. Special attention was paid to comfort and accessibility in the VR environment to make space exploration available to a wide audience.`,
    images: [
      "/images/simple-game-concept.jpeg",
      "/images/vr-space-1.jpg",
      "/images/vr-space-2.jpg"
    ],
    technologies: ["Unity", "C#", "Oculus SDK", "Blender", "Photon Networking"],
    demoUrl: "https://store.steampowered.com/example",
    features: [
      "Scientifically accurate space simulation",
      "Immersive VR controls for spacecraft",
      "Planet surface exploration",
      "Colony building mechanics",
      "Multiplayer exploration"
    ],
    category: "Game Development",
    date: "August 2024"
  }
];

// Function to get project data from fallback
const getFallbackProject = (id: string): Project | undefined => {
  return fallbackProjects.find(project => project.id === id);
};

// Convert database project to detail project
const convertToDetailProject = (dbProject: ProjectType): Project => {
  return {
    id: dbProject.id,
    title: dbProject.title,
    shortDesc: dbProject.description,
    fullDesc: dbProject.content,
    images: [dbProject.image_url], // Use main image, we'd need to add more images to DB model
    technologies: dbProject.technologies || [],
    features: dbProject.features || [], // Use features from DB
    category: dbProject.category,
    date: "2025" // We'd need to add this to DB model
  };
};

export default function ProjectDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  // Unwrap params with React.use for future Next.js compatibility
  const { id } = use(params as Promise<{ id: string }>);
  
  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      try {
        // Try to get from database first
        const dbProject = await getProjectBySlug(id);
        
        if (dbProject) {
          // Convert database project to detail project
          setProject(convertToDetailProject(dbProject));
        } else {
          // Fallback to static data
          const fallbackProject = getFallbackProject(id);
          setProject(fallbackProject);
        }
      } catch (error) {
        console.error("Error loading project:", error);
        // Try fallback if API fails
        const fallbackProject = getFallbackProject(id);
        setProject(fallbackProject);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className={styles.mainPageContainer}>
        <header className={styles.headerContainer}>
          <div className={styles.logo}>
            <Image src="/logo.svg" alt="Marcelino Landen" width={200} height={80} />
          </div>
          <nav aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/projects" aria-current="true">Projects</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        <main className={styles.projectDetailMain}>
          <div className={styles.loading}>Loading project details...</div>
        </main>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className={styles.mainPageContainer}>
        <header className={styles.headerContainer}>
          <div className={styles.logo}>
            <Image src="/logo.svg" alt="Marcelino Landen" width={200} height={80} />
          </div>
          <nav aria-label="Main navigation">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/projects" aria-current="true">Projects</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </header>
        <main className={styles.projectDetailMain}>
          <div className={styles.projectNotFound}>
            <h1>Project Not Found</h1>
            <p>Sorry, the project you're looking for doesn't exist.</p>
            <Link href="/projects" className={styles.backButton}>
              Back to Projects
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className={styles.mainPageContainer}>
      <header className={styles.headerContainer}>
        <div className={styles.logo}>
          <Image src="/logo.svg" alt="Marcelino Landen" width={200} height={80} />
        </div>
        <nav aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/projects" aria-current="true">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>
      
      <main className={styles.projectDetailMain}>
        <div className={styles.projectHeader}>
          <h1>{project.title}</h1>
          <div className={styles.projectMeta}>
            <span className={styles.projectCategory}>{project.category}</span>
            <span className={styles.projectDate}>{project.date}</span>
          </div>
        </div>
        
        <div className={styles.projectImageGallery}>
          <div className={styles.mainProjectImage}>
            <Image 
              src={project.images[0]} 
              alt={project.title}
              width={800}
              height={450}
              layout="responsive"
              priority
            />
          </div>
          
          {project.images.length > 1 && (
            <div className={styles.thumbnails}>
              {project.images.slice(1).map((image, index) => (
                <div key={index} className={styles.thumbnail}>
                  <Image
                    src={image}
                    alt={`${project.title} - image ${index + 2}`}
                    width={150}
                    height={100}
                    layout="responsive"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.projectContent}>
          <div className={styles.projectDescription}>
            <h2>About this Project</h2>
            <div className={styles.cardContainer}>
              <Markdown>{project.fullDesc}</Markdown>
            </div>
          </div>
          
          <div className={styles.projectSidebar}>
            <div className={styles.projectLinks}>
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.projectLink}
                >
                  View on GitHub
                </a>
              )}
              
              {project.demoUrl && (
                <a 
                  href={project.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.projectLink}
                >
                  Live Demo
                </a>
              )}
            </div>
            
            <div className={styles.projectTechnologies}>
              <h3>Technologies</h3>
              <ul>
                {project.technologies.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.projectFeatures}>
              <h3>Key Features</h3>
              <ul>
                {Array.isArray(project.features) ? project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                )) : null}
              </ul>
            </div>
          </div>
        </div>
        
        <div className={styles.projectNavigation}>
          <Link href="/projects" className={styles.backToProjects}>
            ← Back to all projects
          </Link>
        </div>
      </main>
      
      <footer className={styles.footer}>
        <span>Copyright © 2025 Marcelino Landen</span>
        <div className={styles.socialLinks}>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</Link>
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</Link>
        </div>
      </footer>
    </div>
  );
}

// Metadata must be generated dynamically or created in a separate file