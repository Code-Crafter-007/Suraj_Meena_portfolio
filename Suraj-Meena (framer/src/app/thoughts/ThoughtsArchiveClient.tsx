'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CmsArticle } from '@/types/cms';
import styles from './thoughts.module.css';

interface Props {
  initialArticles: CmsArticle[];
}

export default function ThoughtsArchiveClient({ initialArticles }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(initialArticles.map((a) => a.category)))];

  const filtered = initialArticles.filter((a) => {
    if (selectedCategory === 'All') return true;
    return a.category === selectedCategory;
  });

  return (
    <section className={styles.thoughtsPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/" className={styles.breadcrumb}>
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={styles.title}
          >
            Thoughts & Journal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className={styles.subtitle}
          >
            A personal notebook on editing rhythm, motion direction, visual systems, technology, and commercial filmmaking.
          </motion.p>
        </div>

        {/* Categories Filter */}
        <div className={styles.filterRow}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.filterPill} ${
                selectedCategory === cat ? styles.filterPillActive : ''
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className={styles.grid}>
          {filtered.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/thoughts/${article.slug}`} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image
                    src={article.coverUrl || '/assets/images/articles/clear-design-post.png'}
                    alt={article.title}
                    fill
                    unoptimized
                    className={styles.coverImg}
                  />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.metaRow}>
                    <span className={styles.category}>{article.category}</span>
                    <span>{article.publicationDate}</span>
                    {article.readingTime && <span>• {article.readingTime}</span>}
                  </div>

                  <h2 className={styles.cardTitle}>{article.title}</h2>
                  <p className={styles.excerpt}>{article.excerpt}</p>

                  <div className={styles.readMore}>
                    <span>Read Article</span>
                    <ArrowUpRight size={15} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
