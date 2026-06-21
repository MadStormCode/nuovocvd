import { useLocale } from '@/components/locale-context';
import { translations } from './translations';

export function useTranslation() {
  const { locale } = useLocale();

  const t = (key: string | readonly string[]) => {
    const k = Array.isArray(key) ? key[0] : key;
    const dict = (translations as Record<string, Record<string, string>>)[locale];
    const fallback = (translations as Record<string, Record<string, string>>).it;
    return dict?.[k] ?? fallback?.[k] ?? k;
  };

  return { t, locale };
}
