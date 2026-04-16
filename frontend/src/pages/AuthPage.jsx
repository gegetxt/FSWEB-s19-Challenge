import AuthForm from '../components/AuthForm';
import StatusBanner from '../components/StatusBanner';

export default function AuthPage({ loading, status, onRegister, onLogin }) {
  return (
    <main className="auth-page">
      <section className="auth-layout">
        <div className="auth-hero">
          <span className="eyebrow">Sosyal Akis</span>
          <h1>Giris yap, neler oldugunu hemen gor.</h1>
          <p>
            Hesabina gir ya da yeni bir hesap olustur. Sonra akisa gecip gonderileri tek yerde takip et.
          </p>

          <div className="auth-feature-grid">
            <div className="feature-card">
              <strong>Hemen Basla</strong>
              <span>Giris yap ve akisa katil</span>
            </div>
            <div className="feature-card">
              <strong>Akis</strong>
              <span>Gonderileri tek bakista gor</span>
            </div>
            <div className="feature-card">
              <strong>Profil</strong>
              <span>Kullanici etkinliklerini bir arada incele</span>
            </div>
          </div>
        </div>

        <div className="auth-panel-stack">
          <AuthForm loading={loading} onRegister={onRegister} onLogin={onLogin} />
          <StatusBanner status={status} />
        </div>
      </section>
    </main>
  );
}
