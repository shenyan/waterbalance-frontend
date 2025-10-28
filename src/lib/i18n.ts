import { createTranslator, IntlError, IntlErrorCode } from 'next-intl';

export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh';

export async function getMessages(locale: Locale) {
  switch (locale) {
    case 'en':
      return (await import('@/locales/en/common.json')).default;
    case 'zh':
    default:
      return (await import('@/locales/zh/common.json')).default;
  }
}

export async function getTranslator(locale: Locale) {
  const messages = await getMessages(locale);
  return createTranslator({
    locale,
    messages,
    onError(error: IntlError) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        console.warn(`Missing translation for ${error.message}`);
      }
    }
  });
}
