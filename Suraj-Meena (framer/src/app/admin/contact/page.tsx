'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, CheckCircle2, Trash2, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { CmsContactMessage } from '@/types/cms';
import styles from '../admin.module.css';

export default function AdminContactPage() {
  const [messages, setMessages] = useState<CmsContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load contact messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchMessages();
    };
    void load();
  }, [fetchMessages]);

  const handleToggleStatus = async (msg: CmsContactMessage) => {
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    setUpdatingId(msg.id);
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, status: nextStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: nextStatus } : m))
        );
      }
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const res = await fetch(`/api/admin/contact?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error('Delete message error:', err);
    }
  };

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return m.status === 'unread';
    if (filter === 'read') return m.status === 'read';
    return true;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div>
      <div className={styles.actionHeader}>
        <div>
          <h1 className={styles.sectionTitle}>Client Inquiries</h1>
          <p className={styles.statSubtext} style={{ marginTop: 4 }}>
            Inquiries received from the public portfolio contact form.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchMessages}
          className={styles.btnSecondary}
          disabled={loading}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? styles.btnPrimary : styles.btnSecondary}
        >
          All ({messages.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={filter === 'unread' ? styles.btnPrimary : styles.btnSecondary}
        >
          Unread ({unreadCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('read')}
          className={filter === 'read' ? styles.btnPrimary : styles.btnSecondary}
        >
          Archived ({messages.length - unreadCount})
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
          Loading inquiries...
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.tableCard} style={{ padding: 48, textAlign: 'center' }}>
          <Mail size={36} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 6px', color: '#fff' }}>No inquiries found</h3>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            {filter === 'unread'
              ? 'All client inquiries have been marked as read.'
              : 'Messages submitted through your portfolio contact form will appear here.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((msg) => {
            const isUnread = msg.status === 'unread';
            return (
              <div
                key={msg.id}
                style={{
                  backgroundColor: '#17171c',
                  border: isUnread
                    ? '1px solid rgba(235, 77, 109, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 12,
                  padding: 24,
                  boxShadow: isUnread ? '0 0 20px rgba(235, 77, 109, 0.08)' : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: isUnread ? 'rgba(235, 77, 109, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        color: isUnread ? '#eb4d6d' : '#888',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                      }}
                    >
                      {msg.name ? msg.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: '1.05rem' }}>
                        {msg.name}
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textDecoration: 'none' }}
                      >
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontWeight: 600,
                        backgroundColor: isUnread
                          ? 'rgba(235, 77, 109, 0.15)'
                          : 'rgba(255, 255, 255, 0.06)',
                        color: isUnread ? '#eb4d6d' : 'rgba(255,255,255,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      {isUnread ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
                      {isUnread ? 'Unread Inquiry' : 'Read'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: '#121215',
                    padding: 16,
                    borderRadius: 8,
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '0.925rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    marginBottom: 16,
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  {msg.projectDetails}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                  <a
                    href={`mailto:${msg.email}?subject=Re:%20Project%20Inquiry%20from%20Suraj%20Meena%20Portfolio&body=Hi%20${encodeURIComponent(
                      msg.name
                    )},%0A%0AThank you for reaching out regarding your project!%0A%0A`}
                    className={styles.btnSecondary}
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    <Send size={14} />
                    <span>Reply via Email</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(msg)}
                    className={styles.btnSecondary}
                    disabled={updatingId === msg.id}
                  >
                    {isUnread ? 'Mark as Read' : 'Mark as Unread'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(msg.id)}
                    className={styles.btnDanger}
                    title="Delete message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
