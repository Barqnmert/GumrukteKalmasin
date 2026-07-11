import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import TriageForm from './pages/TriageForm';
import Sonuc from './pages/Sonuc';

function Yakinda() {
  return (
    <main>
      <h1>Yakında</h1>
      <p>Bu bölüm üzerinde çalışıyoruz.</p>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TriageForm />} />
          <Route path="/sonuc" element={<Sonuc />} />
          <Route path="/rehber" element={<Yakinda />} />
          <Route path="/musavir" element={<Yakinda />} />
          <Route path="*" element={<Yakinda />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
