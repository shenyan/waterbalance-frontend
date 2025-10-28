import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale, getMessages } from '@/lib/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale;
  const current = locales.includes(resolvedLocale as Locale) ? (resolvedLocale as Locale) : defaultLocale;

  return {
    locale: current,
    messages: await getMessages(current)
  };
});
