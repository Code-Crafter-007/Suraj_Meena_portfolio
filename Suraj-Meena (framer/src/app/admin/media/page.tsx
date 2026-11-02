'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CmsMedia, CmsProject } from '@/types/cms';
import {
  Upload,
  Plus,
  Trash2,
  Copy,
  Check,
  Video,
  FileImage,
  Edit3,
  X,
  Search,
} from 'lucide-react';
import { MediaUrlField } from '@/components/admin/MediaUrlField';
import styles from '../admin.module.css';

export default function AdminMediaPage() {
  const [media, setMedia] = useState<CmsMedia[]>([]);
  const [projects, setProjects] = useState<CmsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Partial<CmsMedia> | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
      }
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchMedia(), fetchProjects()]);
    };
    void load();
  }, [fetchMedia, fetchProjects]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', file.name);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMsg(`Uploaded "${file.name}" successfully.`);
        await fetchMedia();
        setTimeout(() => setMsg(null), 3000);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOpenCreateUrl = () => {
    setEditingItem({
      fileName: 'New Media Link',
      fileUrl: '',
      mediaType: 'video',
      title: '',
      caption: '',
      projectSlug: '',
      posterUrl: '',
      aspectRatio: 'vertical',
      displayOrder: (media.length + 1) * 10,
      published: true,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.fileUrl) {
      alert('Please provide a file/stream URL');
      return;
    }

    setSavingEdit(true);
    try {
      const isCreate = !editingItem.id;
      const endpoint = '/api/admin/media';
      const method = isCreate ? 'POST' : 'PATCH';

      const payload = {
        ...editingItem,
        fileName: editingItem.fileName || editingItem.title || 'Media Item',
      };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMsg(isCreate ? 'Media added successfully.' : 'Updated media metadata.');
        setEditingItem(null);
        await fetchMedia();
        setTimeout(() => setMsg(null), 3000);
      } else {
        alert('Failed to save media');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Update failed');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete media item "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedia((prev) => prev.filter((m) => m.id !== id));
        setMsg(`Deleted "${name}".`);
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Filtering
  const filtered = media.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.caption || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.fileName || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesProject =
      filterProject === 'all' ? true : item.projectSlug === filterProject;

    const matchesType =
      filterType === 'all' ? true : item.mediaType === filterType;

    return matchesSearch && matchesProject && matchesType;
  });

  return (
    <div>
      <div className={styles.actionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>Video & Media Gallery CMS</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: '4px' }}>
            Manage public project video galleries, aspect ratios, titles, and poster thumbnails.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={handleOpenCreateUrl}
            className={styles.btnSecondary}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} />
            <span>Add External Video / URL</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept="video/*,image/*"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className={styles.btnPrimary}
          >
            <Upload size={16} />
            <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
          </button>
        </div>
      </div>

      {msg && <div className={styles.alertSuccess}>{msg}</div>}

      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          marginBottom: 24,
          alignItems: 'center',
          backgroundColor: '#17171c',
          padding: '12px 16px',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.4)',
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, caption, or file..."
            style={{
              width: '100%',
              backgroundColor: '#121215',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              padding: '8px 12px 8px 34px',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className={styles.select}
          style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
        >
          <option value="all">All Projects</option>
          <option value="tum-aaye-ho">Tum Aaye Ho</option>
          <option value="mm-cafe">M & M Restro and Cafe</option>
          <option value="mazuri">Mazuri</option>
          <option value="nav-nirmaan">Nav Nirmaan</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'all' | 'video' | 'image')}
          className={styles.select}
          style={{ width: 'auto', padding: '8px 12px', fontSize: '0.85rem' }}
        >
          <option value="all">All Types</option>
          <option value="video">Videos Only</option>
          <option value="image">Images Only</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)' }}>
          Loading media library...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.4)' }}>
          No media matches your filter criteria.
        </div>
      ) : (
        <div className={styles.mediaGrid}>
          {filtered.map((item) => (
            <div key={item.id} className={styles.mediaCard}>
              {/* Media Preview Box */}
              {item.mediaType === 'video' ? (
                <div style={{ position: 'relative', width: '100%', height: 180, backgroundColor: '#000' }}>
                  <video
                    src={item.fileUrl}
                    poster={item.posterUrl}
                    controls
                    className={styles.mediaPreview}
                    preload="metadata"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', height: 180, backgroundColor: '#111' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.fileUrl}
                    alt={item.title || item.caption || item.fileName}
                    className={styles.mediaPreview}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '0.3';
                    }}
                  />
                </div>
              )}

              <div className={styles.mediaMeta}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.mediaType === 'video' ? (
                      <Video size={14} color="#eb4d6d" />
                    ) : (
                      <FileImage size={14} color="#10b981" />
                    )}
                    <span className={styles.mediaCaption} title={item.title || item.fileName}>
                      {item.title || item.fileName}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: 4,
                      backgroundColor: item.published !== false ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      color: item.published !== false ? '#10b981' : '#ef4444',
                      fontWeight: 600,
                    }}
                  >
                    {item.published !== false ? 'Published' : 'Draft'}
                  </span>
                </div>

                {item.caption && (
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
                    {item.caption}
                  </p>
                )}

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6, fontSize: '0.75rem' }}>
                  {item.projectSlug && (
                    <span style={{ color: '#38bdf8', backgroundColor: 'rgba(56,189,248,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                      📁 {item.projectSlug}
                    </span>
                  )}
                  {item.aspectRatio && (
                    <span style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>
                      Ratio: {item.aspectRatio}
                    </span>
                  )}
                </div>

                <div className={styles.mediaActions} style={{ marginTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => setEditingItem(item)}
                    className={styles.btnSecondary}
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                    title="Edit Metadata & Project"
                  >
                    <Edit3 size={12} />
                    <span style={{ marginLeft: '4px' }}>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.fileUrl)}
                    className={styles.btnSecondary}
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span style={{ marginLeft: '4px' }}>
                      {copiedId === item.id ? 'Copied' : 'URL'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.fileName)}
                    className={styles.btnDanger}
                    style={{ padding: '4px 8px' }}
                    title="Delete media"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Metadata Modal */}
      {editingItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingItem.id ? 'Edit Video & Gallery Item' : 'Add External Video / Gallery Media'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className={styles.btnSecondary}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              {/* Section 1: Media Source */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 1 — Media Source</div>

                <div className={styles.fieldGroup} style={{ marginBottom: 14 }}>
                  <label className={styles.label}>Associated Project *</label>
                  <select
                    value={editingItem.projectSlug || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, projectSlug: e.target.value })}
                    className={styles.select}
                  >
                    <option value="">-- General Asset (No Project) --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.title} ({p.slug})
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 4, display: 'block' }}>
                    Videos assigned to a project will automatically appear in that project&apos;s 3D carousel showcase.
                  </span>
                </div>

                <MediaUrlField
                  label="Video / Media URL *"
                  value={editingItem.fileUrl || ''}
                  onChange={(url) => setEditingItem({ ...editingItem, fileUrl: url })}
                  placeholder="https://youtube.com/..., https://...mp4, or /assets/videos/..."
                  helperText="Supports direct MP4/WebM, YouTube (watch, share & shorts), Vimeo, and Supabase Storage."
                  mediaType="video"
                  bucket="portfolio-media"
                  allowUpload={true}
                  allowImport={true}
                  projectSlug={editingItem.projectSlug}
                />
              </div>

              {/* Section 2: Media Information */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 2 — Media Information</div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Video Title / Name *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="e.g. Behind the Scenes Cut / Director's Reel"
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Caption / Description</label>
                  <textarea
                    rows={2}
                    value={editingItem.caption || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                    placeholder="Editorial caption displayed under video"
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Aspect Ratio</label>
                    <select
                      value={editingItem.aspectRatio || 'vertical'}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          aspectRatio: e.target.value as 'vertical' | 'horizontal' | 'square',
                        })
                      }
                      className={styles.select}
                    >
                      <option value="vertical">Vertical (9:16 Reel)</option>
                      <option value="horizontal">Horizontal (16:9 Cinema)</option>
                      <option value="square">Square (1:1)</option>
                    </select>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Display Order</label>
                    <input
                      type="number"
                      value={editingItem.displayOrder ?? 0}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, displayOrder: parseInt(e.target.value) || 0 })
                      }
                      className={styles.input}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Poster & Thumbnail */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 3 — Video Poster / Thumbnail</div>
                <MediaUrlField
                  label="Poster Image URL (Optional)"
                  value={editingItem.posterUrl || ''}
                  onChange={(url) => setEditingItem({ ...editingItem, posterUrl: url })}
                  placeholder="https://... or /assets/images/..."
                  helperText="Displayed as the video cover before playback starts."
                  mediaType="image"
                  bucket="portfolio-posters"
                  allowUpload={true}
                  allowImport={true}
                />
              </div>

              {/* Section 4: Visibility */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 4 — Visibility &amp; Publishing</div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: '#fff', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={editingItem.published !== false}
                    onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <span>Visible in Public 3D Carousel &amp; Gallery</span>
                </label>
              </div>

              {/* Sticky Action Footer */}
              <div className={styles.modalStickyFooter}>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className={styles.btnSecondary}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className={styles.btnPrimary}
                >
                  {savingEdit ? 'Saving...' : 'Save Gallery Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
