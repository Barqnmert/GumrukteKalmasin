import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { kararVer } from '../lib/decisionEngine';
import { kaydetBasvuru } from '../lib/basvuru';
import { useSeo } from '../lib/seo';
import type { KararSonucu, Kategori, PaketGirdisi } from '../lib/types';

interface GelenState {
  girdi?: PaketGirdisi;
  sonuc?: KararSonucu;
}

function MusavirForm() {
  useSeo({
    baslik: 'Gümrük Müşaviri Bul — Doğrulanmış Firmalarla Ücretsiz Eşleştirme',
    aciklama:
      'Paketiniz standart beyanname mi istiyor? TOBB siciline kayıtlı, doğrulanmış gümrük müşavirlik firmalarıyla sizi ücretsiz eşleştirelim. 1 iş günü içinde dönüş.',
    yol: '/musavir',
  });

  const location = useLocation();
  const gelen = (location.state ?? {}) as GelenState;

  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [paketDegeri, setPaketDegeri] = useState(
    gelen.girdi ? String(gelen.girdi.urunBedeli) : '',
  );
  const [kategori, setKategori] = useState<Kategori>(
    gelen.girdi?.kategori ?? 'genel',
  );
  const [not, setNot] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [tamamlandi, setTamamlandi] = useState(false);
  const [hata, setHata] = useState('');

  async function gonder(e: FormEvent) {
    e.preventDefault();
    if (!email && !telefon) {
      setHata('Size ulaşabilmemiz için e-posta veya telefon girin.');
      return;
    }
    setHata('');
    setGonderiliyor(true);
    try {
      // Sonuç ekranından gelindiyse oradaki hesap kullanılır;
      // doğrudan gelindiyse form bilgisinden yeniden hesaplanır.
      const girdi: PaketGirdisi =
        gelen.girdi ?? {
          urunBedeli: Number(paketDegeri),
          kargoUcreti: 0,
          mensei: 'AB_DISI',
          kategori,
          durum: 'gumrukte_bekliyor',
          gonderiTipi: 'bireysel',
        };
      const sonuc = gelen.sonuc ?? kararVer(girdi);
      await kaydetBasvuru(girdi, sonuc, {
        musavireYonlendirildi: true,
        iletisim: { email, telefon, not },
      });
      setTamamlandi(true);
    } catch {
      setHata('Talep gönderilemedi. Lütfen paket değerini kontrol edip tekrar deneyin.');
    } finally {
      setGonderiliyor(false);
    }
  }

  if (tamamlandi) {
    return (
      <main>
        <h1>Talebiniz alındı ✓</h1>
        <div className="kart">
          <p>
            Paketiniz için TOBB siciline kayıtlı, doğrulanmış gümrük müşavirlik
            firmalarından uygun olanla sizi <strong>en geç 1 iş günü içinde</strong>{' '}
            eşleştirip verdiğiniz iletişim bilgisinden dönüş yapacağız.
          </p>
          <p className="ipucu">
            Bu hizmet şu an ücretsizdir; müşavirlik ücretini doğrudan firmayla
            konuşursunuz.
          </p>
          <Link className="btn btn-ikincil" to="/">
            ← Ana sayfa
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <header className="sayfa-baslik">
        <h1>Müşavir talebi</h1>
        <p>
          Bilgilerinizi bırakın; sizi lisanslı, sicili doğrulanmış bir gümrük
          müşavirlik firmasıyla manuel olarak eşleştirelim. MVP döneminde bu
          hizmet <strong>ücretsizdir</strong>.
        </p>
      </header>

      <form className="kart form-kart" onSubmit={gonder}>
        <div className="form-satir">
          <label htmlFor="email">E-posta</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
          />
        </div>

        <div className="form-satir">
          <label htmlFor="telefon">Telefon</label>
          <input
            id="telefon"
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            placeholder="05xx xxx xx xx"
          />
          <p className="ipucu">E-posta veya telefondan en az birini girin.</p>
        </div>

        {!gelen.girdi && (
          <>
            <div className="form-satir">
              <label htmlFor="paketDegeri">Paket değeri (TL) *</label>
              <input
                id="paketDegeri"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={paketDegeri}
                onChange={(e) => setPaketDegeri(e.target.value)}
                placeholder="örn. 25000"
              />
            </div>
            <div className="form-satir">
              <label htmlFor="kategori">Ürün kategorisi</label>
              <select
                id="kategori"
                value={kategori}
                onChange={(e) => setKategori(e.target.value as Kategori)}
              >
                <option value="genel">Genel / diğer</option>
                <option value="elektronik">Elektronik (telefon hariç)</option>
                <option value="telefon">Cep telefonu</option>
                <option value="tekstil">Tekstil / giyim</option>
                <option value="kozmetik">Kozmetik / parfüm</option>
                <option value="kitap">Kitap / basılı yayın</option>
              </select>
            </div>
          </>
        )}

        <div className="form-satir">
          <label htmlFor="not">Eklemek istedikleriniz</label>
          <input
            id="not"
            type="text"
            value={not}
            onChange={(e) => setNot(e.target.value)}
            placeholder="örn. paket 10 gündür gümrükte, tebligat geldi"
          />
        </div>

        {hata && <p className="form-hata">{hata}</p>}

        <button type="submit" disabled={gonderiliyor}>
          {gonderiliyor ? 'Gönderiliyor…' : 'Talebi gönder'}
        </button>
      </form>
    </main>
  );
}

export default MusavirForm;
