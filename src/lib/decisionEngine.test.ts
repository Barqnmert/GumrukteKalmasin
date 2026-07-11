import { describe, expect, it } from 'vitest';
import { hesaplaArdiye, hesaplaMaliyet, kararVer } from './decisionEngine';
import {
  DEGMEZ_ORAN_ESIGI,
  KDV_ORANI,
  KENDIN_YAP_DEGER_ESIGI,
  MUSAVIRLIK_UCRETI,
} from './rates';
import type { PaketGirdisi } from './types';

const temelGirdi: PaketGirdisi = {
  urunBedeli: 5000,
  kargoUcreti: 500,
  sigorta: 0,
  mensei: 'AB_DISI',
  kategori: 'genel',
  durum: 'yolda',
};

describe('hesaplaMaliyet', () => {
  it('brief formülünü sırayla uygular (AB dışı, genel kategori)', () => {
    const d = hesaplaMaliyet(temelGirdi);
    const cif = 5500;
    const gv = cif * 0.3;
    const kdv = (cif + gv) * KDV_ORANI;
    expect(d.cif).toBe(cif);
    expect(d.gumrukVergisi).toBeCloseTo(gv, 2);
    expect(d.otv).toBe(0);
    expect(d.kdv).toBeCloseTo(kdv, 2);
    expect(d.ardiye).toBe(0); // yolda → ardiye yok
    expect(d.toplamKendinYap).toBeCloseTo(gv + kdv, 2);
  });

  it('AB menşeli üründe gümrük vergisi 0', () => {
    const d = hesaplaMaliyet({ ...temelGirdi, mensei: 'AB' });
    expect(d.gumrukVergisi).toBe(0);
    expect(d.kdv).toBeCloseTo(5500 * KDV_ORANI, 2);
  });

  it('ÖTV, gümrük vergisi dahil matrah üzerinden hesaplanır (elektronik)', () => {
    const d = hesaplaMaliyet({ ...temelGirdi, kategori: 'elektronik' });
    const matrah = 5500 * 1.3;
    expect(d.otv).toBeCloseTo(matrah * 0.2, 2);
    expect(d.kdv).toBeCloseTo((matrah + d.otv) * KDV_ORANI, 2);
  });

  it('CIF sigortayı da içerir', () => {
    const d = hesaplaMaliyet({ ...temelGirdi, sigorta: 250 });
    expect(d.cif).toBe(5750);
  });

  it('müşavirli toplam = kendin yap + müşavirlik orta ücreti', () => {
    const d = hesaplaMaliyet(temelGirdi);
    const orta = (MUSAVIRLIK_UCRETI.min + MUSAVIRLIK_UCRETI.max) / 2;
    expect(d.toplamMusavirli).toBeCloseTo(d.toplamKendinYap + orta, 2);
  });

  it('geçersiz girdide hata fırlatır', () => {
    expect(() => hesaplaMaliyet({ ...temelGirdi, urunBedeli: 0 })).toThrow();
    expect(() => hesaplaMaliyet({ ...temelGirdi, kargoUcreti: -1 })).toThrow();
  });
});

describe('hesaplaArdiye', () => {
  it('ilk 3 gün ücretsiz', () => {
    expect(hesaplaArdiye(0)).toBe(0);
    expect(hesaplaArdiye(3)).toBe(0);
  });

  it('4. günden itibaren günlük ücret işler', () => {
    expect(hesaplaArdiye(5)).toBe(300); // 4. ve 5. gün × 150
  });

  it('11. günden itibaren yüksek dilim uygulanır', () => {
    // 4-10. gün: 7 × 150 = 1050, 11-12. gün: 2 × 300 = 600
    expect(hesaplaArdiye(12)).toBe(1650);
  });
});

describe('kararVer', () => {
  it('maliyet oranı eşiği aşınca DEGMEZ döner', () => {
    // Ucuz ürün + pahalı kargo → vergiler ürün bedelini aşar
    const sonuc = kararVer({
      ...temelGirdi,
      urunBedeli: 300,
      kargoUcreti: 900,
    });
    expect(sonuc.dokum.maliyetOrani).toBeGreaterThan(DEGMEZ_ORAN_ESIGI);
    expect(sonuc.oneri).toBe('DEGMEZ');
  });

  it('düşük değerli kısıtsız ürün için KENDIN_YAP döner', () => {
    const sonuc = kararVer({ ...temelGirdi, kategori: 'kitap', mensei: 'AB' });
    expect(sonuc.oneri).toBe('KENDIN_YAP');
  });

  it('eşik üstü değerde MUSAVIR_TUT döner', () => {
    const sonuc = kararVer({
      ...temelGirdi,
      urunBedeli: KENDIN_YAP_DEGER_ESIGI,
      mensei: 'AB',
      kategori: 'kitap',
    });
    expect(sonuc.oneri).toBe('MUSAVIR_TUT');
  });

  it('düşük değerli ama kısıtlı kategoride (kozmetik) MUSAVIR_TUT döner', () => {
    const sonuc = kararVer({
      ...temelGirdi,
      urunBedeli: 2000,
      kargoUcreti: 100,
      mensei: 'AB',
      kategori: 'kozmetik',
    });
    expect(sonuc.oneri).toBe('MUSAVIR_TUT');
  });

  it('gümrükte bekleyen pakette ardiye maliyete dahil edilir', () => {
    const sonuc = kararVer({
      ...temelGirdi,
      durum: 'gumrukte_bekliyor',
      gumrukteGecenGun: 10,
    });
    expect(sonuc.dokum.ardiye).toBeGreaterThan(0);
  });

  it('her sonuçta gerekçe listesi dolu döner', () => {
    const sonuc = kararVer(temelGirdi);
    expect(sonuc.gerekce.length).toBeGreaterThan(0);
  });
});
