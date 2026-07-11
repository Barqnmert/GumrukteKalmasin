// 2026 referans oranları ve eşikleri — TEK KALİBRASYON NOKTASI.
// Kaynak: 6 Şubat 2026 düzenlemesi sonrası tahmini değerler; Ticaret Bakanlığı
// tebliği (brief Bölüm 6) netleşince yalnızca bu dosya güncellenir.

import type { Kategori, Mensei } from './types';

/** Gümrük vergisi oranı (CIF üzerinden), menşeye göre */
export const GUMRUK_VERGISI_ORANI: Record<Mensei, number> = {
  AB: 0,
  AB_DISI: 0.3, // maktu oran — 2026 tebliği ile güncellenecek
};

/** ÖTV oranı (CIF + gümrük vergisi üzerinden), kategoriye göre */
export const OTV_ORANI: Record<Kategori, number> = {
  elektronik: 0.2, // telefon vb. cihazlarda daha yüksek olabilir — kalibre edilecek
  tekstil: 0,
  kozmetik: 0.2,
  kitap: 0,
  genel: 0,
};

/** KDV oranı (CIF + gümrük vergisi + ÖTV üzerinden) */
export const KDV_ORANI = 0.2;

/**
 * Kısıtlı / izne tabi kategoriler: DIY önerilmez.
 * kozmetik → TİTCK ürün takip/izin süreci gerekebilir.
 * elektronik → ÖTV'li + IMEI kaydı (telefon) gibi ek süreçler.
 */
export const KISITLI_KATEGORILER: ReadonlySet<Kategori> = new Set([
  'kozmetik',
  'elektronik',
]);

/** Ardiye referans tablosu: gün aralığına göre günlük ücret (TL) */
export const ARDIYE_TABLOSU: ReadonlyArray<{
  gunBasi: number; // bu günden itibaren (dahil)
  gunlukUcret: number;
}> = [
  { gunBasi: 1, gunlukUcret: 0 }, // ilk 3 gün genellikle ücretsiz
  { gunBasi: 4, gunlukUcret: 150 },
  { gunBasi: 11, gunlukUcret: 300 },
];

/** Paket gümrükte bekliyorsa ve gün bilinmiyorsa varsayılan bekleme günü */
export const VARSAYILAN_BEKLEME_GUNU = 5;

/** Gümrük müşavirliği ücreti — 2026 Asgari Ücret Tarifesi referans aralığı (TL) */
export const MUSAVIRLIK_UCRETI = {
  min: 3000,
  max: 8000,
};

/** DEĞMEZ eşiği: toplam maliyet / ürün bedeli bu oranı aşarsa iade/imha öner */
export const DEGMEZ_ORAN_ESIGI = 0.7;

/**
 * KENDİN YAP üst sınırı (TL): ürün bedeli bunun altındaysa ve kategori
 * kısıtlı değilse DIY öner. İlk sürümde tahmini — kullanıcı geri
 * bildirimiyle kalibre edilecek (brief Bölüm 2).
 */
export const KENDIN_YAP_DEGER_ESIGI = 15000;
