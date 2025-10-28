"use client";

import Link from 'next/link';
import { useLocale } from 'next-intl';

export function AppLogo() {
  const locale = useLocale();
  const href = `/${locale}`;

  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl px-2 py-1 text-brand-700 transition hover:bg-brand-600/10"
    >
      <span className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-brand-600 text-white shadow-soft">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          aria-hidden
          className="transition group-hover:scale-105"
        >
          <defs>
            <linearGradient id="logoGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4f46e5" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <path
            d="M12 2.5c-3.5 4.7-5.5 7.6-5.5 10.2C6.5 16.6 8.9 19.5 12 19.5s5.5-2.9 5.5-6.8C17.5 10.1 15.5 7.2 12 2.5z"
            fill="url(#logoGradient)"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="0.8"
          />
          <circle cx="12" cy="13" r="3.2" fill="rgba(255,255,255,0.3)" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-semibold">深度智水</span>
        <span className="text-xs text-muted-foreground">Deep Water</span>
      </span>
    </Link>
  );
}
