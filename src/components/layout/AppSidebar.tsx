"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavSection {
  label: string;
  href?: string;
  items?: NavLink[];
}

const sections: NavSection[] = [
  { label: '仪表盘', href: '/' },
  {
    label: '水量分析',
    items: [
      { label: '当前月', href: '/analysis/monthly' },
      { label: '时间段', href: '/analysis/range' }
    ]
  },
  {
    label: '数据管理',
    items: [
      { label: '类别管理', href: '/data/categories' },
      { label: '子项管理', href: '/data/items' },
      { label: '明细管理', href: '/data/measurements' }
    ]
  },
  { label: '漏损率修正', href: '/correction' },
  { label: '导入任务', href: '/imports' },
  { label: '审计日志', href: '/audits' },
  {
    label: '系统配置',
    items: [
      { label: '公式参数', href: '/settings/formulas' },
      { label: '标准阈值', href: '/settings/standards' },
      { label: '字典维护', href: '/settings/dictionary' },
      { label: '用户与权限', href: '/settings/users' }
    ]
  }
];

export function AppSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const basePath = `/${locale}`;
  const normalizedPath = useMemo(() => {
    const pattern = new RegExp(`^/${locale}(?=/|$)`);
    const trimmed = pathname.replace(pattern, '') || '/';
    return trimmed;
  }, [locale, pathname]);

  const buildHref = (href: string | undefined) => {
    if (!href) return basePath;
    if (href === '/') return basePath;
    return `${basePath}${href}`.replace(/\/+/g, '/');
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return normalizedPath === '/';
    }
    return normalizedPath.startsWith(href);
  };

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-border/60 bg-background/80 px-4 py-6 lg:flex lg:flex-col">
      <div className="space-y-6">
        <div className="px-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">导航</p>
        </div>
        <nav className="space-y-4 text-sm">
          {sections.map((section) => {
            const hasChildren = Array.isArray(section.items);
            if (!hasChildren && section.href) {
              return (
                <Link
                  key={section.href}
                  href={buildHref(section.href)}
                  className={cn(
                    'flex items-center rounded-xl px-3 py-2 font-medium transition-colors hover:bg-muted',
                    isActive(section.href) ? 'bg-brand-600/10 text-brand-700' : 'text-muted-foreground'
                  )}
                >
                  {section.label}
                </Link>
              );
            }
            return (
              <Fragment key={section.label}>
                <p className="px-3 text-xs font-semibold uppercase text-muted-foreground/80">{section.label}</p>
                <div className="space-y-1 border-l border-border/30 pl-3">
                  {section.items?.map((item) => (
                    <Link
                      key={item.href}
                      href={buildHref(item.href)}
                      className={cn(
                        'relative block rounded-lg px-3 py-2 transition-colors hover:bg-muted before:absolute before:left-0 before:top-1/2 before:h-2/3 before:w-px before:-translate-y-1/2 before:bg-border/60',
                        isActive(item.href) ? 'bg-brand-600/10 text-brand-700' : 'text-muted-foreground'
                      )}
                    >
                      <span className="ml-2">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </Fragment>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
