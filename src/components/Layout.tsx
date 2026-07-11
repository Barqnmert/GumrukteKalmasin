import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="container">
      <nav className="ust-menu">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'aktif' : '')}>
          Hesapla
        </NavLink>
        <NavLink
          to="/rehber"
          className={({ isActive }) => (isActive ? 'aktif' : '')}
        >
          DIY Rehberler
        </NavLink>
        <NavLink
          to="/musavir"
          className={({ isActive }) => (isActive ? 'aktif' : '')}
        >
          Müşavir Bul
        </NavLink>
      </nav>
      <Outlet />
      <footer style={{ marginTop: '3rem', fontSize: '0.8rem', color: 'var(--renk-soluk)' }}>
        <p>
          Buradaki hesaplar 2026 referans oranlarıyla yapılan <strong>tahminlerdir</strong>,
          resmi gümrük beyanı yerine geçmez. Kesin tutarlar gümrük idaresinin
          tespitine göre değişebilir.
        </p>
      </footer>
    </div>
  );
}

export default Layout;
