'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CmsProject, CmsProcessStep } from '@/types/cms';
import { Plus, Edit2, Trash2, Star, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { MediaUrlField } from '@/components/admin/MediaUrlField';
import styles from '../admin.module.css';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<CmsProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<CmsProject> | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchProjects();
    };
    void loadData();
  }, [fetchProjects]);

  const handleOpenCreate = () => {
    setEditingProject({
      title: '',
      slug: '',
      category: 'Cinematic / Music Video',
      year: '2025',
      description: '',
      caseStudy: '',
      videoUrl: '/assets/videos/projects/tum-aaye-ho-preview.mp4',
      coverUrl: '/assets/images/hero/opengraph-hero.png',
      tools: ['After Effects', 'Premiere Pro'],
      featured: true,
      published: true,
      displayOrder: projects.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: CmsProject) => {
    setEditingProject({ ...p });
    setModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setMsg(`Deleted "${title}" successfully.`);
        setTimeout(() => setMsg(null), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleAddStep = () => {
    if (!editingProject) return;
    const currentSteps = editingProject.creativeProcessSteps || [];
    const newStep: CmsProcessStep = {
      id: `step-${Date.now()}`,
      title: `Stage ${currentSteps.length + 1}: `,
      description: '',
      mediaUrl: '',
      mediaType: 'image',
      caption: '',
      sortOrder: currentSteps.length + 1,
    };
    setEditingProject({
      ...editingProject,
      creativeProcessSteps: [...currentSteps, newStep],
    });
  };

  const handleUpdateStep = (index: number, updates: Partial<CmsProcessStep>) => {
    if (!editingProject) return;
    const currentSteps = [...(editingProject.creativeProcessSteps || [])];
    currentSteps[index] = { ...currentSteps[index], ...updates };
    setEditingProject({
      ...editingProject,
      creativeProcessSteps: currentSteps,
    });
  };

  const handleDeleteStep = (index: number) => {
    if (!editingProject) return;
    const currentSteps = (editingProject.creativeProcessSteps || []).filter((_, i) => i !== index);
    setEditingProject({
      ...editingProject,
      creativeProcessSteps: currentSteps,
    });
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (!editingProject) return;
    const steps = [...(editingProject.creativeProcessSteps || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const temp = steps[index];
    steps[index] = steps[targetIdx];
    steps[targetIdx] = temp;
    steps.forEach((s, idx) => {
      s.sortOrder = idx + 1;
    });
    setEditingProject({
      ...editingProject,
      creativeProcessSteps: steps,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;
    setSaving(true);

    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        await fetchProjects();
        setModalOpen(false);
        setEditingProject(null);
        setMsg('Project saved and synced with public website.');
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
          <h1 className={styles.sectionTitle}>Projects Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: '4px' }}>
            Publish, edit, and order public portfolio showcases
          </p>
        </div>

        <button type="button" onClick={handleOpenCreate} className={styles.btnPrimary}>
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {msg && <div className={styles.alertSuccess}>{msg}</div>}

      {/* Projects Table */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Title</th>
              <th>Category</th>
              <th>Year</th>
              <th>Status</th>
              <th>Featured</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.4)' }}>
                  Loading projects...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'rgba(255,255,255,0.4)' }}>
                  No projects created yet. Click &quot;New Project&quot; above.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>#{p.displayOrder}</td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>
                    {p.title}
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>
                      /{p.slug}
                    </div>
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.7)' }}>{p.category}</td>
                  <td style={{ color: 'rgba(255,255,255,0.5)' }}>{p.year}</td>
                  <td>
                    <span className={p.published ? styles.statusBadgePublished : styles.statusBadgeDraft}>
                      {p.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    {p.featured && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Star size={12} fill="#f59e0b" />
                        <span>Featured</span>
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className={styles.btnSecondary}
                        title="Edit project"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.title)}
                        className={styles.btnDanger}
                        title="Delete project"
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

      {/* Create / Edit Project Modal */}
      {modalOpen && editingProject && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingProject.id ? 'Edit Project' : 'Create New Project'}
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
              {/* Section 1: Basic Information */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 1 — Basic Information</div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Project Title *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          title: e.target.value,
                          slug:
                            editingProject.slug ||
                            e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/(^-|-$)/g, ''),
                        })
                      }
                      className={styles.formInput}
                      placeholder="e.g. Tum Aaye Ho"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.slug || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, slug: e.target.value })
                      }
                      className={styles.formInput}
                      placeholder="e.g. tum-aaye-ho"
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Category</label>
                    <input
                      type="text"
                      value={editingProject.category || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category: e.target.value })
                      }
                      className={styles.formInput}
                      placeholder="e.g. Cinematic / Music Video"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Production Year</label>
                    <input
                      type="text"
                      value={editingProject.year || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, year: e.target.value })
                      }
                      className={styles.formInput}
                      placeholder="e.g. 2025"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Narrative & Editorial */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 2 — Narrative &amp; Editorial</div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Short Card Description</label>
                  <textarea
                    rows={2}
                    value={editingProject.description || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className={styles.formTextarea}
                    placeholder="Appears on homepage featured project cards"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Case Study &amp; Creative Process</label>
                  <textarea
                    rows={4}
                    value={editingProject.caseStudy || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, caseStudy: e.target.value })
                    }
                    className={styles.formTextarea}
                    placeholder="Detailed breakdown shown on the dynamic project detail page (/projects/[slug])"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tools Used (comma separated)</label>
                  <input
                    type="text"
                    value={(editingProject.tools || []).join(', ')}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        tools: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className={styles.formInput}
                    placeholder="After Effects, Premiere Pro, DaVinci Resolve"
                  />
                </div>
              </div>

              {/* Section 3: Visual & Media Assets */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 3 — Visual &amp; Media Assets</div>
                
                <MediaUrlField
                  label="Primary Feature Video URL"
                  value={editingProject.videoUrl || ''}
                  onChange={(url) => setEditingProject({ ...editingProject, videoUrl: url })}
                  placeholder="https://...mp4, YouTube, Vimeo, or /assets/videos/..."
                  helperText="Primary video displayed on the project page and 3D showcase."
                  mediaType="video"
                  bucket="portfolio-media"
                  allowUpload={true}
                  allowImport={true}
                  projectSlug={editingProject.slug}
                />

                <MediaUrlField
                  label="Project Cover Artwork URL"
                  value={editingProject.coverUrl || ''}
                  onChange={(url) => setEditingProject({ ...editingProject, coverUrl: url })}
                  placeholder="https://... or /assets/images/..."
                  helperText="High-resolution poster displayed on homepage cards and search previews."
                  mediaType="image"
                  bucket="portfolio-posters"
                  allowUpload={true}
                  allowImport={true}
                />
              </div>

              {/* Section 4: Creative Process (Optional Case Study) */}
              <div className={styles.modalSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div className={styles.modalSectionTitle} style={{ margin: 0 }}>
                    Section 4 — Creative Process (Optional Case Study)
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={editingProject.creativeProcessEnabled ?? false}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          creativeProcessEnabled: e.target.checked,
                        })
                      }
                    />
                    <span>{editingProject.creativeProcessEnabled ? 'Enabled on Project Page' : 'Disabled (Hidden)'}</span>
                  </label>
                </div>

                {editingProject.creativeProcessEnabled && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 12 }}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Section Heading</label>
                        <input
                          type="text"
                          value={editingProject.creativeProcessHeading || ''}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              creativeProcessHeading: e.target.value,
                            })
                          }
                          className={styles.formInput}
                          placeholder="e.g. Creative Process & Directorial Method"
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Process Introduction</label>
                      <textarea
                        rows={2}
                        value={editingProject.creativeProcessIntro || ''}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            creativeProcessIntro: e.target.value,
                          })
                        }
                        className={styles.formTextarea}
                        placeholder="Short overview describing the directorial and editorial journey..."
                      />
                    </div>

                    {/* Step Cards List */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                        Process Stages ({(editingProject.creativeProcessSteps || []).length})
                      </span>
                      <button
                        type="button"
                        onClick={handleAddStep}
                        className={styles.btnPrimary}
                        style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                      >
                        <Plus size={14} /> Add Stage
                      </button>
                    </div>

                    {(editingProject.creativeProcessSteps || []).length === 0 ? (
                      <div style={{ padding: '16px', textAlign: 'center', borderRadius: 8, backgroundColor: '#0e0e12', color: 'rgba(255,255,255,0.4)', fontSize: '0.825rem' }}>
                        No process stages added yet. Click &ldquo;Add Stage&rdquo; to create steps like Concept, Editing, Motion, Color Grading, etc.
                      </div>
                    ) : (
                      (editingProject.creativeProcessSteps || []).map((step, sIdx) => (
                        <div
                          key={step.id || `step-${sIdx}`}
                          style={{
                            padding: 16,
                            borderRadius: 10,
                            backgroundColor: '#0c0c10',
                            border: '1px solid rgba(255,255,255,0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#60a5fa' }}>
                              Stage {String(sIdx + 1).padStart(2, '0')}
                            </span>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => handleMoveStep(sIdx, 'up')}
                                disabled={sIdx === 0}
                                title="Move Stage Up"
                                style={{ background: 'none', border: 'none', color: sIdx === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: sIdx === 0 ? 'default' : 'pointer' }}
                              >
                                <ArrowUp size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveStep(sIdx, 'down')}
                                disabled={sIdx === (editingProject.creativeProcessSteps || []).length - 1}
                                title="Move Stage Down"
                                style={{ background: 'none', border: 'none', color: sIdx === (editingProject.creativeProcessSteps || []).length - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)', cursor: sIdx === (editingProject.creativeProcessSteps || []).length - 1 ? 'default' : 'pointer' }}
                              >
                                <ArrowDown size={15} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStep(sIdx)}
                                title="Delete Stage"
                                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', marginLeft: 8 }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Stage Title</label>
                            <input
                              type="text"
                              value={step.title || ''}
                              onChange={(e) => handleUpdateStep(sIdx, { title: e.target.value })}
                              className={styles.formInput}
                              placeholder="e.g. Concept & Directorial Vision"
                            />
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Stage Description</label>
                            <textarea
                              rows={2}
                              value={step.description || ''}
                              onChange={(e) => handleUpdateStep(sIdx, { description: e.target.value })}
                              className={styles.formTextarea}
                              placeholder="Describe the editorial process, problem solving, or creative execution..."
                            />
                          </div>

                          <MediaUrlField
                            label="Stage Media Asset (Image or Video)"
                            value={step.mediaUrl || ''}
                            onChange={(url) => handleUpdateStep(sIdx, { mediaUrl: url })}
                            placeholder="https://... image/video, YouTube, Vimeo, or /assets/..."
                            helperText="Optional media demonstration for this process stage."
                            mediaType="any"
                            bucket="portfolio-media"
                            allowUpload={true}
                            allowImport={true}
                          />

                          <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Media Caption (Optional)</label>
                            <input
                              type="text"
                              value={step.caption || ''}
                              onChange={(e) => handleUpdateStep(sIdx, { caption: e.target.value })}
                              className={styles.formInput}
                              placeholder="e.g. Rough timeline assembly in Premiere Pro before color match."
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Section 5: Visibility & Status */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionTitle}>Section 5 — Visibility &amp; Ordering</div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Display Order</label>
                    <input
                      type="number"
                      value={editingProject.displayOrder ?? 0}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          displayOrder: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className={styles.formInput}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#fff' }}>
                      <input
                        type="checkbox"
                        checked={editingProject.published ?? true}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, published: e.target.checked })
                        }
                      />
                      <span>Published (Visible publicly)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', color: '#fff' }}>
                      <input
                        type="checkbox"
                        checked={editingProject.featured ?? true}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, featured: e.target.checked })
                        }
                      />
                      <span>Featured on Home Page</span>
                    </label>
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
                  <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
