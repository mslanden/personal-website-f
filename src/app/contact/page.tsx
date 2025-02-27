"use client";

import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Calendar,
  Github,
  Linkedin,
  Twitter,
  X,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    message: "",
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus({ ...formStatus, isSubmitting: true });

      // Normally you'd send this to an API endpoint
      // For demo purposes, we're simulating a successful submission
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setFormStatus({
          isSubmitting: false,
          isSubmitted: true,
          isError: false,
          message: "Your message has been sent! I'll get back to you soon.",
        });

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } catch (error) {
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

  return (
    <div className={styles.mainContainer}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image
            src="/logo.svg"
            alt="Marcelino Landen"
            width={150}
            height={60}
            priority
          />
        </div>
        <nav className={styles.nav}>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact" className={styles.active}>
            Contact
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Get in Touch</h1>
            <p className={styles.heroSubtitle}>
              Let's connect and discuss your projects or ideas
            </p>
          </div>
        </section>

        <section className={styles.contactSection}>
          <div className={styles.contactContent}>
            <div className={styles.contactInfo}>
              <h2 className={styles.sectionTitle}>Contact Information</h2>
              <p className={styles.contactDesc}>
                Feel free to reach out with any questions or project ideas. I'm
                available for collaborations or just a friendly chat about
                technology and AI.
                <br />
                <br />
                <strong>Note:</strong> I am currently not available for
                freelance work. However, I can offer guidance and support for
                your projects or ideas.
                <br />
                <br />
                If you need work done, I can add you to my list for future
                availability or recommend someone who can help.
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
                  <Phone className={styles.contactIcon} />
                  <div>
                    <h3>Phone</h3>
                    <p>Connect with Maya</p>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <Calendar className={styles.contactIcon} />
                  <div>
                    <h3>Schedule</h3>
                    <p>Mon-Fri, 12pm-5pm PT</p>
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
              <h2 className={styles.sectionTitle}>Send a Message</h2>

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

        <section className={styles.ctaSection}>
          <div className={styles.ctaOverlay}></div>
          <div className={styles.ctaContent}>
            <h2>Want to chat with my AI assistant?</h2>
            <p>
              Meet Maya, my AI assistant who can answer questions about my work
              and experience
            </p>
            <Link href="/chat" className={styles.ctaButton}>
              <Image
                src="/images/chatbot-avatar-v16.webp"
                alt="Maya Assistant"
                width={30}
                height={30}
                style={{ borderRadius: "50%" }}
              />
              Chat with Maya
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
              href="https://github.com/mslanden"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/marcelino-landen-52890728a"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              LinkedIn
            </a>
            <a
              href="https://x.com/LandenMarcelino"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              X (Twitter)
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
