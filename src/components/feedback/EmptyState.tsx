"use client";

import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/40 px-6 py-12 text-center text-sm text-muted-foreground">
      <Inbox className="h-8 w-8 text-brand-600" />
      <div>
        <p className="text-base font-medium text-foreground">{title}</p>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
