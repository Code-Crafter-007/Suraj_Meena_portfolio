'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Database, Copy, Check, Server, Key, Image as ImageIcon, Save } from 'lucide-react';
import { ImageUrlField } from '@/components/admin/ImageUrlField';
import { CmsSiteSettings } from '@/types/cms';
import styles from '../admin.module.css';

export default function AdminSettingsPage() {
  const [copied, setCopied] = useState(false);
  const [settings, setSettings] = useState<CmsSiteSettings>({
    heroPortraitUrl: '/assets/images/about/creator-portrait-front.png',
    bioPortraitUrl: '/assets/images/about/creator-portrait-front.png',
    creatorName: 'Suraj Meena',
    creatorTagline: 'Visual Editor & Motion Designer',
    location: 'Gandhinagar, India',
    contactEmail: 'surajmeenam946@gmail.com',
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchSettings();
    };
    void load();
  }, [fetchSettings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMsg(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSettingsMsg('Site images and global settings saved successfully.');
        setTimeout(() => setSettingsMsg(null), 3500);
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error('Settings save error:', err);
      alert('Save failed');
    } finally {
      setSavingSettings(false);
    }
  };

  const sampleEnv = `# ==============================================================================
# SURAJ MEENA PORTFOLIO & CMS — ENVIRONMENT VARIABLES
# ==============================================================================

# Admin Authentication
ADMIN_EMAIL="surajmeenam946@gmail.com"
ADMIN_PASSWORD="suraj_secure_admin_2025"
ADMIN_SECRET_KEY="suraj_portfolio_cms_secret_jwt_hmac_signing_key_32chars"

# Supabase Database & Cloud Storage
# Leave blank or unconfigured to automatically use atomic local JSON fallback store:
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
`;

  const copyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className={styles.actionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>System Settings & Global Site Images</h1>
          <p className={styles.statSubtext} style={{ marginTop: 4 }}>
            Manage site-wide portraits, external image URLs, and database connectivity.
          </p>
        </div>
      </div>

      {/* Global Image Management Section */}
      <div
        style={{
          backgroundColor: '#17171c',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 28,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <ImageIcon size={20} style={{ color: '#eb4d6d' }} />
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.15rem' }}>
            Homepage & Bio 3D Portrait URLs
          </h3>
        </div>
        <p style={{ margin: '0 0 20px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Control the exact images used in the 3D rotating card. Paste any external image link (e.g. ImgHippo, Imgur, Unsplash, Supabase) or local asset path.
        </p>

        {settingsMsg && (
          <div
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              fontSize: '0.875rem',
              marginBottom: 18,
            }}
          >
            {settingsMsg}
          </div>
        )}

        <form onSubmit={handleSaveSettings}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            <ImageUrlField
              label="Hero Grayscale Front Portrait URL"
              value={settings.heroPortraitUrl}
              onChange={(url) => setSettings({ ...settings, heroPortraitUrl: url })}
              placeholder="https://... or /assets/images/about/creator-portrait-front.png"
              helperText="Rendered on the front face in the Hero section (automatically styled in grayscale)."
            />

            <ImageUrlField
              label="Bio Full-Colour Back Portrait URL"
              value={settings.bioPortraitUrl}
              onChange={(url) => setSettings({ ...settings, bioPortraitUrl: url })}
              placeholder="https://... or /assets/images/about/creator-portrait-front.png"
              helperText="Rendered on the back face in the Bio section after the 180° flip."
            />
          </div>

          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={savingSettings}
              className={styles.btnPrimary}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Save size={16} />
              <span>{savingSettings ? 'Saving...' : 'Save Site Portraits'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Dual Storage Architecture Notice */}
      <div
        style={{
          backgroundColor: '#17171c',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Server size={22} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px', color: '#fff', fontSize: '1.1rem' }}>
              Dual-Engine CMS Architecture Active
            </h3>
            <p style={{ margin: '0 0 12px', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              The CMS operates with zero external hard-dependencies. If Supabase credentials are provided in your{' '}
              <code style={{ background: '#222', padding: '2px 6px', borderRadius: 4, color: '#eb4d6d' }}>
                .env.local
              </code>{' '}
              file, all operations persist to your Supabase PostgreSQL cluster and S3 Storage bucket.
              When unconfigured or during local offline development, the system seamlessly uses the local atomic file store{' '}
              <code style={{ background: '#222', padding: '2px 6px', borderRadius: 4, color: '#10b981' }}>
                src/data/cms-store.json
              </code>
              .
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span className={styles.statusBadgePublished}>
                ● Local JSON Store Ready & Seeded
              </span>
              <span className={styles.statusBadgeDraft}>
                ○ Supabase Cloud Optional
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Variables */}
      <div
        style={{
          backgroundColor: '#17171c',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Key size={18} style={{ color: '#eb4d6d' }} />
            <h3 style={{ margin: 0, color: '#fff', fontSize: '1.05rem' }}>
              Environment Variables Template
            </h3>
          </div>
          <button
            type="button"
            onClick={copyEnv}
            className={styles.btnSecondary}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Template'}</span>
          </button>
        </div>

        <pre
          style={{
            backgroundColor: '#0e0e11',
            padding: 18,
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.05)',
            color: '#a1a1aa',
            fontSize: '0.85rem',
            overflowX: 'auto',
            fontFamily: 'monospace',
            lineHeight: 1.6,
          }}
        >
          {sampleEnv}
        </pre>
      </div>

      {/* SQL Migration Script */}
      <div
        style={{
          backgroundColor: '#17171c',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Database size={18} style={{ color: '#38bdf8' }} />
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.05rem' }}>
            Supabase SQL Schema
          </h3>
        </div>
        <p style={{ margin: '0 0 16px', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
          When you link a live Supabase project, execute the included{' '}
          <strong style={{ color: '#fff' }}>supabase-schema.sql</strong> file in the Supabase SQL Editor.
          This will set up all tables (`projects`, `articles`, `testimonials`, `media_gallery`, `contact_messages`), Row Level Security policies, and create the `portfolio-media` storage bucket.
        </p>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            File path: <code style={{ color: '#38bdf8' }}>supabase-schema.sql</code> (in project root)
          </div>
        </div>
      </div>
    </div>
  );
}
