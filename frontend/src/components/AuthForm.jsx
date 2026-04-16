import { useState } from 'react';

const initialForm = {
  username: '',
  email: '',
  password: ''
};

export default function AuthForm({ loading, onRegister, onLogin }) {
  const [form, setForm] = useState(initialForm);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleRegister(event) {
    event.preventDefault();
    await onRegister(form);
  }

  async function handleLogin(event) {
    event.preventDefault();
    await onLogin(form);
  }

  return (
    <section className="auth-card">
      <div className="section-header">
        <span className="section-label">Hesap</span>
        <h2>Giris yap veya kaydol</h2>
      </div>

      <form className="form-grid" onSubmit={handleLogin}>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={updateField}
            placeholder="alice"
          />
        </label>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="alice@example.com"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            placeholder="123456"
          />
        </label>

        <div className="button-row">
          <button type="button" className="secondary-button" disabled={loading} onClick={handleRegister}>
            Kaydol
          </button>
          <button type="submit" className="primary-button" disabled={loading}>
            Giris Yap
          </button>
        </div>
      </form>
    </section>
  );
}
