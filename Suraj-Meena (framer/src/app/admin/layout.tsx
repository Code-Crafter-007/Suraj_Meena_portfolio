'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  FileText,
  MessageSquareQuote,
  Images,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render children directly without the admin sidebar shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: Film },
    { label: 'Media Gallery', href: '/admin/media', icon: Images },
    { label: 'Thoughts & Blog', href: '/admin/thoughts', icon: FileText },
    { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Inquiries', href: '/admin/contact', icon: Mail },
    { label: 'Supabase Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brandHeader}>
          <div className={styles.brandTitle}>
            <span>Suraj Meena</span>
            <span className={styles.badge}>CMS</span>
          </div>
        </div>

        <nav className={styles.navSection}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" target="_blank" className={styles.publicLink}>
            <ExternalLink size={16} />
            <span>View Public Website</span>
          </Link>

          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.pageHeader}>Portfolio Studio CMS</div>
          <div className={styles.adminUserBadge}>
            <span className={styles.statusDot} />
            <span>surajmeenam946@gmail.com</span>
          </div>
        </header>

        <main className={styles.contentWrapper}>{children}</main>
      </div>
    </div>
  );
}

