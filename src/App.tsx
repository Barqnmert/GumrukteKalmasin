import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import TriageForm from './pages/TriageForm';
import Sonuc from './pages/Sonuc';
import RehberIndex from './pages/RehberIndex';
import RehberDetay from './pages/RehberDetay';
import MusavirForm from './pages/MusavirForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TriageForm />} />
          <Route path="/sonuc" element={<Sonuc />} />
          <Route path="/rehber" element={<RehberIndex />} />
          <Route path="/rehber/:slug" element={<RehberDetay />} />
          <Route path="/musavir" element={<MusavirForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
