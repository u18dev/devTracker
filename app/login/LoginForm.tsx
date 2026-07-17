"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {
  error: "",
};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form action={formAction} className="form-card form-section w-full max-w-md">
      <div className="form-section-header">
        <div>
          <span className="step-pill">
            <span className="step-number">1</span>
            Secure Access
          </span>

          <h1 className="form-section-title mt-3">
            Sign in to DeviceTrack
          </h1>

          <p className="form-section-description">
            Enter your admin login to access the inventory dashboard.
          </p>
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="email">
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          className="form-input"
          placeholder="admin@devicetrack.local"
          autoComplete="email"
          required
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
          placeholder="Enter password"
          autoComplete="current-password"
          required
        />
      </div>

      {state?.error && (
        <p className="form-alert form-alert-error">
          {state.error}
        </p>
      )}

      <div className="form-actions">
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </form>
  );
}