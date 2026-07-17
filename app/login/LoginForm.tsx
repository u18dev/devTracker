"use client";

import { useState } from "react";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [debug, setDebug] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setDebug("Submitting to /api/login...");

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/login", {
      method: "POST",
      body: formData,
      credentials: "same-origin",
    });

    setDebug(`API response status: ${response.status}`);

    const data = await response.json();

    console.log("LOGIN API DATA:", data);
    console.log("LOGIN API STATUS:", response.status);

    if (!response.ok || !data.ok || !data.token) {
    setError(data.error || "Login failed.");
    return;
    }

            document.cookie =
            "devicetrack_session=" +
            encodeURIComponent(data.token) +
            "; path=/; max-age=28800; SameSite=Lax";

            console.log("COOKIE AFTER SET:", document.cookie);

            window.location.href = "/dashboard";
  }

  return (
    <section className="form-card" style={{ maxWidth: 460, width: "100%" }}>
      <div
        style={{
          padding: "8px 12px",
          borderRadius: 12,
          background: "#dcfce7",
          color: "#166534",
          fontWeight: 800,
          fontSize: 12,
          marginBottom: 14,
        }}
      >
        API LOGIN FLOW ACTIVE
      </div>

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

      {debug && <div className="form-alert form-alert-success">{debug}</div>}

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