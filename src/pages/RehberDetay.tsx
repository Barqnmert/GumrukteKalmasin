import { Link, Navigate, useParams } from 'react-router-dom';
import { rehberBul } from '../content/rehberler';
import { useSeo } from '../lib/seo';

function RehberDetay() {
  const { slug } = useParams<{ slug: string }>();
  const rehber = slug ? rehberBul(slug) : undefined;

  useSeo({
    baslik: rehber?.baslik ?? 'Rehber',
    aciklama: rehber?.ozet ?? '',
    yol: `/rehber/${slug ?? ''}`,
  });

  if (!rehber) {
    return <Navigate to="/rehber" replace />;
  }

  return (
    <main>
      <p>
        <Link to="/rehber">← Tüm rehberler</Link>
      </p>
      <h1>{rehber.baslik}</h1>
      <p>{rehber.ozet}</p>
      <p className="uyari">
        Bu rehber bilgilendirme amaçlıdır; mevzuat değişebilir. Takıldığın
        noktada <Link to="/musavir">müşavir talebini</Link> başlatabilirsin.
      </p>

      <h2>Adımlar</h2>
      <div className="kart">
        <ol className="adim-listesi">
          {rehber.adimlar.map((a) => (
            <li className="adim" key={a.baslik}>
              <strong>{a.baslik}</strong>
              <p style={{ margin: '0.25rem 0 0' }}>{a.detay}</p>
            </li>
          ))}
        </ol>
      </div>

      <h2>Gerekli belgeler</h2>
      <div className="kart">
        <ul>
          {rehber.gerekliBelgeler.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <h2>İpuçları</h2>
      <div className="kart">
        <ul>
          {rehber.ipuclari.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default RehberDetay;
