import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { createTranslator } from 'next-intl';
import '../styles/globals.css';
import Providers from './providers';
import { defaultLocale, getMessages, locales, type Locale } from '@/lib/i18n';

export const metadata: Metadata = {
  title: process.env.APP_NAME ?? '深度智水 · Water Balance',
  description: '深度智水 (Deep Water) 智慧水务水量平衡与漏损平台'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const localeHeader = headers().get('x-next-intl-locale');
  const locale = locales.includes(localeHeader as Locale) ? (localeHeader as Locale) : defaultLocale;
  const messages = await getMessages(locale);
  const translator = await createTranslator({ locale, messages });

  return (
    <html lang={locale} suppressHydrationWarning data-theme="light">
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} now={translator.now}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
