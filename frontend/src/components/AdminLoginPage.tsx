type AdminLoginPageProps = {
  form: {
    username: string
    password: string
  }
  onChange: (field: string, value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onBack: () => void
  error: string
}

export function AdminLoginPage({ form, onChange, onSubmit, onBack, error }: AdminLoginPageProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-badge">Admin access</p>
          <h1>Tinas Wholesome kitchen</h1>
        </div>
        <button type="button" className="admin-login-link" onClick={onBack}>
          Back to home
        </button>
      </header>

      <main className="admin-view">
        <section className="admin-panel">
          <div className="section-heading">
            <h3>Admin login</h3>
            <p>Sign in to manage menu and customer data.</p>
          </div>

          <form className="menu-form" onSubmit={onSubmit}>
            <label>
              Username
              <input
                type="text"
                value={form.username}
                onChange={(event) => onChange('username', event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={form.password}
                onChange={(event) => onChange('password', event.target.value)}
                required
              />
            </label>
            {error ? <div className="notice">{error}</div> : null}
            <button type="submit">Login</button>
          </form>
        </section>
      </main>
    </div>
  )
}
