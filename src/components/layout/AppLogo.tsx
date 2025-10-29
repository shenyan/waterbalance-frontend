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
      <span className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-3xl bg-brand-600 text-white shadow-soft transition group-hover:shadow-[0_12px_24px_-14px_rgba(79,70,229,0.6)]">
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden className="transition-transform group-hover:scale-105">
          <defs>
            <linearGradient id="logoGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#4f46e5" />
              <stop offset="1" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <path
            d="M12 2.5c-3.5 4.7-5.5 7.6-5.5 10.2C6.5 16.6 8.9 19.5 12 19.5s5.5-2.9 5.5-6.8C17.5 10.1 15.5 7.2 12 2.5z"
            fill="url(#logoGradient)"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1"
          />
          <circle cx="12" cy="12.5" r="4.3" fill="rgba(255,255,255,0.25)" />
          <g opacity="0.85" stroke="#ffffff" strokeWidth="0.65" strokeLinecap="round">
            <path d="M15.5 9.3a3.6 3.6 0 010 6.4" />
            <path d="M8.5 9.3a3.6 3.6 0 000 6.4" />
            <path d="M9.6 10.9h1.8" />
            <path d="M9.6 13.1h1.8" />
          </g>
          <path
            d="M12 5c.8 1.4 1.3 2.4 1.3 3.4 0 1.6-1.1 3.1-2.3 3.1S8.7 10 8.7 8.4c0-1 .5-2.1 3.3-3.4z"
            fill="rgba(255,255,255,0.2)"
          />
          <path
            d="M11.2 11.6c.1-.6.6-1 1.2-1s1.1.4 1.2 1-.4.9-1.2.9-1.3-.3-1.2-.9z"
            fill="rgba(255,255,255,0.55)"
          />
        </svg>
        <span className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/18 via-transparent to-white/6 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-semibold">深度智水</span>
        <span className="text-xs text-muted-foreground">Deep Water</span>
      </span>
    </Link>
  );
}
