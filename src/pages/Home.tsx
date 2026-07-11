import { Link } from 'react-router-dom';
import { useSeo } from '../lib/seo';

const ORAN_KARTLARI = [
  {
    deger: '%30',
    baslik: 'AB ülkelerinden',
    detay: 'Tek ve maktu vergi — kıymet üzerinden',
  },
  {
    deger: '%60',
    baslik: 'AB dışından',
    detay: 'Çin, ABD, İngiltere ve diğerleri',
  },
  {
    deger: '+%20',
    baslik: 'ÖTV listesi eşyası',
    detay: 'Elektronik, parfüm gibi (IV) sayılı liste ürünleri',
  },
  {
    deger: '%0',
    baslik: 'Kitap ve basılı yayın',
    detay: 'Kişisel kullanım amaçlı gönderiler',
  },
];

const ADIMLAR = [
  {
    baslik: 'Paketini anlat',
    detay:
      'Değer, menşe, kategori ve durumu gir — 30 saniye sürer, üyelik istemez.',
  },
  {
    baslik: 'Gerçek maliyeti gör',
    detay:
      'Güncel 2026 oranlarıyla vergi, ardiye ve müşavirlik masrafını kalem kalem hesaplarız.',
  },
  {
    baslik: 'Dürüst öneriyi al',
    detay:
      'Değmezse "değmez" deriz. Değerse ya adım adım rehber, ya da doğrulanmış müşavir eşleştirmesi.',
  },
];

const SSS = [
  {
    soru: '30 € muafiyeti gerçekten kalktı mı?',
    cevap:
      'Evet. 7 Ocak 2026 tarihli Resmî Gazete\'de yayımlanan Karar (10813) ile 6 Şubat 2026\'dan itibaren kıymeti ne olursa olsun her gönderi vergiye tabi. 1 €\'luk ürün de gümrük işleminden geçiyor.',
  },
  {
    soru: 'Her paket için müşavir tutmam gerekiyor mu?',
    cevap:
      'Hayır. Kıymeti 1500 €\'yu ve 30 kg\'ı aşmayan bireysel gönderilerde beyanı taşıyıcı firma (PTT veya hızlı kargo operatörü) senin adına düzenler; sana vergiyi online ödemek kalır. Müşavir esas olarak ticari gönderilerde ve limit aşımında gerekir.',
  },
  {
    soru: 'Yurt dışından telefon sipariş edebilir miyim?',
    cevap:
      'Hayır — cep telefonu posta veya hızlı kargo ile getirilemiyor, vergisi ödenmek istense bile. Tek bireysel yol: yolcu beraberinde getirip IMEI kaydı yaptırmak.',
  },
  {
    soru: 'Ayda kaç paket getirebilirim?',
    cevap:
      'Bir takvim ayında en fazla 5 gönderi bu kapsamda işlem görebilir. Ayrıca gönderi başına 1500 € kıymet ve brüt 30 kg sınırı var.',
  },
  {
    soru: 'Paketimi almazsam ne olur?',
    cevap:
      'Bekleme süresi operatöre göre değişir (genelde 7-15 gün, tebligat sonrası yaklaşık 30 gün). Süre dolunca paket göndericiye iade edilir veya tasfiyeye gider; ardiye ücreti de birikir. Bu yüzden karar vermeyi geciktirme.',
  },
];

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: SSS.map((s) => ({
    '@type': 'Question',
    name: s.soru,
    acceptedAnswer: { '@type': 'Answer', text: s.cevap },
  })),
};

function Home() {
  useSeo({
    baslik: 'Gümrük Vergisi Hesaplama 2026 — Paketim Gümrükte, Ne Yapmalıyım?',
    aciklama:
      '30 € muafiyeti kalktı: AliExpress, Temu, Amazon paketinize ne kadar gümrük vergisi çıkacağını 2026 oranlarıyla ücretsiz hesaplayın. Değmezse söyleriz; değerse adım adım kendiniz çekin veya müşavir bulun.',
    yol: '/',
  });

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      <section className="hero">
        <p className="hero-ust">6 Şubat 2026: 30 € muafiyeti kalktı</p>
        <h1>
          Paketin gümrükte mi kaldı?
          <br />
          <span className="vurgulu">Panik yok, plan var.</span>
        </h1>
        <p className="hero-alt">
          Yurt dışından gelen her paket artık vergiye tabi. Ne kadar
          ödeyeceğini hesapla, paketinin gerçekten değip değmediğini öğren —
          değiyorsa nasıl çekeceğini adım adım gör.
        </p>
        <div className="cta-grubu">
          <Link className="btn btn-buyuk" to="/hesapla">
            Ücretsiz hesapla →
          </Link>
          <Link className="btn btn-ikincil btn-buyuk" to="/rehber">
            Rehberlere göz at
          </Link>
        </div>
        <p className="hero-not">Üyelik yok · 30 saniye · Tarafsız öneri</p>
      </section>

      <section className="bolum">
        <h2>2026 vergi oranları bir bakışta</h2>
        <p className="bolum-alt">
          Bireysel gönderilerde kıymet üzerinden tek seferde alınır; ayrıca KDV
          uygulanmaz.
        </p>
        <div className="kart-izgara oran-izgara">
          {ORAN_KARTLARI.map((k) => (
            <div className="kart oran-kart" key={k.baslik}>
              <span className="oran-deger">{k.deger}</span>
              <strong>{k.baslik}</strong>
              <p>{k.detay}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bolum">
        <h2>Nasıl çalışır?</h2>
        <div className="kart-izgara adim-izgara">
          {ADIMLAR.map((a, i) => (
            <div className="kart adim-kart" key={a.baslik}>
              <span className="adim-no">{i + 1}</span>
              <strong>{a.baslik}</strong>
              <p>{a.detay}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bolum">
        <div className="kart uyari-blok">
          <h2>Sipariş vermeden önce bil</h2>
          <ul>
            <li>
              <strong>Cep telefonu</strong> ve <strong>kozmetik</strong>{' '}
              bireysel posta/kargo ile getirilemiyor — vergisi ödense bile.
            </li>
            <li>
              Sınırlar: gönderi başına <strong>1500 €</strong> kıymet,{' '}
              <strong>brüt 30 kg</strong>, ayda <strong>5 gönderi</strong>.
            </li>
            <li>
              İlaç ve takviye gıdalar için <strong>reçete/doktor raporu</strong>{' '}
              şartı var.
            </li>
            <li>
              Düşük kıymet beyanı cezalı vergiye yol açar — sipariş kanıtını
              sakla.
            </li>
          </ul>
        </div>
      </section>

      <section className="bolum">
        <h2>Sık sorulanlar</h2>
        {SSS.map((s) => (
          <details className="sss" key={s.soru}>
            <summary>{s.soru}</summary>
            <p>{s.cevap}</p>
          </details>
        ))}
      </section>

      <section className="cta-band">
        <h2>Paketin bekliyor, süre işliyor.</h2>
        <p>Ardiye birikmeden ne yapacağını öğren.</p>
        <Link className="btn btn-buyuk" to="/hesapla">
          Hemen hesapla →
        </Link>
      </section>
    </main>
  );
}

export default Home;
