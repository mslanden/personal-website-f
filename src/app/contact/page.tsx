"use client";

import React from 'react';
import styles from './page.module.css';
import { Mail, MapPin, Calendar, Linkedin, Twitter, Github } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import { submitContactForm } from '../../services/api';

export default function ContactPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = React.useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    message: "",
  });

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus({ ...formStatus, isSubmitting: true });

      try {
        // Send the form data to Supabase via our API service
        const result = await submitContactForm(formData);
        
        if (result.status === 'success') {
          setFormStatus({
            isSubmitting: false,
            isSubmitted: true,
            isError: false,
            message: "Your message has been sent! I'll get back to you soon.",
          });

          // Clear the form after successful submission
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        } else {
          // Handle error from API
          setFormStatus({
            isSubmitting: false,
            isSubmitted: true,
            isError: true,
            message: result.message || "Something went wrong. Please try again later.",
          });
        }
      } catch (error) {
        console.error("Error submitting contact form:", error);
        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          isError: true,
          message: "Something went wrong. Please try again later.",
        });
      }
    },
    [formData, formStatus],
  );

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={styles.contactPageContainer}>
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
            <Link href="/contact" aria-current="page">Contact</Link>
          </nav>
        </div>
      </header>

      <section className={`${styles.heroSection} ${isVisible ? styles.visible : ""}`}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Get In Touch</h1>
          <p className={styles.heroDescription}>Have a project in mind or just want to say hello? I'd love to hear from you and discuss how we can work together to bring your ideas to life.</p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.contactContent}>
          <div className={styles.contactInfo}>
            <h2>Contact Information</h2>
            <p className={styles.contactDesc}>
              Feel free to reach out through any of the methods below. I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className={styles.contactMethods}>
              <div className={styles.contactMethod}>
                <Mail className={styles.contactIcon} />
                <div>
                  <h3>Email</h3>
                  <p>marcelino@marcelinolanden.com</p>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <MapPin className={styles.contactIcon} />
                <div>
                  <h3>Location</h3>
                  <p>Mountain Center, CA</p>
                </div>
              </div>
              
              <div className={styles.contactMethod}>
                <Calendar className={styles.contactIcon} />
                <div>
                  <h3>Schedule a Meeting</h3>
                  <p>
                    <a 
                      href="https://cal.com/marcelinolanden" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.scheduleLink}
                    >
                      Book a time on my calendar
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            <div className={styles.socialLinks}>
              <a
                href="https://github.com/mslanden"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/marcelino-landen-52890728a"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://x.com/LandenMarcelino"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Twitter (X)"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
          
          <div className={styles.contactForm}>
            <h2>Send a Message</h2>
            
            {formStatus.isSubmitted && (
              <div
                className={`${styles.formMessage} ${formStatus.isError ? styles.errorMessage : styles.successMessage}`}
              >
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formControl}>
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div className={styles.formControl}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.formControl}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What's this about?"
                />
              </div>

              <div className={styles.formControl}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message here..."
                  rows={5}
                ></textarea>
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={formStatus.isSubmitting}
              >
                {formStatus.isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.mapContainer}>
          <div className={styles.mapContent}>
            <div className={styles.map}>
              <div className={styles.mapImageWrapper}>
                <Image 
                  src="/images/socal-map.png" 
                  alt="Southern California Map" 
                  width={250} 
                  height={250}
                  className={styles.mapImage}
                />
              </div>
            </div>
            <div className={styles.mapText}>
              <h2>Find Me</h2>
              <p>Based in Southern California, available for remote work worldwide</p>
              <p className={styles.locationName}>Mountain Center, CA</p>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          © {new Date().getFullYear()} Marcelino Landen. All rights reserved.
        </div>
        <div className={styles.contactEmail}>
          marcelino@marcelinolanden.com
        </div>
      </footer>
    </div>
  );
}
