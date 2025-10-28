"use client";

import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  loading?: boolean;
  error?: string;
}

export function ChartCard({ title, subtitle, actions, children, loading, error }: Props) {
  return (
    <section className="card flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-brand-700">{title}</h2>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className={cn('relative min-h-[200px] flex-1 rounded-xl border border-dashed border-border/40')}>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-muted/50 animate-pulse">
            <Loader2 className="h-6 w-6 animate-spin text-brand-600" aria-hidden />
            <span className="sr-only">Loading chart...</span>
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-destructive/10 text-sm text-destructive">
            <span>未能加载图表</span>
            <span className="text-xs text-destructive/80">{error}</span>
          </div>
        ) : null}
        <div className={cn('h-full w-full', loading || error ? 'opacity-40' : 'opacity-100')}>{children}</div>
      </div>
    </section>
  );
}
