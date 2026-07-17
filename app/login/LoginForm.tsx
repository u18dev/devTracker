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
    <form action="/api/login" method="post" className="form-card">
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

  <button type="submit" className="btn btn-primary">
    Login
  </button>
</form>
  );
}