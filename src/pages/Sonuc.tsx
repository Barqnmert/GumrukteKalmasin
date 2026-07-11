import { Link, Navigate, useLocation } from 'react-router-dom';
import { useSeo } from '../lib/seo';
import type { KararSonucu, PaketGirdisi } from '../lib/types';

const ONERI_GORUNUM = {
  DEGMEZ: {
    rozet: 'rozet rozet-degmez',
    baslik: 'DEĞMEZ',
    aciklama:
      'Vergiler ve masraflar ürün bedeline göre çok yüksek. Kabul etmeyip iade veya gümrükte terk seçeneğini değerlendirin.',
  },
  KENDIN_YAP: {
    rozet: 'rozet rozet-kendin-yap',
    baslik: 'KENDİN YAP',
    aciklama:
      'Bu paketi müşavire para ödemeden çekebilirsiniz: beyanı taşıyıcı firma düzenler, size vergiyi online ödemek kalır.',
  },
  MUSAVIR_TUT: {
    rozet: 'rozet rozet-musavir',
    baslik: 'MÜŞAVİR TUT',
    aciklama:
      'Bu gönderi standart ithalat beyannamesi istiyor. Lisanslı bir gümrük müşaviriyle ilerlemek daha güvenli.',
  },
  GETIRILEMEZ: {
    rozet: 'rozet rozet-getirilemez',
    baslik: 'GETİRİLEMEZ',
    aciklama:
      'Bu eşya bireysel posta/hızlı kargo gönderisiyle Türkiye\'ye sokulamıyor — vergisi ödenmek istense bile.',
  },
} as const;

function tl(tutar: number): string {
  return tutar.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface SonucState {
  girdi: PaketGirdisi;
  sonuc: KararSonucu;
}

function Sonuc() {
  useSeo({
    baslik: 'Hesap Sonucu',
    aciklama: 'Paketiniz için kişisel gümrük maliyeti dökümü ve önerimiz.',
    yol: '/hesapla', // sonuç duruma bağlı; canonical hesap sayfasına işaret eder
    indexleme: false,
  });

  const location = useLocation();
  const state = location.state as SonucState | null;

  if (!state) {
    return <Navigate to="/hesapla" replace />;
  }

  const { girdi, sonuc } = state;
  const gorunum = ONERI_GORUNUM[sonuc.oneri];
  const d = sonuc.dokum;
  const maktu = d.rejim === 'MAKTU';

  return (
    <main>
      <header className="sayfa-baslik">
        <h1>Önerimiz</h1>
      </header>

      <div className="kart sonuc-kart">
        <span className={gorunum.rozet}>{gorunum.baslik}</span>
        <p className="sonuc-aciklama">{gorunum.aciklama}</p>
        <ul className="gerekce-listesi">
          {sonuc.gerekce.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>

        {sonuc.oneri === 'KENDIN_YAP' && (
          <div className="cta-grubu">
            <Link className="btn" to="/rehber">
              Adım adım rehbere git
            </Link>
          </div>
        )}

        {sonuc.oneri === 'MUSAVIR_TUT' && (
          <div className="cta-grubu">
            <Link className="btn" to="/musavir" state={{ girdi, sonuc }}>
              Müşavir talebini başlat
            </Link>
            <Link className="btn btn-ikincil" to="/rehber/is-numunesi">
              Önce süreci anlamak istiyorum
            </Link>
          </div>
        )}

        {sonuc.oneri === 'DEGMEZ' && (
          <div className="degmez-devam">
            <p>
              <strong>Yine de ürününüzü almak istiyorsanız:</strong>{' '}
              {maktu
                ? 'süreç basit — vergiyi ödeyip paketi çekebilirsiniz, sadece hesaptaki tutarı göze alın.'
                : 'standart beyanname gerekeceği için müşavir desteğiyle ilerlemenizi öneririz.'}
            </p>
            <div className="cta-grubu">
              {maktu ? (
                <Link className="btn btn-ikincil" to="/rehber">
                  Yine de alacağım → DIY rehber
                </Link>
              ) : (
                <Link
                  className="btn btn-ikincil"
                  to="/musavir"
                  state={{ girdi, sonuc }}
                >
                  Yine de alacağım → Müşavir tut
                </Link>
              )}
            </div>
          </div>
        )}

        {sonuc.oneri === 'GETIRILEMEZ' && (
          <>
            <div className="uyari">
              {sonuc.engeller.map((e) => (
                <p key={e} style={{ margin: '0.25rem 0' }}>
                  {e}
                </p>
              ))}
            </div>
            <div className="cta-grubu">
              <Link
                className="btn"
                to="/musavir"
                state={{ girdi, sonuc }}
              >
                İşletmem var, ticari ithalatı sorayım
              </Link>
              <Link className="btn btn-ikincil" to="/rehber">
                İade sürecine bak
              </Link>
            </div>
          </>
        )}
      </div>

      {sonuc.oneri !== 'GETIRILEMEZ' && (
        <>
          <h2>Maliyet dökümü (tahmini)</h2>
          <div className="kart">
            <p className="rejim-etiketi">
              {maktu
                ? 'Tek ve maktu vergi rejimi — bireysel gönderi, ayrıca KDV alınmaz'
                : 'Standart ithalat rejimi — beyanname (TCGB) gerekir'}
            </p>
            <div className="tablo-kaydir">
              <table>
                <tbody>
                  <tr>
                    <td>CIF (ürün + kargo + sigorta)</td>
                    <td className="tutar">{tl(d.cif)} TL</td>
                  </tr>
                  <tr>
                    <td className="alt-bilgi" colSpan={2}>
                      ≈ {tl(d.cifEur)} € (1 € = {tl(d.kur)} TL)
                    </td>
                  </tr>
                  {maktu ? (
                    <>
                      <tr>
                        <td>
                          Tek ve maktu vergi (
                          {girdi.kategori === 'kitap'
                            ? '%0 — kitap'
                            : girdi.mensei === 'AB'
                              ? '%30 — AB'
                              : '%60 — AB dışı'}
                          )
                        </td>
                        <td className="tutar">{tl(d.maktuVergi)} TL</td>
                      </tr>
                      {d.otvIvEk > 0 && (
                        <tr>
                          <td>ÖTV (IV) listesi ilave vergisi (%20)</td>
                          <td className="tutar">{tl(d.otvIvEk)} TL</td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <>
                      <tr>
                        <td>Gümrük vergisi (tahmini tarife)</td>
                        <td className="tutar">{tl(d.gumrukVergisi)} TL</td>
                      </tr>
                      {d.otv > 0 && (
                        <tr>
                          <td>ÖTV</td>
                          <td className="tutar">{tl(d.otv)} TL</td>
                        </tr>
                      )}
                      <tr>
                        <td>KDV</td>
                        <td className="tutar">{tl(d.kdv)} TL</td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td>Ardiye tahmini</td>
                    <td className="tutar">{tl(d.ardiye)} TL</td>
                  </tr>
                  <tr className="toplam">
                    <td>Kendin yaparsan toplam ek maliyet</td>
                    <td className="tutar">{tl(d.toplamKendinYap)} TL</td>
                  </tr>
                  {!maktu && (
                    <>
                      <tr>
                        <td>
                          Müşavirlik ücreti aralığı
                          <span className="ipucu" style={{ display: 'block' }}>
                            2026 Asgari Ücret Tarifesi referansı, KDV hariç
                          </span>
                        </td>
                        <td className="tutar">
                          {tl(d.musavirlikUcreti.min)} –{' '}
                          {tl(d.musavirlikUcreti.max)} TL
                        </td>
                      </tr>
                      <tr className="toplam">
                        <td>Müşavirli toplam (orta değerle)</td>
                        <td className="tutar">{tl(d.toplamMusavirli)} TL</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <p className="ipucu">
              Ek maliyet / ürün bedeli oranı: %{Math.round(d.maliyetOrani * 100)}
              {' — '}ürün bedeli: {tl(girdi.urunBedeli)} TL. Tutarlar tahmindir;
              kesin vergi gümrük idaresinin kıymet tespitine göre belirlenir.
            </p>
          </div>
        </>
      )}

      <p>
        <Link className="btn btn-ikincil" to="/hesapla">
          ← Yeni hesap yap
        </Link>
      </p>
    </main>
  );
}

export default Sonuc;
