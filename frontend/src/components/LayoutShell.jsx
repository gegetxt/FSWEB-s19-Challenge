import SidebarProfile from './SidebarProfile';

export default function LayoutShell({
  auth,
  currentView,
  onChangeView,
  onLogout,
  children
}) {
  return (
    <main className="layout-shell">
      <aside className="left-sidebar">
        <div className="sidebar-shell">
          <div className="brand-card compact">
            <span className="eyebrow">Akis</span>
            <p>Gundemi takip et, bir seyler paylas.</p>
          </div>

          <SidebarProfile auth={auth} />

          <nav className="nav-card">
            <button
              className={currentView === 'home' ? 'nav-button active' : 'nav-button'}
              onClick={() => onChangeView('home')}
            >
              Ana Sayfa
            </button>
            <button
              className={currentView === 'profile' ? 'nav-button active' : 'nav-button'}
              onClick={() => onChangeView('profile')}
            >
              Profil
            </button>
            <button className="nav-button logout" onClick={onLogout}>
              Cikis Yap
            </button>
          </nav>
        </div>
      </aside>

      <section className="content-column">{children}</section>
    </main>
  );
}
