import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { kararVer } from '../lib/decisionEngine';
import type { Durum, Kategori, Mensei, PaketGirdisi } from '../lib/types';

function TriageForm() {
  const navigate = useNavigate();
  const [urunBedeli, setUrunBedeli] = useState('');
  const [kargoUcreti, setKargoUcreti] = useState('');
  const [sigorta, setSigorta] = useState('');
  const [mensei, setMensei] = useState<Mensei>('AB_DISI');
  const [kategori, setKategori] = useState<Kategori>('genel');
  const [durum, setDurum] = useState<Durum>('gumrukte_bekliyor');
  const [gecenGun, setGecenGun] = useState('');
  const [hata, setHata] = useState('');

  function gonder(e: FormEvent) {
    e.preventDefault();
    const girdi: PaketGirdisi = {
      urunBedeli: Number(urunBedeli),
      kargoUcreti: Number(kargoUcreti || 0),
      sigorta: Number(sigorta || 0),
      mensei,
      kategori,
      durum,
      gumrukteGecenGun: gecenGun ? Number(gecenGun) : undefined,
    };
    try {
      const sonuc = kararVer(girdi);
      navigate('/sonuc', { state: { girdi, sonuc } });
    } catch (err) {
      setHata(err instanceof Error ? err.message : 'Hesaplama başarısız oldu');
    }
  }

  return (
    <main>
      <h1>Paketiniz gümrükte mi takıldı?</h1>
      <p>
        Paket bilgilerini girin; vergileri ve masrafları tahmin edelim,
        <strong> dürüst</strong> bir öneri verelim: değer mi, kendiniz mi
        halledersiniz, yoksa müşavir mi tutmalısınız.
      </p>

      <form className="kart" onSubmit={gonder}>
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
            Yabancı para cinsinden biliyorsanız güncel kurla TL karşılığını girin.
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
          <label htmlFor="mensei">Menşe (gönderen ülke)</label>
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
            <option value="elektronik">Elektronik</option>
            <option value="tekstil">Tekstil / giyim</option>
            <option value="kozmetik">Kozmetik</option>
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
            <label htmlFor="gecenGun">Kaç gündür gümrükte? (biliyorsanız)</label>
            <input
              id="gecenGun"
              type="number"
              min="0"
              step="1"
              value={gecenGun}
              onChange={(e) => setGecenGun(e.target.value)}
              placeholder="örn. 5"
            />
            <p className="ipucu">Boş bırakırsanız 5 gün varsayılır (ardiye tahmini için).</p>
          </div>
        )}

        {hata && <p style={{ color: 'var(--renk-degmez)' }}>{hata}</p>}

        <button type="submit">Hesapla ve öneri al</button>
      </form>
    </main>
  );
}

export default TriageForm;
