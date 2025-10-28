"use client";

import { Search, Sun, Moon, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useTheme } from 'next-themes';
import { useLocale } from 'next-intl';
import { OrgSwitcher } from './OrgSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { AppLogo } from './AppLogo';

const breadcrumbsMap: Record<string, string[]> = {
  '/': ['仪表盘'],
  '/data/categories': ['数据管理', '类别与子项'],
  '/data/items': ['数据管理', '子项管理'],
  '/data/measurements': ['数据管理', '明细管理'],
  '/analysis/monthly': ['水量分析', '当前月'],
  '/analysis/range': ['水量分析', '时间段'],
  '/correction': ['漏损率修正'],
  '/imports': ['导入任务'],
  '/audits': ['审计日志'],
  '/settings/formulas': ['系统配置', '公式参数'],
  '/settings/standards': ['系统配置', '标准阈值'],
  '/settings/dictionary': ['系统配置', '字典维护'],
  '/settings/users': ['系统配置', '用户与权限']
};

export function AppHeader() {
  const pathname = usePathname();
  const locale = useLocale();
  const basePath = `/${locale}`;
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const normalizedPath = useMemo(() => {
    const pattern = new RegExp(`^/${locale}(?=/|$)`);
    const trimmed = pathname.replace(pattern, '') || '/';
    return trimmed;
  }, [locale, pathname]);

  const crumbs = breadcrumbsMap[normalizedPath] ?? ['模块'];

  const toggleTheme = () => {
    const current = resolvedTheme ?? theme;
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex flex-1 items-center gap-3">
          <AppLogo />
          <OrgSwitcher />
          <div className="hidden items-center gap-2 rounded-xl border border-border/70 bg-muted px-3 py-1.5 text-sm text-muted-foreground md:flex">
            <Search className="h-4 w-4" />
            <input
              aria-label="全局搜索"
              className="w-48 bg-transparent text-sm outline-none"
              placeholder="搜索组织、指标或任务"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="切换主题"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card shadow-soft transition hover:bg-muted"
          >
            {(resolvedTheme ?? theme) === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 text-sm font-medium shadow-soft transition hover:bg-muted"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs uppercase text-white">
                U
              </span>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-sm font-semibold">Admin</span>
                <span className="text-xs text-muted-foreground">高级管理员</span>
              </div>
            </button>
            {open ? (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border/70 bg-card p-2 text-sm shadow-soft">
                <Link
                  href={`${basePath}/profile`}
                  className="block rounded-lg px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  个人资料
                </Link>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 bg-muted/40 px-6 py-2 text-sm text-muted-foreground">
        <nav aria-label="breadcrumb" className="flex items-center gap-2">
          <span className="font-medium text-brand-700">状态</span>
          {crumbs.map((crumb, index) => (
            <span key={crumb} className={cn('flex items-center gap-2', index === 0 ? 'font-semibold' : '')}>
              {index > 0 ? <span aria-hidden>›</span> : null}
              {crumb}
            </span>
          ))}
        </nav>
      </div>
    </header>
  );
}
