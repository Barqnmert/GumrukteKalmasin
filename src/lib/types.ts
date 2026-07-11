export type Mensei = 'AB' | 'AB_DISI';

export type Kategori = 'elektronik' | 'tekstil' | 'kozmetik' | 'kitap' | 'genel';

export type Durum = 'yolda' | 'gumrukte_bekliyor' | 'bildirim_geldi';

export type Oneri = 'DEGMEZ' | 'KENDIN_YAP' | 'MUSAVIR_TUT';

export interface PaketGirdisi {
  /** Ürün bedeli (TL) */
  urunBedeli: number;
  /** Kargo ücreti (TL) */
  kargoUcreti: number;
  /** Sigorta bedeli (TL), yoksa 0 */
  sigorta?: number;
  mensei: Mensei;
  kategori: Kategori;
  durum: Durum;
  /** Paket gümrükteyse kaç gündür beklediği (ardiye tahmini için) */
  gumrukteGecenGun?: number;
}

export interface MaliyetDokumu {
  cif: number;
  gumrukVergisi: number;
  otv: number;
  kdv: number;
  ardiye: number;
  musavirlikUcreti: { min: number; max: number; orta: number };
  /** Müşavirsiz (kendin yap) toplam ek maliyet */
  toplamKendinYap: number;
  /** Müşavirli toplam ek maliyet (müşavirlik ücreti orta değeriyle) */
  toplamMusavirli: number;
  /** toplamKendinYap / urunBedeli */
  maliyetOrani: number;
}

export interface KararSonucu {
  oneri: Oneri;
  gerekce: string[];
  dokum: MaliyetDokumu;
}
