// Sayfa bazlı SEO: SPA olduğumuz için title/description/canonical
// etiketlerini rota değişiminde güncelliyoruz (Google JS render ediyor).

import { useEffect } from 'react';

export const SITE_URL = 'https://www.xn--gmrktekalmasn-wobc17f.com';

interface SeoAyar {
  /** Sayfa başlığı — marka eki otomatik eklenir */
  baslik: string;
  aciklama: string;
  /** Rota yolu, örn. "/hesapla" */
  yol: string;
  /** Arama sonuçlarında görünmesin (ör. duruma bağlı sonuç sayfası) */
  indexleme?: boolean;
}

function metaAyarla(secici: string, olustur: () => HTMLElement, icerik: string) {
  let el = document.head.querySelector(secici) as HTMLElement | null;
  if (!el) {
    el = olustur();
    document.head.appendChild(el);
  }
  el.setAttribute('content', icerik);
}

export function useSeo({ baslik, aciklama, yol, indexleme = true }: SeoAyar) {
  useEffect(() => {
    const tamBaslik = `${baslik} | Gümrükte Kalmasın`;
    document.title = tamBaslik;

    metaAyarla(
      'meta[name="description"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'description');
        return m;
      },
      aciklama,
    );
    metaAyarla(
      'meta[property="og:title"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:title');
        return m;
      },
      tamBaslik,
    );
    metaAyarla(
      'meta[property="og:description"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:description');
        return m;
      },
      aciklama,
    );
    metaAyarla(
      'meta[property="og:url"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:url');
        return m;
      },
      `${SITE_URL}${yol}`,
    );
    metaAyarla(
      'meta[name="robots"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'robots');
        return m;
      },
      indexleme ? 'index, follow' : 'noindex, follow',
    );

    let canonical = document.head.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}${yol}`;
  }, [baslik, aciklama, yol, indexleme]);
}
