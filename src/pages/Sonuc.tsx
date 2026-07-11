import { Link, Navigate, useLocation } from 'react-router-dom';
import type { KararSonucu, PaketGirdisi } from '../lib/types';

const ONERI_GORUNUM = {
  DEGMEZ: {
    rozet: 'rozet rozet-degmez',
    baslik: 'DEĞMEZ',
    aciklama:
      'Vergiler ve masraflar ürün bedeline göre çok yüksek. İade talebini veya gümrükte terk/imha seçeneğini değerlendirin.',
  },
  KENDIN_YAP: {
    rozet: 'rozet rozet-kendin-yap',
    baslik: 'KENDİN YAP',
    aciklama:
      'Bu paketi müşavire para ödemeden, kendi beyanınızla çekebilirsiniz. Adım adım rehberimizi takip edin.',
  },
  MUSAVIR_TUT: {
    rozet: 'rozet rozet-musavir',
    baslik: 'MÜŞAVİR TUT',
    aciklama:
      'Bu paket için lisanslı bir gümrük müşaviriyle çalışmak daha güvenli. Sizi doğrulanmış firmalarla eşleştirelim.',
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
  const location = useLocation();
  const state = location.state as SonucState | null;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const { girdi, sonuc } = state;
  const gorunum = ONERI_GORUNUM[sonuc.oneri];
  const d = sonuc.dokum;

  return (
    <main>
      <h1>Önerimiz</h1>
      <div className="kart" style={{ textAlign: 'center' }}>
        <span className={gorunum.rozet}>{gorunum.baslik}</span>
        <p>{gorunum.aciklama}</p>
        <ul style={{ textAlign: 'left' }}>
          {sonuc.gerekce.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        {sonuc.oneri === 'KENDIN_YAP' && (
          <Link className="btn" to="/rehber">
            Adım adım rehbere git
          </Link>
        )}
        {sonuc.oneri === 'MUSAVIR_TUT' && (
          <Link className="btn" to="/musavir" state={{ girdi, sonuc }}>
            Müşavir talebini başlat
          </Link>
        )}
      </div>

      <h2>Maliyet dökümü (tahmini)</h2>
      <div className="kart">
        <table>
          <tbody>
            <tr>
              <td>CIF (ürün + kargo + sigorta)</td>
              <td className="tutar">{tl(d.cif)} TL</td>
            </tr>
            <tr>
              <td>Gümrük vergisi</td>
              <td className="tutar">{tl(d.gumrukVergisi)} TL</td>
            </tr>
            <tr>
              <td>ÖTV</td>
              <td className="tutar">{tl(d.otv)} TL</td>
            </tr>
            <tr>
              <td>KDV (%20)</td>
              <td className="tutar">{tl(d.kdv)} TL</td>
            </tr>
            <tr>
              <td>Ardiye tahmini</td>
              <td className="tutar">{tl(d.ardiye)} TL</td>
            </tr>
            <tr className="toplam">
              <td>Kendin yaparsan toplam ek maliyet</td>
              <td className="tutar">{tl(d.toplamKendinYap)} TL</td>
            </tr>
            <tr>
              <td>
                Müşavirlik ücreti aralığı
                <span className="ipucu" style={{ display: 'block' }}>
                  2026 Asgari Ücret Tarifesi referansı
                </span>
              </td>
              <td className="tutar">
                {tl(d.musavirlikUcreti.min)} – {tl(d.musavirlikUcreti.max)} TL
              </td>
            </tr>
            <tr className="toplam">
              <td>Müşavirli toplam (orta değerle)</td>
              <td className="tutar">{tl(d.toplamMusavirli)} TL</td>
            </tr>
          </tbody>
        </table>
        <p className="ipucu">
          Ek maliyet / ürün bedeli oranı: %{Math.round(d.maliyetOrani * 100)}
          {' — '}ürün bedeli: {tl(girdi.urunBedeli)} TL
        </p>
      </div>

      <p>
        <Link className="btn btn-ikincil" to="/">
          ← Yeni hesap yap
        </Link>
      </p>
    </main>
  );
}

export default Sonuc;
