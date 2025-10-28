"use client";

import type { ReactNode } from 'react';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { cn } from '@/lib/utils';

export function AppShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader />
        <main className={cn('flex-1 bg-background px-6 py-8', className)}>
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
