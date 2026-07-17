export default function LoginForm() {
  return (
    <section className="form-card" style={{ maxWidth: 460, width: "100%" }}>
      <div className="form-section-header">
        <div className="step-pill">
          <span className="step-number">DT</span>
          Secure Access
        </div>

        <div>
          <div className="form-section-kicker">Staff Login</div>
          <h2 className="form-section-title">Sign In</h2>
          <p className="form-section-description">
            Enter your admin credentials to access DeviceTrack.
          </p>
        </div>
      </div>

      <form action="/api/login" method="post" className="space-y-5">
        <div className="form-field">
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            required
            autoComplete="email"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-input"
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
          Login
        </button>
      </form>
    </section>
  );
}