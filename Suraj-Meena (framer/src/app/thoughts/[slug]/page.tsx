import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getArticleBySlug, getArticles } from '@/lib/cms';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './thoughtDetail.module.css';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getArticles(false);
  return articles.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Suraj Meena',
    };
  }

  return {
    title: `${article.title} | Thoughts | Suraj Meena`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverUrl ? [{ url: article.coverUrl }] : [],
    },
  };
}

export default async function ThoughtDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getArticles(false);
  const currentIndex = allArticles.findIndex((a) => a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : null;

  // Split content by double linebreaks for clean paragraph rendering
  const paragraphs = (article.content || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Navbar />

      <main className={styles.pageWrapper}>
        <article className={styles.container}>
          <Link href="/thoughts" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>All Thoughts &amp; Journal</span>
          </Link>

          <header className={styles.header}>
            <div className={styles.metaRow}>
              <span className={styles.category}>{article.category}</span>
              <span>{article.publicationDate}</span>
              {article.readingTime && <span>• {article.readingTime}</span>}
            </div>

            <h1 className={styles.title}>{article.title}</h1>

            {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
          </header>

          {article.coverUrl && (
            <div className={styles.coverWrap}>
              <Image
                src={article.coverUrl}
                alt={article.title}
                fill
                priority
                unoptimized
                className={styles.coverImg}
              />
            </div>
          )}

          <div className={styles.articleBody}>
            {paragraphs.length > 0 ? (
              paragraphs.map((para, i) => {
                if (para.startsWith('## ')) {
                  return <h2 key={i}>{para.replace(/^##\s+/, '')}</h2>;
                }
                if (para.startsWith('> ')) {
                  return <blockquote key={i}>{para.replace(/^>\s+/, '')}</blockquote>;
                }
                return <p key={i}>{para}</p>;
              })
            ) : (
              <p>{article.excerpt}</p>
            )}
          </div>

          <nav className={styles.navFooter} aria-label="Article navigation">
            {prevArticle ? (
              <Link href={`/thoughts/${prevArticle.slug}`} className={styles.navCard}>
                <span className={styles.navLabel}>
                  <ArrowLeft size={12} style={{ display: 'inline', marginRight: 4 }} />
                  Previous Article
                </span>
                <span className={styles.navTitle}>{prevArticle.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {nextArticle ? (
              <Link
                href={`/thoughts/${nextArticle.slug}`}
                className={styles.navCard}
                style={{ textAlign: 'right' }}
              >
                <span className={styles.navLabel}>
                  Next Article
                  <ArrowRight size={12} style={{ display: 'inline', marginLeft: 4 }} />
                </span>
                <span className={styles.navTitle}>{nextArticle.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </article>
      </main>

      <Footer />
    </>
  );
}

