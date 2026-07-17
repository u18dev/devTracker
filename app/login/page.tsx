import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen display-login">
      <section className="login-hero">
        <div className="logo-mark">DT</div>

        <div>
          <div className="eyebrow">Inventory Command</div>
          <h1 className="page-title">DeviceTrack</h1>
          <p className="page-description">
            Secure school device tracking, issuing, returns, reports, and mass
            inventory tools.
          </p>
        </div>
      </section>

      <LoginForm />
    </main>
  );
}