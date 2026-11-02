'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CmsTestimonial } from '@/types/cms';
import { Plus, Edit2, Trash2, Check } from 'lucide-react';
import { ImageUrlField } from '@/components/admin/ImageUrlField';
import styles from '../admin.module.css';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<CmsTestimonial> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchTestimonials();
    };
    void load();
  }, [fetchTestimonials]);

  const handleOpenCreate = () => {
    setEditingItem({
      authorName: '',
      authorRole: '',
      quote: '',
      avatarUrl: '/assets/images/testimonials/yakoub-kashmiri.jpg',
      companyLogo: '/assets/images/testimonials/client-logo-1.png',
      displayOrder: testimonials.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: CmsTestimonial) => {
    setEditingItem({ ...t });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        setMsg(`Deleted testimonial from "${name}".`);
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.authorName || !editingItem?.quote) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        await fetchTestimonials();
        setModalOpen(false);
        setEditingItem(null);
        setMsg('Testimonial saved and synced with public website.');
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
          <h1 className={styles.sectionTitle}>Client Testimonials</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage client endorsements, client logos, and verified feedback
          </p>
        </div>

        <button type="button" onClick={handleOpenCreate} className={styles.btnPrimary}>
          <Plus size={16} />
          <span>New Testimonial</span>
        </button>
      </div>

      {msg && <div className={styles.alertSuccess}>{msg}</div>}

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Role</th>
              <th>Quote</th>
              <th>Logo</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.4)' }}>
                  Loading testimonials...
                </td>
              </tr>
            ) : testimonials.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.4)' }}>
                  No testimonials yet.
                </td>
              </tr>
            ) : (
              testimonials.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {t.avatarUrl && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={t.avatarUrl}
                          alt={t.authorName}
                          width={32}
                          height={32}
                          style={{ borderRadius: '50%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                      <span style={{ fontWeight: 600, color: '#ffffff' }}>{t.authorName}</span>
                    </div>
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.7)' }}>{t.authorRole}</td>
                  <td
                    style={{
                      maxWidth: '300px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: 'rgba(255,255,255,0.8)',
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </td>
                  <td>
                    {t.companyLogo ? (
                      <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Attached</span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>None</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(t)}
                        className={styles.btnSecondary}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id, t.authorName)}
                        className={styles.btnDanger}
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

      {modalOpen && editingItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingItem.id ? 'Edit Testimonial' : 'Add Testimonial'}
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
              {/* Section 1: Client Information */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 1 — Client Information</div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Client Name *</label>
                    <input
                      type="text"
                      required
                      value={editingItem.authorName || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, authorName: e.target.value })
                      }
                      className={styles.formInput}
                      placeholder="e.g. Daniel K."
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Role / Company</label>
                    <input
                      type="text"
                      value={editingItem.authorRole || ''}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, authorRole: e.target.value })
                      }
                      className={styles.formInput}
                      placeholder="e.g. Indie Maker / Founder"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Testimonial */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 2 — Testimonial Quote</div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Client Quote *</label>
                  <textarea
                    rows={4}
                    required
                    value={editingItem.quote || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, quote: e.target.value })
                    }
                    className={styles.formTextarea}
                    placeholder="The authentic testimonial text..."
                  />
                  <div style={{ textAlign: 'right', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                    {(editingItem.quote || '').length} characters
                  </div>
                </div>
              </div>

              {/* Section 3: Client Media */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 3 — Client Media &amp; Logos</div>
                <div className={styles.formRow}>
                  <div style={{ flex: 1 }}>
                    <ImageUrlField
                      label="Client Avatar URL"
                      value={editingItem.avatarUrl || ''}
                      onChange={(url) => setEditingItem({ ...editingItem, avatarUrl: url })}
                      placeholder="https://... or /assets/images/testimonials/avatar.jpg"
                      helperText="Square portrait photo. Supports pasting, direct upload &amp; Supabase import."
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <ImageUrlField
                      label="Client Company Logo URL"
                      value={editingItem.companyLogo || ''}
                      onChange={(url) => setEditingItem({ ...editingItem, companyLogo: url })}
                      placeholder="https://... or /assets/images/testimonials/logo.png"
                      helperText="Brand monogram or logo PNG/SVG. Transparent backdrop recommended."
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
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
                  <span>{saving ? 'Saving...' : 'Save Testimonial'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
