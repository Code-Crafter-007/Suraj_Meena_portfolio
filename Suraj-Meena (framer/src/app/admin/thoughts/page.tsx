'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CmsArticle } from '@/types/cms';
import { Plus, Edit2, Trash2, Check } from 'lucide-react';
import { ImageUrlField } from '@/components/admin/ImageUrlField';
import styles from '../admin.module.css';

export default function AdminThoughtsPage() {
  const [articles, setArticles] = useState<CmsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<CmsArticle> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/thoughts');
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchArticles();
    };
    void load();
  }, [fetchArticles]);

  const handleOpenCreate = () => {
    setEditingArticle({
      title: '',
      slug: '',
      category: 'Design Systems',
      publicationDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      excerpt: '',
      content: '',
      coverUrl: '/assets/images/articles/clear-design-post.png',
      published: true,
      displayOrder: articles.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (a: CmsArticle) => {
    setEditingArticle({ ...a });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/thoughts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setMsg(`Deleted "${title}" successfully.`);
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle?.title) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle),
      });

      if (res.ok) {
        await fetchArticles();
        setModalOpen(false);
        setEditingArticle(null);
        setMsg('Article saved and updated on public Thoughts journal.');
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className={styles.actionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>Thoughts & Blog Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: '4px' }}>
            Publish essays, articles, and craft insights
          </p>
        </div>

        <button type="button" onClick={handleOpenCreate} className={styles.btnPrimary}>
          <Plus size={16} />
          <span>New Article</span>
        </button>
      </div>

      {msg && <div className={styles.alertSuccess}>{msg}</div>}

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Article Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.4)' }}>
                  Loading articles...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.4)' }}>
                  No articles yet.
                </td>
              </tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>#{a.displayOrder}</td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>
                    {a.title}
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
                      /{a.slug}
                    </div>
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.7)' }}>{a.category}</td>
                  <td style={{ color: 'rgba(255,255,255,0.5)' }}>{a.publicationDate}</td>
                  <td>
                    <span className={a.published ? styles.statusBadgePublished : styles.statusBadgeDraft}>
                      {a.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(a)}
                        className={styles.btnSecondary}
                        title="Edit article"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id, a.title)}
                        className={styles.btnDanger}
                        title="Delete article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && editingArticle && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingArticle.id ? 'Edit Article' : 'Write New Article'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className={styles.closeBtn}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Title *</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title || ''}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        title: e.target.value,
                        slug:
                          editingArticle.slug ||
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, ''),
                      })
                    }
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.slug || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, slug: e.target.value })
                    }
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <input
                    type="text"
                    value={editingArticle.category || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, category: e.target.value })
                    }
                    placeholder="e.g. Design Systems / Art Direction"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Publication Date Label</label>
                  <input
                    type="text"
                    value={editingArticle.publicationDate || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, publicationDate: e.target.value })
                    }
                    placeholder="e.g. May 5, 2025"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Reading Time</label>
                  <input
                    type="text"
                    value={editingArticle.readingTime || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, readingTime: e.target.value })
                    }
                    placeholder="e.g. 4 min read"
                    className={styles.formInput}
                  />
                </div>
              </div>

              <ImageUrlField
                label="Article Header / Cover Image URL"
                value={editingArticle.coverUrl || ''}
                onChange={(url) => setEditingArticle({ ...editingArticle, coverUrl: url })}
                placeholder="https://... or /assets/images/articles/..."
                helperText="Banner image shown on /thoughts and the article detail page"
              />

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Excerpt / Subtitle</label>
                <textarea
                  rows={2}
                  value={editingArticle.excerpt || ''}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, excerpt: e.target.value })
                  }
                  className={styles.formTextarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Article Body (Markdown / Text)</label>
                <textarea
                  rows={6}
                  value={editingArticle.content || ''}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, content: e.target.value })
                  }
                  className={styles.formTextarea}
                />
              </div>

              <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input
                    type="checkbox"
                    checked={editingArticle.published ?? true}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, published: e.target.checked })
                    }
                  />
                  <span>Published publicly</span>
                </label>
              </div>

              <div className={styles.modalStickyFooter}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={styles.btnPrimary}
                >
                  <Check size={16} />
                  <span>{saving ? 'Saving...' : 'Save Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
