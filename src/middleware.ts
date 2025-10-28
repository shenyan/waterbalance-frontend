import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/lib/i18n';

const PUBLIC_PATHS = ['/login'];

const handleI18nRouting = createIntlMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'as-needed'
});

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function middleware(request: NextRequest) {
  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const response = handleI18nRouting(request);
  const { pathname, locale } = request.nextUrl;

  const token = request.cookies.get('token');
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    if (locale) {
      loginUrl.searchParams.set('locale', locale);
    }
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next|api|.*\\.[\\w]+$).*)']
};
