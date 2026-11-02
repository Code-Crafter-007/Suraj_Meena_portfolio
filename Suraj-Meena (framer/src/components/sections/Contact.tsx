'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import styles from './Contact.module.css';
import { SITE_METADATA } from '@/data/site';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.project) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', project: '' });
      } else {
        // Fallback to mailto
        const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nProject Details:\n${formData.project}`
        );
        window.location.href = `mailto:${SITE_METADATA.email}?subject=${subject}&body=${body}`;
        setSubmitted(true);
      }
    } catch {
      // Network fallback to mailto
      const subject = encodeURIComponent(`Portfolio Inquiry from ${formData.name}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nProject Details:\n${formData.project}`
      );
      window.location.href = `mailto:${SITE_METADATA.email}?subject=${subject}&body=${body}`;
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const socials = [
    {
      name: 'X (Twitter)',
      href: SITE_METADATA.socials.twitter,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: SITE_METADATA.socials.instagramPersonal,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: SITE_METADATA.socials.linkedin,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: SITE_METADATA.socials.youtube,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return (
    <section className={styles.section} id="contact" aria-label="Contact Section">
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Heading, Subtext, Social Links */}
          <div className={styles.leftCol}>
            <div className={styles.titleWrap}>
              <motion.h2
                initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={styles.title}
              >
                Let’s talk.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={styles.description}
              >
                Have a project or need help? Fill out the form, and we&apos;ll get back to you soon.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={styles.socialRow}
            >
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialBtn}
                  aria-label={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Original Framer Dark Card Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={styles.rightCol}
          >
            <div className={styles.formCard}>
              {submitted ? (
                <div className={styles.successMessage}>
                  <h3>Thank you!</h3>
                  <p>Your message has been successfully received. We will get back to you shortly.</p>
                  <p style={{ marginTop: 8, fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>
                    Direct contact: <a href={`mailto:${SITE_METADATA.email}`} className={styles.directMail}>{SITE_METADATA.email}</a>
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    style={{
                      marginTop: 16,
                      background: 'none',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#FAF7F3',
                      padding: '6px 14px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  {errorMsg && (
                    <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: 12 }}>
                      {errorMsg}
                    </div>
                  )}

                  <div className={styles.fieldGroup}>
                    <label htmlFor="contact-name" className={styles.label}>
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={styles.input}
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="contact-email" className={styles.label}>
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={styles.input}
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="contact-project" className={styles.label}>
                      Your Project
                    </label>
                    <textarea
                      id="contact-project"
                      required
                      rows={4}
                      placeholder="Tell us about your project"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className={styles.textarea}
                      disabled={loading}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    <span className={styles.submitText}>
                      {loading ? 'Sending...' : 'Submit'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
