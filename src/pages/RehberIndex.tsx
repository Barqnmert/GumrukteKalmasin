import { Link } from 'react-router-dom';
import { REHBERLER } from '../content/rehberler';
import { useSeo } from '../lib/seo';

function RehberIndex() {
  useSeo({
    baslik: 'Gümrükten Paket Çekme Rehberleri — AliExpress, Amazon, Hediye',
    aciklama:
      'Müşavire para ödemeden paketinizi gümrükten kendiniz çekin: AliExpress/Temu, Amazon/eBay, hediye gönderisi ve iş numunesi için adım adım 2026 rehberleri.',
    yol: '/rehber',
  });

  return (
    <main>
      <header className="sayfa-baslik">
        <h1>DIY Rehberler</h1>
        <p>
          Müşavire para ödemeden paketini kendin çekmek için senaryona uyan
          rehberi seç. Her rehber adım adım ilerler.
        </p>
      </header>
      {REHBERLER.map((r) => (
        <div className="kart" key={r.slug}>
          <h2 style={{ marginTop: 0 }}>
            <Link to={`/rehber/${r.slug}`}>{r.baslik}</Link>
          </h2>
          <p>{r.ozet}</p>
          <p className="ipucu">{r.kimeUygun}</p>
        </div>
      ))}
    </main>
  );
}

export default RehberIndex;
