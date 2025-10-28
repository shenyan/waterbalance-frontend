"use client";

import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function ErrorBlock({ title = '加载失败', description, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-8 text-center text-sm text-destructive">
      <AlertTriangle className="h-8 w-8" />
      <div>
        <p className="text-base font-semibold">{title}</p>
        {description ? <p className="mt-1 text-sm text-destructive/80">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
