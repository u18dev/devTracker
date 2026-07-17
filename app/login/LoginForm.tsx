"use client";

import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/login", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
      redirect: "manual",
    });

    console.log("Login response status:", response.status);
    console.log("Login response location:", response.headers.get("location"));

    if (response.status === 303 || response.status === 200 || response.type === "opaqueredirect") {
      window.location.href = "/dashboard";
      return;
    }

    setError("Login failed. Check your email/password or server config.");
  }

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

      {error && <div className="form-alert form-alert-error">{error}</div>}

      <form onSubmit={handleLogin} className="space-y-5">
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