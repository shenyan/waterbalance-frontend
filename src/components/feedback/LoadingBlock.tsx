"use client";

import { Loader2 } from 'lucide-react';

export function LoadingBlock({ label = '加载中…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-6 py-8 text-sm text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      <span>{label}</span>
    </div>
  );
}
