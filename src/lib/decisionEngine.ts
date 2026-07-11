// Katman 1 — Karar Motoru (deterministik, AI değil)
// Hesap sırası brief Bölüm 2'deki formülü birebir izler:
//   CIF = ürün bedeli + kargo + sigorta
//   gümrük vergisi = CIF × oran
//   ÖTV = (CIF + gümrük vergisi) × ÖTV oranı
//   KDV = (CIF + gümrük vergisi + ÖTV) × %20
//   + ardiye + (müşavirli senaryoda) müşavirlik ücreti

import {
  ARDIYE_TABLOSU,
  DEGMEZ_ORAN_ESIGI,
  GUMRUK_VERGISI_ORANI,
  KDV_ORANI,
  KENDIN_YAP_DEGER_ESIGI,
  KISITLI_KATEGORILER,
  MUSAVIRLIK_UCRETI,
  OTV_ORANI,
  VARSAYILAN_BEKLEME_GUNU,
} from './rates';
import type { KararSonucu, MaliyetDokumu, PaketGirdisi } from './types';

function yuvarla(tutar: number): number {
  return Math.round(tutar * 100) / 100;
}

/** Gün sayısına göre ardiye tahmini (TL) */
export function hesaplaArdiye(gun: number): number {
  if (gun <= 0) return 0;
  let toplam = 0;
  for (let g = 1; g <= gun; g++) {
    let gunluk = 0;
    for (const dilim of ARDIYE_TABLOSU) {
      if (g >= dilim.gunBasi) gunluk = dilim.gunlukUcret;
    }
    toplam += gunluk;
  }
  return toplam;
}

function beklemeGunu(girdi: PaketGirdisi): number {
  if (girdi.durum === 'yolda') return 0;
  return girdi.gumrukteGecenGun ?? VARSAYILAN_BEKLEME_GUNU;
}

export function hesaplaMaliyet(girdi: PaketGirdisi): MaliyetDokumu {
  if (!(girdi.urunBedeli > 0)) {
    throw new Error('Ürün bedeli 0\'dan büyük olmalı');
  }
  if (girdi.kargoUcreti < 0 || (girdi.sigorta ?? 0) < 0) {
    throw new Error('Kargo ve sigorta negatif olamaz');
  }

  const cif = girdi.urunBedeli + girdi.kargoUcreti + (girdi.sigorta ?? 0);
  const gumrukVergisi = cif * GUMRUK_VERGISI_ORANI[girdi.mensei];
  const otv = (cif + gumrukVergisi) * OTV_ORANI[girdi.kategori];
  const kdv = (cif + gumrukVergisi + otv) * KDV_ORANI;
  const ardiye = hesaplaArdiye(beklemeGunu(girdi));

  const musavirlikOrta = (MUSAVIRLIK_UCRETI.min + MUSAVIRLIK_UCRETI.max) / 2;
  const toplamKendinYap = gumrukVergisi + otv + kdv + ardiye;
  const toplamMusavirli = toplamKendinYap + musavirlikOrta;

  return {
    cif: yuvarla(cif),
    gumrukVergisi: yuvarla(gumrukVergisi),
    otv: yuvarla(otv),
    kdv: yuvarla(kdv),
    ardiye: yuvarla(ardiye),
    musavirlikUcreti: {
      min: MUSAVIRLIK_UCRETI.min,
      max: MUSAVIRLIK_UCRETI.max,
      orta: musavirlikOrta,
    },
    toplamKendinYap: yuvarla(toplamKendinYap),
    toplamMusavirli: yuvarla(toplamMusavirli),
    maliyetOrani: yuvarla(toplamKendinYap / girdi.urunBedeli),
  };
}

export function kararVer(girdi: PaketGirdisi): KararSonucu {
  const dokum = hesaplaMaliyet(girdi);
  const gerekce: string[] = [];

  // 1) En ucuz senaryo (kendin yap) bile eşiği aşıyorsa: DEĞMEZ
  if (dokum.maliyetOrani > DEGMEZ_ORAN_ESIGI) {
    gerekce.push(
      `Vergiler ve masraflar ürün bedelinin %${Math.round(dokum.maliyetOrani * 100)}'i kadar — eşik %${Math.round(DEGMEZ_ORAN_ESIGI * 100)}.`,
      'Bu paket için iade veya gümrükte terk/imha talebini değerlendirin.',
    );
    return { oneri: 'DEGMEZ', gerekce, dokum };
  }

  // 2) Düşük değerli + kısıtsız/ÖTV'siz: KENDİN YAP
  const kisitli =
    KISITLI_KATEGORILER.has(girdi.kategori) || OTV_ORANI[girdi.kategori] > 0;
  if (girdi.urunBedeli < KENDIN_YAP_DEGER_ESIGI && !kisitli) {
    gerekce.push(
      `Ürün bedeli ${KENDIN_YAP_DEGER_ESIGI.toLocaleString('tr-TR')} TL eşiğinin altında ve kategori kısıtlı değil.`,
      'BİLGE sistemi üzerinden kendi beyanınızı verebilirsiniz — adım adım rehberimiz var.',
    );
    return { oneri: 'KENDIN_YAP', gerekce, dokum };
  }

  // 3) Yüksek değer veya kısıtlı/karmaşık kategori: MÜŞAVİR TUT
  if (kisitli) {
    gerekce.push(
      'Kategori kısıtlı veya ÖTV kapsamında (izin/ek beyan süreci gerekebilir).',
    );
  }
  if (girdi.urunBedeli >= KENDIN_YAP_DEGER_ESIGI) {
    gerekce.push(
      `Ürün bedeli ${KENDIN_YAP_DEGER_ESIGI.toLocaleString('tr-TR')} TL eşiğinin üzerinde — hata maliyeti yüksek.`,
    );
  }
  gerekce.push('Lisanslı bir gümrük müşaviriyle ilerlemenizi öneriyoruz.');
  return { oneri: 'MUSAVIR_TUT', gerekce, dokum };
}
