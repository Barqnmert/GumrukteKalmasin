import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { kararVer } from '../lib/decisionEngine';
import { kaydetBasvuru } from '../lib/basvuru';
import { getEurTry } from '../lib/kur';
import type { KurBilgisi } from '../lib/kur';
import { useSeo } from '../lib/seo';
import type {
  Durum,
  GonderiTipi,
  Kategori,
  Mensei,
  PaketGirdisi,
} from '../lib/types';

function TriageForm() {
  useSeo({
    baslik: 'Gümrük Vergisi Hesapla — 2026 Güncel Oranlar, Ücretsiz',
    aciklama:
      'Paket değeri, menşe ve kategoriyi girin; tek ve maktu vergi (AB %30 / diğer %60), ÖTV ve ardiye dahil toplam maliyeti anında görün. Üyelik gerekmez.',
    yol: '/hesapla',
  });

  const navigate = useNavigate();
  const [gonderiTipi, setGonderiTipi] = useState<GonderiTipi>('bireysel');
  const [urunBedeli, setUrunBedeli] = useState('');
  const [kargoUcreti, setKargoUcreti] = useState('');
  const [sigorta, setSigorta] = useState('');
  const [mensei, setMensei] = useState<Mensei>('AB_DISI');
  const [kategori, setKategori] = useState<Kategori>('genel');
  const [durum, setDurum] = useState<Durum>('gumrukte_bekliyor');
  const [agirlik, setAgirlik] = useState('');
  const [gecenGun, setGecenGun] = useState('');
  const [hata, setHata] = useState('');
  const [kur, setKur] = useState<KurBilgisi | null>(null);

  useEffect(() => {
    let aktif = true;
    getEurTry().then((k) => {
      if (aktif) setKur(k);
    });
    return () => {
      aktif = false;
    };
  }, []);

  function gonder(e: FormEvent) {
    e.preventDefault();
    const girdi: PaketGirdisi = {
      urunBedeli: Number(urunBedeli),
      kargoUcreti: Number(kargoUcreti || 0),
      sigorta: Number(sigorta || 0),
      mensei,
      kategori,
      durum,
      gonderiTipi,
      agirlikKg: agirlik ? Number(agirlik) : undefined,
      gumrukteGecenGun: gecenGun ? Number(gecenGun) : undefined,
      eurTry: kur?.kur,
    };
    try {
      const sonuc = kararVer(girdi);
      void kaydetBasvuru(girdi, sonuc); // talep ölçümü — akışı bloklamaz
      navigate('/sonuc', { state: { girdi, sonuc } });
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Hesaplama başarısız oldu');
    }
  }

  return (
    <main>
      <header className="sayfa-baslik">
        <h1>Paket bilgilerini gir</h1>
        <p>
          Vergileri ve masrafları güncel 2026 oranlarıyla tahmin edelim,
          <strong> dürüst</strong> bir öneri verelim: değer mi, kendin mi
          halledersin, yoksa müşavir mi gerekir.
        </p>
      </header>

      <form className="kart form-kart" onSubmit={gonder}>
        <div className="form-satir">
          <span className="etiket">Gönderi kimin adına?</span>
          <div className="secim-grubu" role="radiogroup" aria-label="Gönderi tipi">
            <label className={gonderiTipi === 'bireysel' ? 'secim aktif' : 'secim'}>
              <input
                type="radio"
                name="gonderiTipi"
                value="bireysel"
                checked={gonderiTipi === 'bireysel'}
                onChange={() => setGonderiTipi('bireysel')}
              />
              Bireysel (kendi adıma)
            </label>
            <label className={gonderiTipi === 'ticari' ? 'secim aktif' : 'secim'}>
              <input
                type="radio"
                name="gonderiTipi"
                value="ticari"
                checked={gonderiTipi === 'ticari'}
                onChange={() => setGonderiTipi('ticari')}
              />
              İşletme / ticari
            </label>
          </div>
        </div>

        <div className="form-izgara">
          <div className="form-satir">
            <label htmlFor="urunBedeli">Ürün bedeli (TL) *</label>
            <input
              id="urunBedeli"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={urunBedeli}
              onChange={(e) => setUrunBedeli(e.target.value)}
              placeholder="örn. 4500"
            />
            <p className="ipucu">
              {kur
                ? `Güncel kur: 1 € ≈ ${kur.kur.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} TL${kur.kaynak === 'varsayilan' ? ' (referans)' : ' (ECB)'}`
                : 'Döviz cinsinden biliyorsan TL karşılığını gir.'}
            </p>
          </div>

          <div className="form-satir">
            <label htmlFor="kargoUcreti">Kargo ücreti (TL)</label>
            <input
              id="kargoUcreti"
              type="number"
              min="0"
              step="0.01"
              value={kargoUcreti}
              onChange={(e) => setKargoUcreti(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="form-satir">
            <label htmlFor="sigorta">Sigorta bedeli (TL)</label>
            <input
              id="sigorta"
              type="number"
              min="0"
              step="0.01"
              value={sigorta}
              onChange={(e) => setSigorta(e.target.value)}
              placeholder="0"
            />
          </div>

          <div className="form-satir">
            <label htmlFor="agirlik">Brüt ağırlık (kg)</label>
            <input
              id="agirlik"
              type="number"
              min="0"
              step="0.1"
              value={agirlik}
              onChange={(e) => setAgirlik(e.target.value)}
              placeholder="biliyorsan"
            />
            <p className="ipucu">30 kg üzeri gönderiler farklı rejime tabi.</p>
          </div>

          <div className="form-satir">
            <label htmlFor="mensei">Nereden geliyor?</label>
            <select
              id="mensei"
              value={mensei}
              onChange={(e) => setMensei(e.target.value as Mensei)}
            >
              <option value="AB_DISI">AB dışı (Çin, ABD, İngiltere...)</option>
              <option value="AB">Avrupa Birliği ülkesi</option>
            </select>
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

          <div className="form-satir">
            <label htmlFor="durum">Paketin durumu</label>
            <select
              id="durum"
              value={durum}
              onChange={(e) => setDurum(e.target.value as Durum)}
            >
              <option value="yolda">Henüz yolda</option>
              <option value="gumrukte_bekliyor">Gümrükte bekliyor</option>
              <option value="bildirim_geldi">Bildirim/tebligat geldi</option>
            </select>
          </div>

          {durum !== 'yolda' && (
            <div className="form-satir">
              <label htmlFor="gecenGun">Kaç gündür gümrükte?</label>
              <input
                id="gecenGun"
                type="number"
                min="0"
                step="1"
                value={gecenGun}
                onChange={(e) => setGecenGun(e.target.value)}
                placeholder="örn. 5"
              />
              <p className="ipucu">Boş bırakırsan 5 gün varsayılır.</p>
            </div>
          )}
        </div>

        {hata && <p className="form-hata">{hata}</p>}

        <button type="submit" className="btn-buyuk">
          Hesapla ve öneri al →
        </button>
      </form>
    </main>
  );
}

export default TriageForm;
