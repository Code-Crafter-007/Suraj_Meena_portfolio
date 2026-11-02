import React from 'react';
import Link from 'next/link';
import { getCmsStats, getContactMessages, getProjects } from '@/lib/cms';
import {
  Film,
  FileText,
  Images,
  Mail,
  PlusCircle,
  Database,
  ArrowRight,
} from 'lucide-react';
import styles from './admin.module.css';

export default async function AdminDashboardPage() {
  const stats = await getCmsStats();
  const recentMessages = (await getContactMessages()).slice(0, 5);
  const recentProjects = (await getProjects(false)).slice(0, 4);

  return (
    <div>
      <div className={styles.actionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>Dashboard Overview</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: '4px' }}>
            Live content metrics & quick publishing controls
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/admin/projects" className={styles.btnPrimary}>
            <PlusCircle size={16} />
            <span>Manage Projects</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Projects</span>
            <Film size={20} color="#FAF7F3" opacity={0.6} />
          </div>
          <div className={styles.statValue}>{stats.totalProjects}</div>
          <span className={styles.statSubtext}>{stats.publishedProjects} active & published</span>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Thoughts & Blog</span>
            <FileText size={20} color="#FAF7F3" opacity={0.6} />
          </div>
          <div className={styles.statValue}>{stats.totalArticles}</div>
          <span className={styles.statSubtext}>{stats.publishedArticles} published essays</span>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Media Assets</span>
            <Images size={20} color="#FAF7F3" opacity={0.6} />
          </div>
          <div className={styles.statValue}>{stats.totalMedia}</div>
          <span className={styles.statSubtext}>Videos & photo previews</span>
        </div>

        <div className={styles.statCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.statLabel}>Inquiries</span>
            <Mail size={20} color="#FAF7F3" opacity={0.6} />
          </div>
          <div className={styles.statValue}>{stats.unreadMessages}</div>
          <span className={styles.statSubtext}>Unread client messages ({stats.totalMessages} total)</span>
        </div>
      </div>

      {/* Database Mode Card */}
      <div
        style={{
          backgroundColor: '#17171c',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Database size={24} color={stats.supabaseConnected ? '#10b981' : '#f59e0b'} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff' }}>
              Storage Engine: {stats.supabaseConnected ? 'Supabase Live Database' : 'Local Dynamic JSON Store'}
            </div>
            <div style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
              {stats.supabaseConnected
                ? 'Connected to your remote Supabase instance with Row Level Security.'
                : 'Operating in self-contained local storage mode. Add Supabase keys to .env.local to activate cloud sync.'}
            </div>
          </div>
        </div>

        <Link href="/admin/settings" className={styles.btnSecondary}>
          <span>Configure Engine</span>
          <ArrowRight size={14} style={{ display: 'inline', marginLeft: '6px' }} />
        </Link>
      </div>

      {/* Two Column Layout: Recent Projects & Inquiries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Recent Projects */}
        <div className={styles.tableCard}>
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>Featured Projects</h3>
            <Link href="/admin/projects" style={{ fontSize: '0.8rem', color: '#FAF7F3', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td style={{ color: 'rgba(255,255,255,0.6)' }}>{p.category}</td>
                  <td>
                    <span className={p.published ? styles.statusBadgePublished : styles.statusBadgeDraft}>
                      {p.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Inquiries */}
        <div className={styles.tableCard}>
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: 600 }}>Recent Inquiries</h3>
            <Link href="/admin/contact" style={{ fontSize: '0.8rem', color: '#FAF7F3', textDecoration: 'none' }}>
              Inbox ({stats.totalMessages}) →
            </Link>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sender</th>
                <th>Message</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentMessages.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '24px' }}>
                    No messages yet
                  </td>
                </tr>
              ) : (
                recentMessages.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{m.email}</div>
                    </td>
                    <td
                      style={{
                        maxWidth: '200px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {m.projectDetails}
                    </td>
                    <td>
                      <span className={m.status === 'unread' ? styles.badge : styles.btnSecondary}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
